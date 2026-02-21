const catchAsync = require("../utils/catchAsync");
const { calculateTotalImpact } = require("../utils/ecoImpact");
const User = require("../models/userModel");

exports.getPublicDashboard = catchAsync(async (req, res, next) => {
  // 1. Calculate total eco impact using utility function
  const totalImpact = await calculateTotalImpact();

  // 2. Get top 5 schools for leaderboard
  const topSchoolsData = await User.aggregate([
    {
      $match: {
        school_id: { $exists: true, $ne: null },
        active: { $ne: false },
      },
    },
    {
      $group: {
        _id: "$school_id",
        totalPoints: { $sum: "$points" },
        studentCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalPoints: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "schools",
        localField: "_id",
        foreignField: "_id",
        as: "schoolInfo",
      },
    },
    {
      $unwind: "$schoolInfo",
    },
    {
      $project: {
        _id: 1,
        name: "$schoolInfo.name",
        city: "$schoolInfo.city",
        totalPoints: 1,
        studentCount: 1,
      },
    },
  ]);

  // Map to frontend format with medals
  const topSchools = topSchoolsData.map((school, index) => ({
    rank: index + 1,
    medal:
      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : undefined,
    name: school.name,
    city: school.city,
    points: school.totalPoints,
    students: school.studentCount,
  }));

  // 3. Return response with eco impact and top schools
  res.status(200).json({
    status: "success",
    data: {
      ecoImpact: {
        co2Saved: Math.round(totalImpact.co2SavedKg * 100) / 100,
        waterSaved: Math.round(totalImpact.waterSavedLiters * 100) / 100,
        plasticSaved:
          Math.round((totalImpact.plasticSavedGrams * 100) / 1000) / 100,
        energySaved: Math.round(totalImpact.energySavedKwh * 100) / 100,
        treesEquivalent: Math.round(totalImpact.treesEquivalent * 100) / 100,
        totalChallengesCompleted: totalImpact.totalChallengesCompleted || 0,
      },
      topSchools,
    },
  });
});
