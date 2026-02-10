import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isTeacherOrAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development (API not ready yet)
const MOCK_USER: User = {
  _id: "mock-1",
  name: "أحمد حسين",
  email: "ahmed@example.com",
  role: "student",
  school_id: "school-1",
  schoolName: "إعدادية المنصور",
  schoolCity: "بغداد",
  points: 120,
  level: 2,
  levelName: "متعلم",
  challengesCompleted: 8,
  streak: 5,
  pointsToNextLevel: 80,
  joinDate: "فبراير 2026",
  ecoImpact: {
    co2Saved: 15.3,
    waterSaved: 240,
    plasticSaved: 3.2,
    energySaved: 18.5,
    treesEquivalent: 2,
  },
  badges: [
    { _id: "1", emoji: "⭐️", name: "الخطوة الأولى", earned: true },
    { _id: "2", emoji: "🌱", name: "صديق البيئة", earned: true },
    { _id: "3", emoji: "🏆", name: "بطل التحديات", earned: false },
    { _id: "4", emoji: "💧", name: "حامي المياه", earned: false },
    { _id: "5", emoji: "♻️", name: "خبير التدوير", earned: false },
    { _id: "6", emoji: "🌍", name: "أسطورة بيئية", earned: false },
  ],
  recentActivity: [
    { _id: "1", type: "challenge", icon: "✅", text: "أكملت مهمة: اجمع 5 قناني", points: 50, time: "منذ ساعتين" },
    { _id: "2", type: "challenge", icon: "✅", text: "أكملت مهمة: استخدم قنينة ماء", points: 20, time: "أمس" },
    { _id: "3", type: "badge", icon: "🎖", text: "حصلت على شارة: الخطوة الأولى", points: 0, time: "منذ 3 أيام" },
  ],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // For development: auto-login with mock user
  const mockLogin = () => {
    login("mock-token", MOCK_USER);
  };

  const isLoggedIn = !!user;
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user: user,
        token,
        login: isLoggedIn ? login : (t, u) => login(t, u),
        logout,
        isLoggedIn,
        isTeacherOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use mock login for development
export const useMockLogin = () => {
  const { login } = useAuth();
  return () => login("mock-token", MOCK_USER);
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
