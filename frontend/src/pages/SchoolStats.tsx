import { Card, CardContent } from "@/components/ui/card";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { schoolEcoStats } from "@/data/mockData";

const SchoolStats = () => {
  const { user } = useAuth();
  const { ecoStats, participation } = schoolEcoStats;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* School Header */}
        <Card className="border-0 bg-gradient-to-l from-primary to-secondary text-primary-foreground">
          <CardContent className="py-6 text-center">
            <span className="text-4xl">🏫</span>
            <h2 className="mt-2 text-xl font-bold">{user?.schoolName || "المدرسة"}</h2>
            <p className="text-sm opacity-80">{user?.schoolCity || "المدينة"}</p>
          </CardContent>
        </Card>

        {/* Eco Impact */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-foreground">🌍 الأثر البيئي للمدرسة</h3>
          <Card className="bg-primary/5">
            <CardContent className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-3">
              {[
                { icon: "🌿", label: "CO₂ الموفر", value: `${ecoStats.co2Saved} كجم` },
                { icon: "💧", label: "الماء الموفر", value: `${ecoStats.waterSaved.toLocaleString()} لتر` },
                { icon: "♻️", label: "البلاستيك الموفر", value: `${ecoStats.plasticSaved} كجم` },
                { icon: "⚡", label: "الطاقة الموفرة", value: `${ecoStats.energySaved.toLocaleString()} كيلوواط` },
                { icon: "🌳", label: "ما يعادل", value: `${ecoStats.treesEquivalent} شجرة` },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Participation Stats */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-foreground">📊 إحصائيات المشاركة</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "👥", label: "عدد الطلاب الكلي", value: participation.totalStudents },
              { icon: "🟢", label: "الطلاب النشطين", value: participation.activeStudents },
              { icon: "📈", label: "نسبة المشاركة", value: `${participation.participationRate}%` },
              { icon: "✅", label: "المهام المنجزة", value: participation.completedChallenges },
              { icon: "🏆", label: "النقاط الكلية", value: participation.totalPoints.toLocaleString() },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="py-4 text-center">
                  <span className="text-xl">{stat.icon}</span>
                  <p className="text-lg font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SchoolStats;
