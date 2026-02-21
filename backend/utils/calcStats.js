const Challenge = require("./../models/challengeModel");
const { t, MS_PER_DAY } = require("./../utils/translations");
const { formatMemberSince } = require("./../utils/translations");

// Helper function to get teacher's advised challenge IDs

exports.getTeacherChallengeIds = async (teacherId) => {
  const teacherChallenges = await Challenge.find({
    teacher_id: teacherId,
    challenge_type: "school_task",
  }).select("_id");
  return teacherChallenges.map((c) => c._id);
};

exports.calcLevel = function (points) {
  let level = {
    current: 1,
    name: "beginner",
    nameAr: t("beginner"),
    pointsToNextLevel: 50,
    hasNextLevel: true,
  };

  if (points >= 800) {
    level = {
      current: 6,
      name: "eco_expert",
      nameAr: t("eco_expert"),
      pointsToNextLevel: 0,
      hasNextLevel: false,
    };
  } else if (points >= 500) {
    level = {
      current: 5,
      name: "eco_hero",
      nameAr: t("eco_hero"),
      pointsToNextLevel: 800 - points,
      hasNextLevel: true,
    };
  } else if (points >= 300) {
    level = {
      current: 4,
      name: "enthusiast",
      nameAr: t("enthusiast"),
      pointsToNextLevel: 500 - points,
      hasNextLevel: true,
    };
  } else if (points >= 150) {
    level = {
      current: 3,
      name: "active",
      nameAr: t("active"),
      pointsToNextLevel: 300 - points,
      hasNextLevel: true,
    };
  } else if (points >= 50) {
    level = {
      current: 2,
      name: "learner",
      nameAr: t("learner"),
      pointsToNextLevel: 150 - points,
      hasNextLevel: true,
    };
  }

  return level;
};

exports.countCompletedChallenges = async function (user, userChallenge, req) {
  let completedChallenges = 0;
  if (user.role === "teacher") {
    // Teachers: count school_task challenges they advise that have been approved

    const challengeIds = await exports.getTeacherChallengeIds(user._id);
    completedChallenges = await userChallenge.countDocuments({
      challenge_id: { $in: challengeIds },
      status: "approved",
    });
  } else {
    // Regular users and admins: count their own approved challenges
    completedChallenges = await userChallenge.countDocuments({
      user_id: req.user._id,
      status: "approved",
    });
  }

  return completedChallenges;
};

exports.calculateStreak = function (user) {
  let streak = 0;
  if (user.lastActivityDate) {
    const now = new Date();
    const lastActivity = new Date(user.lastActivityDate);
    const diffDays = Math.floor((now - lastActivity) / MS_PER_DAY);

    if (diffDays === 0 || diffDays === 1) {
      streak = user.currentStreak;
    }
  }

  return streak;
};

exports.getActivities = function (user, userChallenges, userBadgesActivities) {
  const activities = [
    ...userChallenges.map((uc) => {
      // For teachers, show student name who completed the task
      const activityText =
        user.role === "teacher"
          ? `تمت الموافقة على: ${uc.challenge_id?.name || "Unknown Challenge"} من ${uc.user_id?.name || "طالب"}`
          : `أكملت مهمة: ${uc.challenge_id?.name || "Unknown Challenge"}`;
      return {
        _id: uc._id.toString(),
        type: "challenge",
        text: activityText,
        icon: "✅",
        points: uc.challenge_id?.points || 0,
        date: uc.createdAt,
      };
    }),
    ...userBadgesActivities.map((ub) => ({
      _id: ub._id.toString(),
      type: "badge",
      text: `حصلت على شارة: ${ub.badge_id?.name || "Unknown Badge"}`,
      icon: ub.badge_id?.icon || "🎖",
      points: 0,
      date: ub.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((activity) => ({
      _id: activity._id,
      type: activity.type,
      text: activity.text,
      icon: activity.icon,
      points: activity.points,
      time: formatMemberSince(activity.date),
    }));

  return activities;
};

exports.getLeaderboard = async function (currentUser, top100Users) {
  const leaderboard = top100Users.map((user, index) => ({
    rank: index + 1,
    medal:
      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : undefined,
    name: user.name,
    points: user.points,
    school: user.school_id?.name || "",
    isCurrentUser: user._id.toString() === currentUser._id.toString(),
  }));

  return leaderboard;
};
