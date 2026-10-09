/**
 * Mission Service - "Touch Grass Mode"
 * Generates and persists daily outdoor gardening missions.
 * Encourages users to leave screens, perform real-world horticultural actions, and return.
 */

import { z } from "zod";
import { callGemmaInference, extractJsonFromText } from "./gemmaService.js";

const MissionSchema = z.object({
  title: z.string().min(3),
  explanation: z.string().min(10),
  durationMinutes: z.number().int().min(3).max(60),
  materialsRequired: z.array(z.string()).min(1),
  steps: z.array(z.string()).min(2),
  plantFocus: z.string().optional()
});

export const FALLBACK_MISSIONS = [
  {
    title: "Finger Moisture & Soil Temperature Check",
    explanation: "Overwatering is the #1 cause of balcony plant loss. Touch real soil to test hydration depth.",
    durationMinutes: 8,
    materialsRequired: ["Your index finger or a dry wooden chopstick", "Watering can (only if needed)"],
    steps: [
      "Step outside to your plants without bringing any other screen distractions.",
      "Insert your index finger 1 to 2 inches into the container soil.",
      "If the soil feels cool and damp particles cling to your skin, leave it alone today.",
      "If the soil is dry and warm throughout, give the plant a gentle base soak.",
      "Take 3 deep breaths and observe new leaf growth before heading back inside."
    ]
  },
  {
    title: "Under-Leaf Pest & Stoma Inspection",
    explanation: "Pests like spider mites and aphids hide on the undersides of leaves where shade protects them.",
    durationMinutes: 10,
    materialsRequired: ["Clean damp cloth or soft sponge", "Pruning shears or scissors (optional)"],
    steps: [
      "Head outdoors and select 2 of your healthiest plants.",
      "Gently turn over 5-6 leaves on each plant and inspect along the main central vein.",
      "Look for tiny webbing, white residue, or discoloration.",
      "Gently wipe away dust from leaf surfaces with the damp cloth so the plant can breathe.",
      "Remove any completely dead brown leaves from the base of the pot."
    ]
  },
  {
    title: "Morning Sunlight & Shadow Mapping",
    explanation: "Balcony angles shift throughout the seasons. Mapping your light ensures your plants get adequate photons.",
    durationMinutes: 7,
    materialsRequired: ["Your eyes and hands", "Garden pot (if adjusting position)"],
    steps: [
      "Step into your garden area and feel where the direct solar warmth lands.",
      "Identify which pots are in full sun versus ambient shade right now.",
      "Rotate each pot 90 degrees so all sides of your plant foliage receive even light.",
      "Dust off the rim and saucers to prevent stagnant water pooling."
    ]
  },
  {
    title: "Deadheading & Airflow Pruning",
    explanation: "Removing spent flower blooms and congested inner leaves triggers fresh vegetative vigor and prevents mold.",
    durationMinutes: 12,
    materialsRequired: ["Clean pruning shears or garden snips", "Small bowl or bucket for green waste"],
    steps: [
      "Step outdoors with sanitized scissors or shears.",
      "Identify spent, brown, or fading flower heads on herbs or ornamentals.",
      "Snip cleanly just above the first set of healthy leaves below the spent flower.",
      "Remove any yellowed bottom leaves that touch the damp soil surface.",
      "Compost the cuttings or place them in organic waste."
    ]
  },
  {
    title: "Drainage Hole & Root Ventilation Check",
    explanation: "Compacted drainage holes lead to root rot. Checking container bottoms maintains vital oxygen flow.",
    durationMinutes: 10,
    materialsRequired: ["A small saucer or tray", "Garden gloves (optional)"],
    steps: [
      "Step outside and gently tilt your lightest container.",
      "Inspect the bottom drainage holes to confirm they are not blocked by roots or mud.",
      "Empty any standing water accumulated in collection trays.",
      "Gently loosen the top 0.5 inch of compacted crusty soil using a small fork or stick.",
      "Enjoy 2 minutes of fresh air and silence."
    ]
  },
  {
    title: "Herb Pinching for Bushy Canopy",
    explanation: "Pinching the terminal top growth buds of herbs like basil and mint forces the plant to branch sideways.",
    durationMinutes: 8,
    materialsRequired: ["Your clean fingernails or small snips"],
    steps: [
      "Visit your herb pots outdoors.",
      "Locate the very top pair of emerging baby leaves on the main central stem.",
      "Gently pinch or snip off the top stem just above a pair of lower leaves.",
      "Smell the fresh aromatic oils on your fingers!",
      "Save the pinched herb tips for today's cooking or tea."
    ]
  },
  {
    title: "Container Mulch & Microclimate Refresh",
    explanation: "Container soil dries out quickly under wind. A thin mulch layer stabilizes temperature and retains hydration.",
    durationMinutes: 15,
    materialsRequired: ["Handful of dry leaves, straw, bark chips, or coconut coir", "Watering can"],
    steps: [
      "Step outside with organic mulch material.",
      "Clear any debris or weeds from the soil surface.",
      "Spread a 1-inch layer of organic mulch around the plant, keeping it 1/2 inch away from the main stem.",
      "Lightly mist the mulch with water to settle it into place.",
      "Feel the ambient temperature difference beneath the mulch layer."
    ]
  }
];

