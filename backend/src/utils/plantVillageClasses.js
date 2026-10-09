/**
 * PlantVillage 38-Class Mapping and Explanations
 * Model: kimcomehome/plantvillage-vit-leaf-disease
 * Dataset: PlantVillage (14 crop species, 38 healthy/diseased categories)
 */

export const PLANTVILLAGE_CLASSES = {
  "Apple___Apple_scab": {
    crop: "Apple",
    disease: "Apple Scab",
    isHealthy: false,
    explanation: "Fungal infection (Venturia inaequalis) causing olive-green to dark brown velvety spots on leaf surfaces.",
    nextSteps: [
      "Prune affected leaves and destroy fallen infected foliage to prevent spore spread.",
      "Ensure ample airflow through the canopy by thinning dense branches.",
      "Water at the base of the plant early in the day; avoid wetting foliage."
    ]
  },
  "Apple___Black_rot": {
    crop: "Apple",
    disease: "Black Rot",
    isHealthy: false,
    explanation: "Fungal disease (Botryosphaeria obtusa) producing circular brown leaf spots ('frog-eye' pattern) and branch cankers.",
    nextSteps: [
      "Prune out dead wood, mummified fruits, and infected twigs during dry weather.",
      "Sanitize pruning shears with 70% alcohol between cuts.",
      "Improve air circulation and sunlight penetration around the plant."
    ]
  },
  "Apple___Cedar_apple_rust": {
    crop: "Apple",
    disease: "Cedar Apple Rust",
    isHealthy: false,
    explanation: "Gymnosporangium fungal rust causing bright yellow-orange spots on the upper leaf surface.",
    nextSteps: [
      "Remove nearby alternative host juniper/cedar galls if possible.",
      "Remove severely damaged leaves from the garden area.",
      "Keep foliage dry and monitor during humid spring periods."
    ]
  },
  "Apple___healthy": {
    crop: "Apple",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "The apple leaf shows consistent green coloration with no visible signs of scab, rust, or rot lesions.",
    nextSteps: [
      "Maintain regular watering schedule suited to season and soil drainage.",
      "Continue periodic leaf inspections for early pest or nutrient signs."
    ]
  },
  "Blueberry___healthy": {
    crop: "Blueberry",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "The blueberry foliage shows vibrant, even pigmentation and healthy vascular integrity.",
    nextSteps: [
      "Maintain acidic soil pH (4.5–5.5) and consistent organic mulch.",
      "Water deeply with rainwater or non-alkaline water when topsoil dries."
    ]
  },
  "Cherry___Powdery_mildew": {
    crop: "Cherry",
    disease: "Powdery Mildew",
    isHealthy: false,
    explanation: "Podosphaera fungal mildew creating a white powdery dusting on leaf surfaces and tender shoots.",
    nextSteps: [
      "Prune crowded growth to enhance airflow and direct morning sunlight.",
      "Rinse spores off early in the morning so leaves dry quickly in sunlight.",
      "Consider mild organic sulfur or potassium bicarbonate spray if spreading rapidly."
    ]
  },
  "Cherry___healthy": {
    crop: "Cherry",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "The cherry leaf demonstrates healthy chlorophyll distribution without fungal coatings or shot-hole lesions.",
    nextSteps: [
      "Continue consistent garden hygiene and balanced watering."
    ]
  },
  "Corn___Cercospora_leaf_spot Gray_leaf_spot": {
    crop: "Corn",
    disease: "Gray Leaf Spot",
    isHealthy: false,
    explanation: "Cercospora zeae-maydis causing rectangular tan or gray lesions bounded by leaf veins.",
    nextSteps: [
      "Avoid overhead sprinkler irrigation; apply water directly to soil.",
      "Ensure adequate nitrogen fertility and crop rotation in the planting area."
    ]
  },
  "Corn___Common_rust": {
    crop: "Corn",
    disease: "Common Rust",
    isHealthy: false,
    explanation: "Puccinia sorghi rust producing cinnamon-brown to golden powdery pustules across both leaf sides.",
    nextSteps: [
      "Remove heavily dusted lower leaves if manageable.",
      "Improve air spacing between corn stalks."
    ]
  },
  "Corn___Northern_Leaf_Blight": {
    crop: "Corn",
    disease: "Northern Leaf Blight",
    isHealthy: false,
    explanation: "Exserohilum turcicum causing large, cigar-shaped grayish-green to tan lesions on foliage.",
    nextSteps: [
      "Remove infected lower debris to reduce overwintering spore reservoirs.",
      "Choose resistant companion crops and avoid prolonged leaf wetness."
    ]
  },
  "Corn___healthy": {
    crop: "Corn",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Vibrant and clear maize foliage without rust pustules or elongated lesions.",
    nextSteps: [
      "Maintain standard corn watering and full sun exposure."
    ]
  },
  "Grape___Black_rot": {
    crop: "Grape",
    disease: "Black Rot",
    isHealthy: false,
    explanation: "Guignardia bidwellii fungal infection producing small reddish-brown spots that develop dark borders and black pycnidia dots.",
    nextSteps: [
      "Trim out infected vine segments and remove dried mummies.",
      "Prune grapevine canopy to promote wind flow and sun exposure."
    ]
  },
  "Grape___Esca_(Black_Measles)": {
    crop: "Grape",
    disease: "Esca (Black Measles)",
    isHealthy: false,
    explanation: "Complex fungal trunk disease causing distinctive 'tiger stripe' interveinal chlorosis and leaf necrosis.",
    nextSteps: [
      "Avoid pruning wounds during rainy seasons to prevent spore entry.",
      "Support vine vigor through gentle organic feeding and stress reduction."
    ]
  },
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    crop: "Grape",
    disease: "Leaf Blight (Isariopsis)",
    isHealthy: false,
    explanation: "Phaeoisariopsis clavispora causing irregular angular reddish-brown leaf spots that can lead to premature defoliation.",
    nextSteps: [
      "Rake and compost or discard fallen grape leaves.",
      "Water soil level only."
    ]
  },
  "Grape___healthy": {
    crop: "Grape",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Healthy grape vine leaf with rich color and intact venation.",
    nextSteps: [
      "Keep trellised and pruned for maximum airflow."
    ]
  },
  "Orange___Haunglongbing_(Citrus_greening)": {
    crop: "Orange / Citrus",
    disease: "Huanglongbing (Citrus Greening)",
    isHealthy: false,
    explanation: "Bacterial pathogen (Candidatus Liberibacter) transmitted by psyllid insects, causing asymmetric yellow blotches on leaves.",
    nextSteps: [
      "Inspect for citrus psyllid insect vectors.",
      "Consult local agricultural extension for citrus quarantine guidelines in your region.",
      "Maintain micronutrient fertilization (zinc, iron, manganese) to support resilience."
    ]
  },
  "Peach___Bacterial_spot": {
    crop: "Peach",
    disease: "Bacterial Spot",
    isHealthy: false,
    explanation: "Xanthomonas arboricola causing small, angular purple-black spots that often drop out leaving a 'shot hole' appearance.",
    nextSteps: [
      "Avoid handling wet trees to prevent bacterial transmission.",
      "Provide balanced nitrogen (avoid excess soft vegetative growth)."
    ]
  },
  "Peach___healthy": {
    crop: "Peach",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Clear, glossy peach foliage showing no bacterial lesions or leaf curl symptoms.",
    nextSteps: [
      "Maintain deep watering schedule and organic mulch."
    ]
  },
  "Pepper,_bell___Bacterial_spot": {
    crop: "Bell Pepper",
    disease: "Bacterial Spot",
    isHealthy: false,
    explanation: "Xanthomonas bacteria causing water-soaked lesions that turn brown with yellow halos.",
    nextSteps: [
      "Avoid top watering; keep pepper foliage dry.",
      "Remove and discard severely affected bottom leaves.",
      "Sanitize hands and gardening tools before touching other nightshade plants."
    ]
  },
  "Pepper,_bell___healthy": {
    crop: "Bell Pepper",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Uniform green bell pepper leaf with healthy cuticle and no chlorotic spotting.",
    nextSteps: [
      "Ensure 6+ hours of sunlight and consistent moisture."
    ]
  },
  "Potato___Early_blight": {
    crop: "Potato",
    disease: "Early Blight",
    isHealthy: false,
    explanation: "Alternaria solani fungal infection displaying concentric rings ('target board' pattern) surrounded by yellowing.",
    nextSteps: [
      "Remove lower infected leaves touching the soil.",
      "Apply mulch around potato plants to prevent soil-splashed spores.",
      "Water exclusively at soil level in early mornings."
    ]
  },
  "Potato___Late_blight": {
    crop: "Potato",
    disease: "Late Blight",
    isHealthy: false,
    explanation: "Phytophthora infestans water mold creating dark, water-soaked lesions with white mold fuzz on the underside during humid weather.",
    nextSteps: [
      "Urgently remove and bag infected leaves to prevent rapid spore dissemination.",
      "Ensure good ventilation between plants and avoid wetting foliage.",
      "Monitor nearby tomato and potato plants closely."
    ]
  },
  "Potato___healthy": {
    crop: "Potato",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Healthy potato foliage free of Alternaria concentric rings or Phytophthora blight.",
    nextSteps: [
      "Maintain soil hilling and steady hydration."
    ]
  },
  "Raspberry___healthy": {
    crop: "Raspberry",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Lush, serrated raspberry leaf with intact veins and healthy pigmentation.",
    nextSteps: [
      "Keep canes staked and weed-free."
    ]
  },
  "Soybean___healthy": {
    crop: "Soybean",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Healthy trifoliate soybean leaf with normal chlorophyll depth.",
    nextSteps: [
      "Ensure balanced soil moisture and sunlight."
    ]
  },
  "Squash___Powdery_mildew": {
    crop: "Squash / Zucchini",
    disease: "Powdery Mildew",
    isHealthy: false,
    explanation: "Podosphaera xanthii forming powdery white patches on squash leaves, often in warm dry weather after humid nights.",
    nextSteps: [
      "Prune older, shaded interior leaves to boost airflow and sunlight.",
      "Apply organic neem oil or dilute milk spray (1:9 with water) in mild sunlight.",
      "Water at root level without wetting large squash leaves."
    ]
  },
  "Strawberry___Leaf_scorch": {
    crop: "Strawberry",
    disease: "Leaf Scorch",
    isHealthy: false,
    explanation: "Diplocarpon earlianum causing numerous purplish angular spots that enlarge and give the foliage a scorched, dried appearance.",
    nextSteps: [
      "Remove scorched older leaves after harvesting fruit.",
      "Renew strawberry mulch with clean straw to keep leaves off damp soil.",
      "Ensure proper plant spacing for quick canopy drying."
    ]
  },
  "Strawberry___healthy": {
    crop: "Strawberry",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Bright green strawberry leaf without scorch blemishes or leaf spot rings.",
    nextSteps: [
      "Water regularly around base and keep fruit elevated with straw."
    ]
  },
  "Tomato___Bacterial_spot": {
    crop: "Tomato",
    disease: "Bacterial Spot",
    isHealthy: false,
    explanation: "Xanthomonas bacterial pathogen causing small, dark, greasy spots on foliage that may yellow around edges.",
    nextSteps: [
      "Never work with tomato vines while foliage is wet.",
      "Mulch soil to stop bacterial splash-back during rain or watering.",
      "Remove bottom 12 inches of foliage to promote bottom ventilation."
    ]
  },
  "Tomato___Early_blight": {
    crop: "Tomato",
    disease: "Early Blight",
    isHealthy: false,
    explanation: "Alternaria linariae producing brown spots with distinct concentric rings ('bullseye' appearance) on older bottom leaves first.",
    nextSteps: [
      "Prune off all lower affected leaves showing bullseye spots.",
      "Lay 2 inches of organic mulch (straw or shredded bark) over bare soil.",
      "Water roots only, preferably using drip or direct can watering."
    ]
  },
  "Tomato___Late_blight": {
    crop: "Tomato",
    disease: "Late Blight",
    isHealthy: false,
    explanation: "Phytophthora infestans causing rapidly expanding dark grey/black water-soaked lesions that quickly wilt foliage in cool, wet weather.",
    nextSteps: [
      "Isolate and gently cut away severely blighted foliage in dry weather.",
      "Ensure maximum ventilation in greenhouses or sheltered balconies.",
      "Do not compost infected tissue; dispose in household waste."
    ]
  },
  "Tomato___Leaf_Mold": {
    crop: "Tomato",
    disease: "Leaf Mold",
    isHealthy: false,
    explanation: "Passalora fulva causing pale green or yellow spots on the upper leaf with olive-velvety fungal growth on the underside.",
    nextSteps: [
      "Significantly increase ventilation and reduce ambient humidity around tomato plants.",
      "Space plants at least 18-24 inches apart.",
      "Prune sucker branches to open up the canopy to breeze and light."
    ]
  },
  "Tomato___Septoria_leaf_spot": {
    crop: "Tomato",
    disease: "Septoria Leaf Spot",
    isHealthy: false,
    explanation: "Septoria lycopersici forming numerous small circular spots with dark brown margins and light grey or tan centers.",
    nextSteps: [
      "Prune infected lower foliage immediately before it climbs upward.",
      "Keep soil mulched to prevent spores splashing from soil during watering.",
      "Sanitize stakes and clips between seasons."
    ]
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    crop: "Tomato",
    disease: "Two-Spotted Spider Mites",
    isHealthy: false,
    explanation: "Tetranychus urticae pests causing fine yellow stippling/speckling on leaves, accompanied by fine silky webbing under leaves.",
    nextSteps: [
      "Spray the undersides of leaves with a firm stream of water to dislodge mites.",
      "Apply insecticidal soap or horticultural neem oil in the evening.",
      "Increase humidity around balcony plants if conditions are excessively dry and dusty."
    ]
  },
  "Tomato___Target_Spot": {
    crop: "Tomato",
    disease: "Target Spot",
    isHealthy: false,
    explanation: "Corynespora cassiicola causing small brown lesions with light centers and distinct concentric rings that spread through the canopy.",
    nextSteps: [
      "Improve air movement through pruning and staking.",
      "Remove infected leaves promptly to slow canopy transmission."
    ]
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    crop: "Tomato",
    disease: "Yellow Leaf Curl Virus",
    isHealthy: false,
    explanation: "Begomovirus transmitted by whiteflies, causing upward curling of leaf margins, severe yellowing, and stunted bushy growth.",
    nextSteps: [
      "Check for tiny whiteflies underneath leaves; use yellow sticky traps.",
      "Support plant nutrition and gently shade if heat stress is exacerbating curl.",
      "Cover young plants with fine insect mesh in high-whitefly seasons."
    ]
  },
  "Tomato___Tomato_mosaic_virus": {
    crop: "Tomato",
    disease: "Tomato Mosaic Virus",
    isHealthy: false,
    explanation: "Tobamovirus causing mottled light/dark green mosaic patterns, leaf distortion, and fern-like strapping on new growth.",
    nextSteps: [
      "Wash hands thoroughly before handling plants (especially if using tobacco products).",
      "Sanitize garden tools with 20% milk or disinfectant solution.",
      "Do not prune plants when damp."
    ]
  },
  "Tomato___healthy": {
    crop: "Tomato",
    disease: "Healthy Leaf",
    isHealthy: true,
    explanation: "Vigorous tomato leaf showing deep green color, healthy trichomes (hairs), and no fungal or viral lesions.",
    nextSteps: [
      "Continue consistent watering and staking for fruit production.",
      "Prune bottom leaves touching soil as proactive prevention."
    ]
  }
};

