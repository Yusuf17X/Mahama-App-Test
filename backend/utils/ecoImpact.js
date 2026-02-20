const UserChallenge = require("../models/userChallengeModel");

const ENCOURAGING_PHRASES = {
  co2: "🌟 رائع! لقد قللت من انبعاثات CO₂ بمقدار {value} كجم!",
  water: "💧 مذهل! وفرت {value} لتر من الماء!",
  plastic: "♻️ أحسنت! أنقذت {value} جرام من البلاستيك!",
  trees: "🌳 بفضلك، ستمتص الأشجار {value} كجم من CO₂ سنوياً!",
  energy: "⚡ ممتاز! وفرت {value} كيلوواط من الطاقة!",
  default: "🏆 أحسنت! أنت تساهم في حماية كوكبنا!",
};

/**
 * Calculate total eco impact from an array of completed challenges
 * @returns {Object} Total eco impact metrics
 */
exports.calculateTotalImpact = async () => {
  const totalImpact = await UserChallenge.aggregate([
    {
      $lookup: {
        from: "challenges",
        localField: "challenge_id",
        foreignField: "_id",
        as: "challenge",
      },
    },
    { $unwind: "$challenge" },
    { $replaceRoot: { newRoot: "$challenge" } },
    {
      $group: {
        _id: null,
        co2SavedKg: { $sum: "$ecoImpact.co2SavedKg" },
        co2AbsorbedKgPerYear: { $sum: "$ecoImpact.co2AbsorbedKgPerYear" },
        waterSavedLiters: { $sum: "$ecoImpact.waterSavedLiters" },
        plasticSavedGrams: { $sum: "$ecoImpact.plasticSavedGrams" },
        energySavedKwh: { $sum: "$ecoImpact.energySavedKwh" },
        treesEquivalent: { $sum: "$ecoImpact.treesEquivalent" },
      },
    },
  ]);

  if (totalImpact.length === 0) {
    return {
      co2SavedKg: 0,
      co2AbsorbedKgPerYear: 0,
      waterSavedLiters: 0,
      plasticSavedGrams: 0,
      energySavedKwh: 0,
      treesEquivalent: 0,
    };
  }

  const { _id, ...totals } = totalImpact[0];
  return totals;
};

/**
 * Generate an encouraging phrase in Arabic based on the highest impact metric
 * @param {Object} impact - Eco impact object from a challenge
 * @returns {String} Encouraging phrase
 */
exports.generateEncouragingPhrase = (impact) => {
  if (!impact) {
    return ENCOURAGING_PHRASES.default;
  }

  // Find the highest impact metric
  const metrics = [
    {
      key: "co2",
      value: (impact.co2SavedKg || 0) + (impact.co2AbsorbedKgPerYear || 0),
    },
    { key: "water", value: impact.waterSavedLiters || 0 },
    { key: "plastic", value: impact.plasticSavedGrams || 0 },
    { key: "energy", value: impact.energySavedKwh || 0 },
  ];

  // Sort by value and find the highest non-zero metric
  const highestMetric = metrics
    .sort((a, b) => b.value - a.value)
    .find((m) => m.value > 0);

  if (!highestMetric) {
    // If trees equivalent is set, use that
    if (impact.treesEquivalent > 0) {
      return ENCOURAGING_PHRASES.trees.replace(
        "{value}",
        impact.co2AbsorbedKgPerYear || 0,
      );
    }
    return ENCOURAGING_PHRASES.default;
  }

  // Return the appropriate phrase
  const phrase = ENCOURAGING_PHRASES[highestMetric.key];
  return phrase
    ? phrase.replace("{value}", highestMetric.value)
    : ENCOURAGING_PHRASES.default;
};
