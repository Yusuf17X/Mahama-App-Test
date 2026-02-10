// API Service Layer
// Replace this with your actual API URL when ready
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

interface ApiResponse<T = unknown> {
  status: "success" | "fail";
  data?: T;
  message?: string;
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok || json.status === "fail") {
    throw new Error(json.message || "حدث خطأ غير متوقع");
  }

  return json;
}

// ====== Auth ======
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: User }>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: { name: string; email: string; password: string; passwordConfirm: string; school_id: string }) =>
    request<{ user: User }>("/users/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => request("/users/logout"),

  getMe: () => request<{ user: User }>("/users/me"),
};

// ====== Schools ======
export const schoolsApi = {
  getAll: () => request<{ schools: School[] }>("/schools"),
  getLeaderboard: () => request<{ schools: SchoolLeaderboardItem[] }>("/schools/leaderboard"),
  getEcoStats: (schoolId: string) =>
    request<{ ecoStats: EcoStats; participation: SchoolParticipation }>(`/schools/${schoolId}/eco-stats`),
};

// ====== Challenges ======
export const challengesApi = {
  getAvailable: (challengeType?: "solo" | "school_task") => {
    const params = challengeType ? `?challenge_type=${challengeType}` : "";
    return request<{ challenges: Challenge[] }>(`/challenges/available${params}`);
  },
};

// ====== User Challenges ======
export const userChallengesApi = {
  submit: (challengeId: string, photo: File) => {
    const formData = new FormData();
    formData.append("challenge_id", challengeId);
    formData.append("photo", photo);
    return request<{ userChallenge: UserChallenge; encouragingPhrase: string }>("/user-challenges", {
      method: "POST",
      body: formData,
    });
  },

  getMySubmissions: () =>
    request<{ userChallenges: UserChallenge[] }>("/user-challenges"),

  review: (id: string, status: "approved" | "rejected") =>
    request<{ userChallenge: UserChallenge }>(`/user-challenges/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ====== Leaderboard ======
export const leaderboardApi = {
  schoolStudents: () =>
    request<{ users: StudentLeaderboardItem[] }>("/users/leaderboard/school"),
  iraqStudents: () =>
    request<{ users: StudentLeaderboardItem[] }>("/users/leaderboard/iraq"),
};

// ====== Dashboard ======
export const dashboardApi = {
  getPublic: () =>
    request<{ ecoImpact: EcoStats; topSchools: SchoolLeaderboardItem[] }>("/dashboard/public"),
};

// ====== Types ======
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  school_id: string;
  schoolName?: string;
  schoolCity?: string;
  points: number;
  level: number;
  levelName: string;
  challengesCompleted: number;
  streak: number;
  pointsToNextLevel: number;
  ecoImpact?: EcoStats;
  badges?: Badge[];
  recentActivity?: Activity[];
  joinDate?: string;
}

export interface School {
  _id: string;
  name: string;
  city: string;
}

export interface EcoStats {
  co2Saved: number;
  waterSaved: number;
  plasticSaved: number;
  energySaved: number;
  treesEquivalent: number;
}

export interface SchoolParticipation {
  totalStudents: number;
  activeStudents: number;
  participationRate: number;
  completedChallenges: number;
  totalPoints: number;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  emoji: string;
  points: number;
  challengeType: "solo" | "school_task";
  frequency: "daily" | "weekly" | "one_time";
  ecoImpact?: EcoStats;
}

export interface UserChallenge {
  _id: string;
  challengeId: string;
  challengeTitle: string;
  challengeEmoji?: string;
  status: "pending" | "approved" | "rejected";
  photo?: string;
  studentName?: string;
  schoolName?: string;
  createdAt: string;
  ecoImpact?: EcoStats;
  encouragingPhrase?: string;
}

export interface Badge {
  _id: string;
  name: string;
  emoji: string;
  earned: boolean;
}

export interface Activity {
  _id: string;
  type: "challenge" | "badge";
  text: string;
  icon: string;
  points: number;
  time: string;
}

export interface SchoolLeaderboardItem {
  rank: number;
  medal?: string;
  name: string;
  city: string;
  points: number;
  students: number;
}

export interface StudentLeaderboardItem {
  rank: number;
  medal?: string;
  name: string;
  points: number;
  school: string;
  isCurrentUser?: boolean;
}
