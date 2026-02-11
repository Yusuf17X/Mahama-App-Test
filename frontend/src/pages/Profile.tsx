import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { userChallengesApi } from "@/lib/api";
import type { UserChallenge } from "@/lib/api";

const statusLabels: Record<string, { text: string; icon: string; color: string }> = {
  pending: { text: "قيد المراجعة", icon: "🟡", color: "text-yellow-600" },
  approved: { text: "مقبولة", icon: "✅", color: "text-primary" },
  rejected: { text: "مرفوضة", icon: "❌", color: "text-destructive" },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "الآن";
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "أمس";
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  return date.toLocaleDateString("ar-IQ");
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState<UserChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await userChallengesApi.getMySubmissions();
        if (res.data?.userChallenges) {
          setSubmissions(res.data.userChallenges);
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (!user) return null;

  // Provide default values for fields that might be undefined (e.g., new users)
  const level = user.level ?? 1;
  const levelName = user.levelName ?? "مبتدئ";
  const challengesCompleted = user.challengesCompleted ?? 0;
  const streak = user.streak ?? 0;
  const pointsToNextLevel = user.pointsToNextLevel ?? 50;
  const schoolName = user.schoolName ?? "";
  const schoolCity = user.schoolCity ?? "";
  const joinDate = user.joinDate ?? "";
  
  const levelProgress = (user.points / (user.points + pointsToNextLevel)) * 100;
  const badges = user.badges || [];
  const activity = user.recentActivity || [];
  const ecoImpact = user.ecoImpact;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <h2 className="mt-3 text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{schoolName}{schoolCity && ` - ${schoolCity}`}</p>
            {joinDate && <p className="text-xs text-muted-foreground mt-1">عضو منذ {joinDate}</p>}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🏆", label: "النقاط", value: user.points },
            { icon: "📈", label: "المستوى", value: `${level} - ${levelName}` },
            { icon: "✅", label: "المهام", value: `${challengesCompleted} مكتمل` },
            { icon: "🔥", label: "أطول سلسلة", value: `${streak} أيام` },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="py-4 text-center">
                <p className="text-sm text-muted-foreground">{stat.icon} {stat.label}</p>
                <p className="mt-1 text-lg font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Level Progress */}
        <Card>
          <CardContent className="py-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">المستوى {level}: {levelName}</p>
            <Progress value={levelProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">{pointsToNextLevel} نقطة للمستوى التالي</p>
          </CardContent>
        </Card>

        {/* Eco Impact */}
        {ecoImpact && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-foreground">🌍 أثري البيئي</h3>
            <Card className="bg-primary/5">
              <CardContent className="grid grid-cols-2 gap-3 py-4">
                {[
                  { icon: "🌿", label: "CO₂ الموفر", value: `${ecoImpact.co2Saved} كجم` },
                  { icon: "💧", label: "الماء الموفر", value: `${ecoImpact.waterSaved} لتر` },
                  { icon: "♻️", label: "البلاستيك الموفر", value: `${ecoImpact.plasticSaved} كجم` },
                  { icon: "⚡", label: "الطاقة الموفرة", value: `${ecoImpact.energySaved} كيلوواط` },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Badges */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-foreground">🎖 الشارات</h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <Card key={badge._id} className={!badge.earned ? "opacity-40" : ""}>
                <CardContent className="flex flex-col items-center py-4 text-center">
                  <span className="text-3xl">{badge.emoji}</span>
                  <p className="mt-1 text-xs font-medium text-foreground">{badge.name}</p>
                  {!badge.earned && <span className="text-xs text-muted-foreground">🔒</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submitted Challenges */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-foreground">📋 مهامي المرسلة</h3>
          {isLoading ? (
            <p className="text-center text-muted-foreground">جاري التحميل...</p>
          ) : submissions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                لم ترسل أي مهام بعد
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                {submissions.map((sub, i) => {
                  const status = statusLabels[sub.status];
                  return (
                    <div
                      key={sub._id}
                      className={`flex items-center justify-between px-4 py-3 ${
                        i < submissions.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{sub.challengeEmoji}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{sub.challengeTitle}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${status.color}`}>
                        {status.icon} {status.text}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        {activity.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-foreground">📋 آخر النشاطات</h3>
            <Card>
              <CardContent className="p-0">
                {activity.map((act, i) => (
                  <div
                    key={act._id}
                    className={`flex items-start gap-3 px-4 py-3 ${
                      i < activity.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <span className="text-lg">{act.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{act.text}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {act.points > 0 && (
                          <span className="text-xs font-bold text-primary">+{act.points} نقطة</span>
                        )}
                        <span className="text-xs text-muted-foreground">{act.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 ml-2" />
          🚪 تسجيل الخروج
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
