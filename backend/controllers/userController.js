const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const userChallenge = require("./../models/userChallengeModel");
const userBadge = require("./../models/userBadgeModel");
const Badge = require("./../models/badgeModel");
const { calculateTotalImpact } = require("./../utils/ecoImpact");
const { formatMemberSince } = require("./../utils/translations");
const {
  getTeacherChallengeIds,
  calcLevel,
  countCompletedChallenges,
  calculateStreak,
  getActivities,
  getLeaderboard,
} = require("../utils/calcStats");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload images only.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) newObj[ele] = obj[ele];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

exports.getProfile = catchAsync(async (req, res, next) => {
  // Get user with populated school
  const user = await User.findById(req.user._id).populate(
    "school_id",
    "name city",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Calculate level based on points
  const level = calcLevel(user.points);

  // Get completed challenges count based on role
  const completedChallenges = await countCompletedChallenges(
    user,
    userChallenge,
    req,
  );

  // Calculate streak
  const streak = calculateStreak(user);

  // Format member since date
  const memberSinceFormatted = formatMemberSince(user.createdAt);

  // Get all badges and check which ones the user has earned
  const allBadges = await Badge.find();
  const userBadgesData = await userBadge.find({ user_id: req.user._id });
  const earnedBadgeIds = userBadgesData.map((ub) => ub.badge_id.toString());

  const badges = allBadges.map((badge) => ({
    _id: badge._id.toString(),
    name: badge.name,
    emoji: badge.icon,
    earned: earnedBadgeIds.includes(badge._id.toString()),
  }));

  // Get user's approved challenges to calculate eco impact based on role
  let approvedUserChallenges;
  if (user.role === "teacher") {
    // Teachers: get all approved challenges for school tasks they advise
    const challengeIds = await getTeacherChallengeIds(user._id);
    approvedUserChallenges = await userChallenge
      .find({
        challenge_id: { $in: challengeIds },
        status: "approved",
      })
      .populate("challenge_id");
  } else {
    // Regular users and admins: get their own approved challenges
    approvedUserChallenges = await userChallenge
      .find({ user_id: req.user._id, status: "approved" })
      .populate("challenge_id");
  }

  const totalImpact = calculateTotalImpact(approvedUserChallenges);

  // Get last 5 activities (merge UserChallenges and UserBadges) based on role
  let userChallenges;
  if (user.role === "teacher") {
    // Teachers: get challenges they've advised that were approved
    const challengeIds = await getTeacherChallengeIds(user._id);
    userChallenges = await userChallenge
      .find({
        challenge_id: { $in: challengeIds },
        status: "approved",
      })
      .populate("challenge_id", "name points")
      .populate("user_id", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  } else {
    // Regular users and admins: get their own challenges
    userChallenges = await userChallenge
      .find({ user_id: req.user._id, status: "approved" })
      .populate("challenge_id", "name points")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  }

  const userBadgesActivities = await userBadge
    .find({ user_id: req.user._id })
    .populate("badge_id", "name icon")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const activities = getActivities(user, userChallenges, userBadgesActivities);

  // Return user object matching frontend interface
  res.status(200).json({
    status: "success",
    data: {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "student",
        school_id: user.school_id?._id?.toString() || "",
        schoolName: user.school_id?.name || "",
        schoolCity: user.school_id?.city || "",
        points: user.points,
        level: level.current,
        levelName: level.nameAr,
        challengesCompleted: completedChallenges,
        streak: streak,
        pointsToNextLevel: level.pointsToNextLevel,
        ecoImpact: {
          co2Saved: Math.round(totalImpact.co2SavedKg * 100) / 100,
          waterSaved: Math.round(totalImpact.waterSavedLiters * 100) / 100,
          plasticSaved:
            Math.round((totalImpact.plasticSavedGrams * 100) / 1000) / 100, // Convert to kg
          energySaved: Math.round(totalImpact.energySavedKwh * 100) / 100,
          treesEquivalent: Math.round(totalImpact.treesEquivalent * 100) / 100,
        },
        badges: badges,
        recentActivity: activities,
        joinDate: memberSinceFormatted,
      },
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates. please use /update-password",
        400,
      ),
    );

  const filteredBody = filterObject(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getSchoolLeaderboard = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id).populate(
    "school_id",
    "name city",
  );

  if (!currentUser) {
    return next(new AppError("User not found", 404));
  }

  if (!currentUser.school_id) {
    return next(new AppError("User does not belong to a school", 400));
  }

  // Get top 100 users from the same school
  const top100Users = await User.find({ school_id: currentUser.school_id })
    .select("name points school_id")
    .populate("school_id", "name")
    .sort({ points: -1 })
    .limit(100)
    .lean();

  // Create leaderboard with ranks
  const leaderboard = getLeaderboard(currentUser, top100Users);

  // Check if current user is in top 100
  const currentUserInTop100 = leaderboard.find((entry) => entry.isCurrentUser);

  // If not in top 100, calculate actual rank and add as 101st item
  if (!currentUserInTop100) {
    const usersAhead = await User.countDocuments({
      school_id: currentUser.school_id,
      points: { $gt: currentUser.points },
    });

    const actualRank = usersAhead + 1;

    leaderboard.push({
      rank: actualRank,
      name: currentUser.name,
      points: currentUser.points,
      school: currentUser.school_id?.name || "",
      isCurrentUser: true,
    });
  }

  res.status(200).json({
    status: "success",
    results: leaderboard.length,
    data: {
      users: leaderboard,
    },
  });
});

exports.getIraqLeaderboard = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user._id).populate(
    "school_id",
    "name city",
  );

  if (!currentUser) {
    return next(new AppError("User not found", 404));
  }

  // Get top 100 users from all of Iraq
  const top100Users = await User.find()
    .select("name points school_id")
    .populate("school_id", "name")
    .sort({ points: -1 })
    .limit(100)
    .lean();

  // Create leaderboard with ranks
  const leaderboard = getLeaderboard(currentUser, top100Users);

  // Check if current user is in top 100
  const currentUserInTop100 = leaderboard.find((entry) => entry.isCurrentUser);

  // If not in top 100, calculate actual rank and add as 101st item
  if (!currentUserInTop100) {
    const usersAhead = await User.countDocuments({
      points: { $gt: currentUser.points },
    });

    const actualRank = usersAhead + 1;

    leaderboard.push({
      rank: actualRank,
      name: currentUser.name,
      points: currentUser.points,
      school: currentUser.school_id?.name || "",
      isCurrentUser: true,
    });
  }

  res.status(200).json({
    status: "success",
    results: leaderboard.length,
    data: {
      users: leaderboard,
    },
  });
});