/**
 * Get deterministic daily mission for a garden and date string (YYYY-MM-DD)
 */
export function getDeterministicDailyMission(garden, dateString) {
  // Use date hash for consistent day-based rotation
  let hash = 0;
  const key = `${dateString || "2026-10-08"}-${garden?.gardenType || "balcony"}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_MISSIONS.length;
  const template = FALLBACK_MISSIONS[index];

  return {
    title: template.title,
    explanation: template.explanation,
    durationMinutes: template.durationMinutes,
    materialsRequired: template.materialsRequired,
    steps: template.steps,
    plantFocus: garden?.plants?.[0]?.name || "Your Garden Plants",
    isFallback: true,
    modelAttribution: "GrowMate Horticultural Action Engine (Fallback)"
  };
}

/**
 * Generate a personalized Touch Grass mission with Gemma 3 4B IT or fallback
 */
export async function generateDailyMission(garden, dateString, plantList = []) {
  const gardenType = garden?.gardenType || "balcony";
  const sunlight = garden?.sunlightHours || 4;
  const plantsSummary = plantList.map(p => p.name).join(", ") || "container herbs and vegetables";

  const systemInstruction = 
`You are the Touch Grass Master for GrowMate.
Your mission is to generate practical, quick, screen-free outdoor gardening activities (5-15 minutes).
The user must read the mission, put their phone away, step outside to their garden, complete the task, and return.
Always return strictly JSON matching the required schema. No markdown formatting outside JSON.`;

  const userPrompt =
`Generate today's outdoor Touch Grass mission for:
- Date: ${dateString}
- Space: ${gardenType}
- Daily Sun: ${sunlight} hours
- Plants in garden: ${plantsSummary}

Format strictly as JSON:
{
  "title": "Inspiring action title (e.g., Soil Hydration Depth Audit)",
  "explanation": "Why this physical activity matters for plant health (1-2 sentences)",
  "durationMinutes": 10,
  "materialsRequired": ["Item 1", "Item 2"],
  "steps": [
    "Step 1: Put your phone down and go outside to your plants.",
    "Step 2: Concrete physical action.",
    "Step 3: Concrete physical observation.",
    "Step 4: Wrap up and return inside."
  ],
  "plantFocus": "Plant name if applicable or general"
}`;

  try {
    const rawOutput = await callGemmaInference(userPrompt, systemInstruction);
    const parsedJson = extractJsonFromText(rawOutput);

    if (parsedJson) {
      const validated = MissionSchema.safeParse(parsedJson);
      if (validated.success) {
        return {
          title: validated.data.title,
          explanation: validated.data.explanation,
          durationMinutes: validated.data.durationMinutes,
          materialsRequired: validated.data.materialsRequired,
          steps: validated.data.steps,
          plantFocus: validated.data.plantFocus || null,
          isFallback: false,
          modelAttribution: "Google Gemma 3 4B IT"
        };
      }
    }
    throw new Error("Unable to parse structured mission from Gemma response.");
  } catch (err) {
    console.info("Using deterministic fallback mission:", err.message);
    return getDeterministicDailyMission(garden, dateString);
  }
}
