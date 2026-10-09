import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding GrowMate initial demonstration data...");

  // Clean existing guest-default records if any
  await prisma.careTask.deleteMany({});
  await prisma.diagnosis.deleteMany({});
  await prisma.mission.deleteMany({});
  await prisma.gardenPlan.deleteMany({});
  await prisma.plant.deleteMany({});
  await prisma.garden.deleteMany({});

  // 1. Create Starter Garden
  const garden = await prisma.garden.create({
    data: {
      guestId: "guest-default",
      name: "Sunny South Balcony",
      location: "San Francisco, CA",
      gardenType: "balcony",
      spaceSize: "Balcony Railing & Floor (approx. 2.5m x 1.2m)",
      sunlightHours: 6,
      soilType: "Organic Potting Mix with Perlite & Worm Castings",
      experienceLevel: "beginner",
      interests: "herbs, vegetables, flowers",
      climate: "Temperate Mediterranean"
    }
  });

  // 2. Create Starter Plants
  const basil = await prisma.plant.create({
    data: {
      gardenId: garden.id,
      name: "Sweet Genovese Basil",
      species: "Ocimum basilicum",
      variety: "Genovese",
      sunlightReq: "6+ hours direct sunlight",
      wateringFreqDays: 2,
      notes: "Pinch top flower buds to preserve rich essential oils and bushy branching.",
      status: "healthy",
      lastWateredAt: new Date()
    }
  });

  const tomato = await prisma.plant.create({
    data: {
      gardenId: garden.id,
      name: "Sweet 100 Cherry Tomato",
      species: "Solanum lycopersicum",
      variety: "Sweet 100",
      sunlightReq: "6-8 hours direct sunlight",
      wateringFreqDays: 2,
      notes: "Staked in 5-gallon container. Water at soil level to prevent fungal splash.",
      status: "healthy",
      lastWateredAt: new Date()
    }
  });

  const mint = await prisma.plant.create({
    data: {
      gardenId: garden.id,
      name: "Moroccan Spearmint",
      species: "Mentha spicata",
      variety: "Moroccan",
      sunlightReq: "4-5 hours morning light",
      wateringFreqDays: 3,
      notes: "Kept in isolated 8-inch pot to prevent root runners spreading.",
      status: "healthy",
      lastWateredAt: new Date()
    }
  });

  // 3. Create Care Tasks
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const inThreeDays = new Date(today);
  inThreeDays.setDate(inThreeDays.getDate() + 3);

  const inFiveDays = new Date(today);
  inFiveDays.setDate(inFiveDays.getDate() + 5);

  await prisma.careTask.createMany({
    data: [
      {
        gardenId: garden.id,
        plantId: basil.id,
        title: "Pinch top leaves on Sweet Basil",
        taskType: "pruning",
        dueDate: today,
        notes: "Snip above the second node to encourage side branching."
      },
      {
        gardenId: garden.id,
        plantId: tomato.id,
        title: "Soil moisture depth check & watering",
        taskType: "watering",
        dueDate: tomorrow,
        notes: "Water deeply around the pot base until slight runoff."
      },
      {
        gardenId: garden.id,
        plantId: mint.id,
        title: "Harvest fresh mint sprigs for tea",
        taskType: "general",
        dueDate: inThreeDays,
        notes: "Cut outer stems 1 inch above soil."
      },
      {
        gardenId: garden.id,
        plantId: tomato.id,
        title: "Check tomato stake ties & lower leaves",
        taskType: "pest_check",
        dueDate: inFiveDays,
        notes: "Prune any yellowing bottom leaves touching soil."
      }
    ]
  });

  // 4. Create Today's Touch Grass Mission
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  await prisma.mission.create({
    data: {
      gardenId: garden.id,
      missionDate: dateStr,
      title: "Soil Hydration & Balcony Microclimate Audit",
      explanation: "Balcony wind and reflected wall heat can dry container soil much faster than ground soil. Feeling moisture depth prevents root stress.",
      durationMinutes: 10,
      materialsRequired: JSON.stringify([
        "Your index finger",
        "Watering can (optional if dry)",
        "Clean cloth to wipe container rims"
      ]),
      steps: JSON.stringify([
        "Leave your phone and screen inside. Step out into the balcony garden breeze.",
        "Insert your index finger 2 inches into the soil of the Basil and Cherry Tomato pots.",
        "If cool and damp, leave them alone. If crumbly and dry, give 500ml water directly at the root zone.",
        "Turn each container 90 degrees toward the sun.",
        "Take 5 deep breaths, enjoy the fresh outdoor air, then return to record your note."
      ]),
      plantId: basil.id,
      isFallback: false,
      modelAttribution: "Google Gemma 3 4B IT"
    }
  });

  console.log("✅ GrowMate seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
