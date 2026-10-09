/**
 * Garden Planner Service
 * Generates tailored plant care plans using Google Gemma 3 4B IT
 * Includes schema validation and deterministic labeled fallbacks.
 */

import { z } from "zod";
import { callGemmaInference, extractJsonFromText } from "./gemmaService.js";

// Validation schema for generated garden plan
const GardenPlanSchema = z.object({
  summary: z.string().min(10),
  recommendedPlants: z.array(
    z.object({
      name: z.string(),
      species: z.string().optional(),
      sunlightReq: z.string(),
      wateringGuidance: z.string(),
      spaceNeeded: z.string(),
      soilGuidance: z.string(),
      whySuitable: z.string(),
      careTip: z.string()
    })
  ).min(1),
  soilPreparation: z.string().optional(),
  firstWeekPlan: z.array(
    z.object({
      day: z.string(),
      action: z.string(),
      detail: z.string()
    })
  ).min(2),
  outdoorMissionIdea: z.string().optional()
});

/**
 * Generate a garden plan using Gemma 3 4B IT or deterministic fallback
 */
export async function generateGardenPlan(gardenData) {
  const {
    name = "My Garden",
    gardenType = "balcony",
    spaceSize = "Small Balcony (approx. 2x1m)",
    sunlightHours = 4,
    soilType = "Potting Mix",
    experienceLevel = "beginner",
    interests = "herbs, vegetables",
    climate = "Temperate"
  } = gardenData;

  const systemInstruction = 
`You are an expert horticulturalist and gardening companion for beginners.
Your goal is to provide practical, achievable gardening advice tailored strictly to the user's space and sunlight constraints.
Always return output ONLY in valid JSON format matching the requested schema. Do not include markdown code blocks, preamble, or conversational commentary outside the JSON.`;

  const userPrompt =
`Create a beginner-friendly garden plan for:
- Garden Name: "${name}"
- Garden Type: "${gardenType}"
- Space Available: "${spaceSize}"
- Daily Sunlight: ${sunlightHours} hours of direct sunlight
- Soil / Medium: "${soilType}"
- Gardener Experience: "${experienceLevel}"
- Interests: "${interests}"
- Climate / Region: "${climate}"

Return a JSON object with this exact structure:
{
  "summary": "2-3 sentences introducing the strategy and why these choices work for this space.",
  "recommendedPlants": [
    {
      "name": "Plant common name (e.g., Sweet Basil)",
      "species": "Botanical name (e.g., Ocimum basilicum)",
      "sunlightReq": "e.g., 4-6 hours direct light",
      "wateringGuidance": "e.g., Water when top 1 inch of soil feels dry",
      "spaceNeeded": "e.g., 6-8 inch pot with drainage",
      "soilGuidance": "e.g., Well-draining potting soil with perlite",
      "whySuitable": "Why it thrives in ${sunlightHours}h sun and ${gardenType}",
      "careTip": "One key actionable tip for beginners"
    }
  ],
  "soilPreparation": "Practical advice for preparing the growing medium in this space.",
  "firstWeekPlan": [
    {
      "day": "Day 1",
      "action": "Task title",
      "detail": "Clear step-by-step guidance to complete outside"
    },
    {
      "day": "Day 3",
      "action": "Task title",
      "detail": "Clear step-by-step guidance"
    },
    {
      "day": "Day 7",
      "action": "Task title",
      "detail": "Clear step-by-step guidance"
    }
  ],
  "outdoorMissionIdea": "A 10-minute real-world outdoor task to touch grass and observe the garden space."
}`;

  try {
    const rawOutput = await callGemmaInference(userPrompt, systemInstruction);
    const parsedJson = extractJsonFromText(rawOutput);

    if (parsedJson) {
      const validated = GardenPlanSchema.safeParse(parsedJson);
      if (validated.success) {
        return {
          plan: validated.data,
          isFallback: false,
          modelAttribution: "Google Gemma 3 4B IT"
        };
      }
      console.warn("Gemma response did not fully match schema, falling back to parsed JSON or structured template:", validated.error);
      if (parsedJson.recommendedPlants && parsedJson.recommendedPlants.length > 0) {
        return {
          plan: {
            summary: parsedJson.summary || `Personalized garden plan for your ${gardenType}.`,
            recommendedPlants: parsedJson.recommendedPlants,
            soilPreparation: parsedJson.soilPreparation || "Use well-draining organic potting soil with drainage holes.",
            firstWeekPlan: parsedJson.firstWeekPlan || getDefaultFirstWeekPlan(),
            outdoorMissionIdea: parsedJson.outdoorMissionIdea || "Step outside and check sunlight positions across your garden space."
          },
          isFallback: false,
          modelAttribution: "Google Gemma 3 4B IT"
        };
      }
    }
    throw new Error("Unable to extract valid JSON plan from Gemma output.");
  } catch (err) {
    console.info("Using deterministic fallback garden plan:", err.message);
    return {
      plan: getDeterministicFallbackPlan(gardenData),
      isFallback: true,
      fallbackReason: err.code === "MISSING_API_KEY" ? "AI API key not configured" : err.message,
      modelAttribution: "GrowMate Deterministic Horticultural Engine (Fallback)"
    };
  }
}

