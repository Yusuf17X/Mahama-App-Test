import type { Challenge, UserChallenge, SchoolLeaderboardItem, StudentLeaderboardItem, EcoStats, SchoolParticipation, School } from "@/lib/api";

export const schools: School[] = [
  { _id: "school-1", name: "إعدادية المنصور", city: "بغداد" },
  { _id: "school-2", name: "ثانوية البصرة", city: "البصرة" },
  { _id: "school-3", name: "إعدادية أربيل", city: "أربيل" },
  { _id: "school-4", name: "ثانوية الموصل", city: "الموصل" },
  { _id: "school-5", name: "إعدادية النجف", city: "النجف" },
  { _id: "school-6", name: "ثانوية كربلاء", city: "كربلاء" },
  { _id: "school-7", name: "إعدادية الحلة", city: "بابل" },
];

export const challenges: Challenge[] = [
  // Solo - Daily
  { _id: "1", emoji: "🚰", title: "استخدم قنينة ماء من البيت", description: "بدلاً من شراء قنينة بلاستيكية", points: 20, challengeType: "solo", frequency: "daily", ecoImpact: { co2Saved: 0.5, waterSaved: 2, plasticSaved: 0.03, energySaved: 0.1, treesEquivalent: 0 } },
  { _id: "2", emoji: "💡", title: "أطفئ الأنوار غير الضرورية", description: "لمدة ساعة كاملة", points: 20, challengeType: "solo", frequency: "daily", ecoImpact: { co2Saved: 0.3, waterSaved: 0, plasticSaved: 0, energySaved: 1.5, treesEquivalent: 0 } },
  // Solo - Weekly
  { _id: "3", emoji: "🚶", title: "امشِ إلى المدرسة", description: "بدلاً من استخدام السيارة", points: 30, challengeType: "solo", frequency: "weekly", ecoImpact: { co2Saved: 2.5, waterSaved: 0, plasticSaved: 0, energySaved: 3, treesEquivalent: 0 } },
  { _id: "4", emoji: "🧴", title: "اجمع 5 قناني بلاستيكية", description: "من الشارع أو البيت", points: 50, challengeType: "solo", frequency: "weekly", ecoImpact: { co2Saved: 1.2, waterSaved: 10, plasticSaved: 0.5, energySaved: 0.8, treesEquivalent: 0 } },
  // Solo - One time
  { _id: "5", emoji: "🌱", title: "ازرع نبتة", description: "في البيت أو الحديقة", points: 100, challengeType: "solo", frequency: "one_time", ecoImpact: { co2Saved: 5, waterSaved: 50, plasticSaved: 0, energySaved: 0, treesEquivalent: 1 } },
  // School tasks - Daily
  { _id: "6", emoji: "🗑", title: "افرز 3 أنواع من النفايات", description: "بلاستيك، ورق، وعضوي", points: 30, challengeType: "school_task", frequency: "daily", ecoImpact: { co2Saved: 0.8, waterSaved: 5, plasticSaved: 0.2, energySaved: 0.5, treesEquivalent: 0 } },
  // School tasks - Weekly
  { _id: "7", emoji: "👨‍👩‍👧", title: "علّم أخوك الصغير عن إعادة التدوير", description: "صوّر فيديو قصير أو صورة", points: 40, challengeType: "school_task", frequency: "weekly", ecoImpact: { co2Saved: 0, waterSaved: 0, plasticSaved: 0, energySaved: 0, treesEquivalent: 0 } },
  // School tasks - One time
  { _id: "8", emoji: "🏫", title: "نظّف ساحة المدرسة", description: "مع فريق من زملائك", points: 80, challengeType: "school_task", frequency: "one_time", ecoImpact: { co2Saved: 2, waterSaved: 20, plasticSaved: 1, energySaved: 0, treesEquivalent: 0 } },
];

export const topSchools: SchoolLeaderboardItem[] = [
  { rank: 1, medal: "🥇", name: "إعدادية المنصور", city: "بغداد", points: 4500, students: 120 },
  { rank: 2, medal: "🥈", name: "ثانوية البصرة", city: "البصرة", points: 3890, students: 98 },
  { rank: 3, medal: "🥉", name: "إعدادية أربيل", city: "أربيل", points: 3200, students: 85 },
  { rank: 4, name: "ثانوية الموصل", city: "الموصل", points: 2800, students: 72 },
  { rank: 5, name: "إعدادية النجف", city: "النجف", points: 2100, students: 65 },
];

