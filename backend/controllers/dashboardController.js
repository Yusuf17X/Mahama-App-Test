const catchAsync = require('../utils/catchAsync');
const UserChallenge = require('../models/userChallengeModel');
const { calculateTotalImpact } = require('../utils/ecoImpact');

// GET /api/v1/dashboard/public - No authentication required
exports.getPublicDashboard = catchAsync(async (req, res, next) => {
  // 1. Get all approved challenges with populated challenge data
  const approvedChallenges = await UserChallenge.find({ status: 'approved' })
    .populate('challenge_id');

  // 2. Calculate total eco impact using utility function
  const totalImpact = calculateTotalImpact(approvedChallenges);

  // 3. Get top 5 schools for leaderboard
  const User = require('../models/userModel');
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
    medal: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : undefined,
    name: school.name,
    city: school.city,
    points: school.totalPoints,
    students: school.studentCount,
  }));

  // 4. Return response with eco impact and top schools
  res.status(200).json({
    status: 'success',
    data: {
      ecoImpact: {
        co2Saved: Math.round(totalImpact.co2SavedKg * 100) / 100,
        waterSaved: Math.round(totalImpact.waterSavedLiters * 100) / 100,
        plasticSaved: Math.round(totalImpact.plasticSavedGrams / 1000 * 100) / 100, // Convert grams to kg
        energySaved: Math.round(totalImpact.energySavedKwh * 100) / 100,
        treesEquivalent: Math.round(totalImpact.treesEquivalent * 100) / 100,
        totalChallengesCompleted: approvedChallenges.length,
      },
      topSchools,
    },
  });
});
