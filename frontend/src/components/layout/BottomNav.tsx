import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isTeacherOrAdmin } = useAuth();

  const navItems = [
    ...(!isTeacherOrAdmin ? [{ path: "/challenges", icon: "🏠", label: "الرئيسية" }] : []),
    { path: "/leaderboard", icon: "🏆", label: "المتصدرون" },
    { path: "/school-stats", icon: "🏫", label: "المدرسة" },
    { path: "/profile", icon: "👤", label: "حسابي" },
    ...(isTeacherOrAdmin ? [{ path: "/review", icon: "📝", label: "المراجعة" }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-card py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
              isActive ? "text-primary font-bold" : "text-muted-foreground"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