function getDefaultFirstWeekPlan() {
  return [
    {
      day: "Day 1",
      action: "Space & Sun Audit",
      detail: "Go outside to your garden space at 9am, 1pm, and 4pm to map how sunlight and shadows move across your area."
    },
    {
      day: "Day 3",
      action: "Pot & Soil Preparation",
      detail: "Clean your containers, ensure drainage holes are clear, and fill with moistened potting mix leaving 1 inch at the rim."
    },
    {
      day: "Day 7",
      action: "Planting & Initial Watering",
      detail: "Plant your seeds or nursery starts at recommended depths, water gently at the base, and place in optimal light."
    }
  ];
}

export function getDeterministicFallbackPlan(gardenData) {
  const { gardenType = "balcony", sunlightHours = 4, interests = "herbs, vegetables" } = gardenData;
  const isLowSun = Number(sunlightHours) < 5;

  let plants = [];

  if (interests.toLowerCase().includes("flower")) {
    plants.push(
      {
        name: "Marigold (Tagetes)",
        species: "Tagetes patula",
        sunlightReq: isLowSun ? "4+ hours filtered sunlight" : "6+ hours direct sunlight",
        wateringGuidance: "Allow top inch of soil to dry between waterings. Avoid soaking leaves.",
        spaceNeeded: "6-8 inch pot with bottom drainage",
        soilGuidance: "Standard well-draining potting soil",
        whySuitable: `Hardy and adaptable for ${gardenType} growing; repels common balcony pests naturally.`,
        careTip: "Deadhead spent blooms regularly to stimulate continuous flowering."
      },
      {
        name: "Sweet Alyssum",
        species: "Lobularia maritima",
        sunlightReq: "4-6 hours partial to full sunlight",
        wateringGuidance: "Keep soil moderately moist; water early in the morning.",
        spaceNeeded: "Shallow window box or hanging basket",
        soilGuidance: "Light potting mix with perlite",
        whySuitable: "Thrives in compact container spaces and attracts beneficial pollinators.",
        careTip: "Shear back lightly if stems become leggy after initial flush of blooms."
      }
    );
  }

  if (interests.toLowerCase().includes("herb") || plants.length === 0) {
    plants.push(
      {
        name: isLowSun ? "Spearmint / Mint" : "Sweet Basil",
        species: isLowSun ? "Mentha spicata" : "Ocimum basilicum",
        sunlightReq: isLowSun ? "3-5 hours partial sunlight" : "5-7 hours direct sunlight",
        wateringGuidance: isLowSun ? "Keep soil evenly moist but not waterlogged" : "Water deeply when top inch of soil feels dry",
        spaceNeeded: "8-inch container with drainage (keep mint in dedicated pot)",
        soilGuidance: "Nutrient-rich potting mix with good drainage",
        whySuitable: `Fast-growing and extremely resilient for beginner ${gardenType} setups.`,
        careTip: isLowSun ? "Pinch growing tips to encourage bushy side shoots." : "Pinch flower buds as soon as they appear to preserve leaf flavor."
      },
      {
        name: "Chives",
        species: "Allium schoenoprasum",
        sunlightReq: "4-6 hours sunlight",
        wateringGuidance: "Water when the top 0.5 inch is dry.",
        spaceNeeded: "6-inch pot or mixed container border",
        soilGuidance: "Standard potting mix enriched with organic compost",
        whySuitable: "Tolerates partial shade, requires minimal space, and regrows continuously after harvesting.",
        careTip: "Harvest from the base using clean scissors, leaving 2 inches of growth."
      }
    );
  }

  if (interests.toLowerCase().includes("veg") && plants.length < 3) {
    plants.push({
      name: isLowSun ? "Loose-Leaf Lettuce" : "Cherry Tomato",
      species: isLowSun ? "Lactuca sativa" : "Solanum lycopersicum var. cerasiforme",
      sunlightReq: isLowSun ? "3-4 hours gentle sun or bright shade" : "6+ hours direct sunlight",
      wateringGuidance: isLowSun ? "Frequent light waterings to prevent shallow root drying" : "Consistent deep watering around roots; never let soil fully dry out",
      spaceNeeded: isLowSun ? "Shallow 6-inch planter tray" : "5-gallon bucket or 12-inch pot with sturdy stake/cage",
      soilGuidance: "High-organic matter potting mix with slow-release organic fertilizer",
      whySuitable: isLowSun 
        ? "Greens thrive in cooler conditions and lower sunlight without bolting quickly." 
        : "Prolific yields in sunny compact spaces.",
      careTip: isLowSun ? "Harvest outer leaves individually ('cut and come again')." : "Prune lower suckers to direct energy into fruit trusses."
    });
  }

  return {
    summary: `Structured ${gardenType} plan calibrated for ${sunlightHours} hours of daily sunlight. Focuses on low-maintenance varieties with high container success rates.`,
    recommendedPlants: plants,
    soilPreparation: "Select a light, peat or coco-coir based container potting mix amended with 20% perlite to ensure fast drainage. Avoid heavy garden topsoil in pots.",
    firstWeekPlan: getDefaultFirstWeekPlan(),
    outdoorMissionIdea: "Step outside to your garden space for 10 minutes: feel the soil moisture with your finger and clear away dried leaves."
  };
}