export const studentsLeaderboard: StudentLeaderboardItem[] = [
  { rank: 1, medal: "🥇", name: "فاطمة أحمد", points: 450, school: "إعدادية المنصور" },
  { rank: 2, medal: "🥈", name: "علي محمد", points: 380, school: "إعدادية المنصور" },
  { rank: 3, medal: "🥉", name: "زينب كاظم", points: 290, school: "إعدادية المنصور" },
  { rank: 4, name: "محمد عباس", points: 220, school: "إعدادية المنصور" },
  { rank: 5, name: "سارة علي", points: 180, school: "إعدادية المنصور" },
  { rank: 6, name: "حسن كريم", points: 160, school: "إعدادية المنصور" },
  { rank: 7, name: "نور حسين", points: 140, school: "إعدادية المنصور" },
  { rank: 8, name: "أحمد حسين", points: 120, school: "إعدادية المنصور", isCurrentUser: true },
  { rank: 9, name: "مريم جعفر", points: 100, school: "إعدادية المنصور" },
  { rank: 10, name: "عمر خالد", points: 80, school: "إعدادية المنصور" },
];

export const publicEcoImpact: EcoStats = {
  co2Saved: 1250.5,
  waterSaved: 18500,
  plasticSaved: 320,
  energySaved: 4200,
  treesEquivalent: 85,
};

export const userSubmissions: UserChallenge[] = [
  { _id: "uc1", challengeId: "4", challengeTitle: "اجمع 5 قناني بلاستيكية", challengeEmoji: "🧴", status: "approved", createdAt: "2026-02-08T10:00:00Z", ecoImpact: { co2Saved: 1.2, waterSaved: 10, plasticSaved: 0.5, energySaved: 0.8, treesEquivalent: 0 } },
  { _id: "uc2", challengeId: "1", challengeTitle: "استخدم قنينة ماء من البيت", challengeEmoji: "🚰", status: "approved", createdAt: "2026-02-09T08:00:00Z", ecoImpact: { co2Saved: 0.5, waterSaved: 2, plasticSaved: 0.03, energySaved: 0.1, treesEquivalent: 0 } },
  { _id: "uc3", challengeId: "3", challengeTitle: "امشِ إلى المدرسة", challengeEmoji: "🚶", status: "pending", createdAt: "2026-02-10T07:30:00Z", ecoImpact: { co2Saved: 2.5, waterSaved: 0, plasticSaved: 0, energySaved: 3, treesEquivalent: 0 } },
];

export const pendingReviewSubmissions: UserChallenge[] = [
  { _id: "r1", challengeId: "3", challengeTitle: "امشِ إلى المدرسة", challengeEmoji: "🚶", status: "pending", studentName: "أحمد حسين", schoolName: "إعدادية المنصور", createdAt: "2026-02-10T07:30:00Z", photo: "/placeholder.svg" },
  { _id: "r2", challengeId: "4", challengeTitle: "اجمع 5 قناني بلاستيكية", challengeEmoji: "🧴", status: "pending", studentName: "فاطمة أحمد", schoolName: "إعدادية المنصور", createdAt: "2026-02-10T06:00:00Z", photo: "/placeholder.svg" },
  { _id: "r3", challengeId: "6", challengeTitle: "افرز 3 أنواع من النفايات", challengeEmoji: "🗑", status: "pending", studentName: "علي محمد", schoolName: "إعدادية المنصور", createdAt: "2026-02-09T14:00:00Z", photo: "/placeholder.svg" },
  { _id: "r4", challengeId: "1", challengeTitle: "استخدم قنينة ماء من البيت", challengeEmoji: "🚰", status: "approved", studentName: "زينب كاظم", schoolName: "إعدادية المنصور", createdAt: "2026-02-09T09:00:00Z", photo: "/placeholder.svg" },
];

export const schoolEcoStats = {
  ecoStats: {
    co2Saved: 450,
    waterSaved: 6200,
    plasticSaved: 95,
    energySaved: 1800,
    treesEquivalent: 30,
  } as EcoStats,
  participation: {
    totalStudents: 120,
    activeStudents: 85,
    participationRate: 70.8,
    completedChallenges: 340,
    totalPoints: 4500,
  } as SchoolParticipation,
};
