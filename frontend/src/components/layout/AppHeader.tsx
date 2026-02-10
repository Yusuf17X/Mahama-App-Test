import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-card px-4 py-3 shadow-sm">
      <div className="text-lg font-bold text-primary">📋 مهمة</div>
      <div className="flex items-center gap-3">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
          {user?.name?.charAt(0) || "م"}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