export const SUPPORTED_PLANTS_LIST = [
  "Apple", "Blueberry", "Cherry", "Corn (Maize)", "Grape",
  "Orange / Citrus", "Peach", "Bell Pepper", "Potato", "Raspberry",
  "Soybean", "Squash / Zucchini", "Strawberry", "Tomato"
];

/**
 * Format a class name into structured diagnostic information
 */
export function formatDiagnosisResult(rawClassName, confidenceScore = null) {
  const normalizedKey = Object.keys(PLANTVILLAGE_CLASSES).find(
    k => k.toLowerCase() === (rawClassName || '').toLowerCase()
  ) || rawClassName;

  const info = PLANTVILLAGE_CLASSES[normalizedKey];

  if (!info) {
    return {
      predictedClass: rawClassName || "Unknown / Unclassified",
      crop: "Unknown Plant",
      disease: "Uncertain Detection",
      isHealthy: false,
      confidenceScore: typeof confidenceScore === 'number' ? Math.min(Math.max(confidenceScore, 0), 1) : null,
      plainExplanation: "The uploaded leaf does not clearly match the 38 supported categories in the PlantVillage dataset (14 common fruits and vegetables). It may be a different plant species or the image lighting/angle was ambiguous.",
      cautiousNextSteps: [
        "Ensure the leaf belongs to one of the 14 supported crops: Apple, Blueberry, Cherry, Corn, Grape, Citrus, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, or Tomato.",
        "Take a clear, well-lit photo focusing on a single leaf with the problem area clearly visible.",
        "Inspect the plant physically for pests, overwatering, or dry soil."
      ],
      supportedClassesCount: Object.keys(PLANTVILLAGE_CLASSES).length,
      disclaimer: "AI-assisted screening only. Not an official agricultural or laboratory diagnosis."
    };
  }

  return {
    predictedClass: normalizedKey,
    crop: info.crop,
    disease: info.disease,
    isHealthy: info.isHealthy,
    confidenceScore: typeof confidenceScore === 'number' ? Math.min(Math.max(confidenceScore, 0), 1) : null,
    plainExplanation: info.explanation,
    cautiousNextSteps: info.nextSteps,
    supportedClassesCount: Object.keys(PLANTVILLAGE_CLASSES).length,
    disclaimer: "AI-assisted screening only. Physical observation, soil checks, and local extension guidance are recommended before taking drastic measures."
  };
}
