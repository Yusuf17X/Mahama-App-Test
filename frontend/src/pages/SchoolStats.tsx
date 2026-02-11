import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { schoolsApi } from "@/lib/api";
import type { EcoStats, SchoolParticipation } from "@/lib/api";

const SchoolStats = () => {
  const { user } = useAuth();
  const [ecoStats, setEcoStats] = useState<EcoStats>({
    co2Saved: 0,
    waterSaved: 0,
    plasticSaved: 0,
    energySaved: 0,
    treesEquivalent: 0,
  });
  const [participation, setParticipation] = useState<SchoolParticipation>({
    totalStudents: 0,
    activeStudents: 0,
    participationRate: 0,
    completedChallenges: 0,
    totalPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolStats = async () => {
      if (!user?.school_id) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await schoolsApi.getEcoStats(user.school_id);
        if (res.data?.ecoImpact) {
          // Map backend fields to frontend format
          const impact = res.data.ecoImpact;
          setEcoStats({
            co2Saved: impact.totalCo2Impact || impact.co2SavedKg || 0,
            waterSaved: impact.waterSavedLiters || 0,
            plasticSaved: impact.plasticSavedKg || 0,
            energySaved: impact.energySavedKwh || 0,
            treesEquivalent: impact.treesEquivalent || 0,
          });
        }
        if (res.data?.participation) {
          const p = res.data.participation;
          setParticipation({
            totalStudents: p.totalStudents || 0,
            activeStudents: p.activeStudents || 0,
            participationRate: typeof p.participationRate === 'string' 
              ? parseFloat(p.participationRate) 
              : p.participationRate || 0,
            completedChallenges: p.totalChallengesCompleted || 0,
            totalPoints: p.totalPoints || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch school stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolStats();
  }, [user?.school_id]);

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

        {isLoading ? (
          <p className="text-center text-muted-foreground">جاري التحميل...</p>
        ) : (
          <>
            {/* Eco Impact */}
            <div>
              <h3 className="mb-3 text-lg font-bold text-foreground">🌍 الأثر البيئي للمدرسة</h3>
              <Card className="bg-primary/5">
                <CardContent className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-3">
                  {[
                    { icon: "🌿", label: "CO₂ الموفر", value: `${ecoStats.co2Saved.toFixed(1)} كجم` },
                    { icon: "💧", label: "الماء الموفر", value: `${ecoStats.waterSaved.toLocaleString()} لتر` },
                    { icon: "♻️", label: "البلاستيك الموفر", value: `${ecoStats.plasticSaved.toFixed(1)} كجم` },
                    { icon: "⚡", label: "الطاقة الموفرة", value: `${ecoStats.energySaved.toLocaleString()} كيلوواط` },
                    { icon: "🌳", label: "ما يعادل", value: `${ecoStats.treesEquivalent.toFixed(1)} شجرة` },
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
                  { icon: "📈", label: "نسبة المشاركة", value: `${participation.participationRate.toFixed(1)}%` },
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
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SchoolStats;
