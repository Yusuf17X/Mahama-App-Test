import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardApi } from "@/lib/api";
import type { EcoStats, SchoolLeaderboardItem } from "@/lib/api";

const features = [
  { icon: "📸", title: "مهام حقيقية", description: "صوّر إنجازاتك البيئية واكسب نقاط" },
  { icon: "🏆", title: "تنافس مع أصدقائك", description: "تصدر قائمة صفك ومدرستك" },
  { icon: "🏫", title: "مدرسة ضد مدرسة", description: "ساعد مدرستك للوصول للمركز الأول" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [ecoImpact, setEcoImpact] = useState<EcoStats>({
    co2Saved: 0,
    waterSaved: 0,
    plasticSaved: 0,
    energySaved: 0,
    treesEquivalent: 0,
  });
  const [topSchools, setTopSchools] = useState<SchoolLeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await dashboardApi.getPublic();
        if (res.data?.ecoImpact) {
          setEcoImpact(res.data.ecoImpact);
        }
        if (res.data?.topSchools) {
          setTopSchools(res.data.topSchools);
        }
      } catch (error) {
        console.error("Failed to fetch public dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  const ecoImpactItems = [
    { icon: "🌿", label: "CO₂ الموفر", value: ecoImpact.co2Saved, unit: "كجم" },
    { icon: "💧", label: "الماء الموفر", value: ecoImpact.waterSaved, unit: "لتر" },
    { icon: "♻️", label: "البلاستيك الموفر", value: ecoImpact.plasticSaved, unit: "كجم" },
    { icon: "⚡", label: "الطاقة الموفرة", value: ecoImpact.energySaved, unit: "كيلوواط" },
    { icon: "🌳", label: "ما يعادل", value: ecoImpact.treesEquivalent, unit: "شجرة" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="text-xl font-bold text-primary">📋 مهمة</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            تسجيل الدخول
          </Button>
          <Button size="sm" onClick={() => navigate("/register")}>
            إنشاء حساب
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-12 text-center md:py-20">
        <h1 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
          تحدى أصدقاءك، أنقذ البيئة 🌍
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground md:text-lg">
          أكمل مهام بيئية حقيقية، اجمع النقاط، وتصدر قائمة مدرستك
        </p>
        <Button size="lg" className="mt-8 gap-2 text-lg px-8" onClick={() => navigate("/register")}>
          ابدأ الآن
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">انضم لأكثر من 5,000 طالب عراقي</p>
      </section>

      {/* Eco Impact */}
      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-xl font-bold text-foreground text-center">🌍 الأثر البيئي الكلي</h2>
          <Card className="border-0 bg-gradient-to-l from-primary to-secondary text-primary-foreground overflow-hidden">
            <CardContent className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-3">
              {ecoImpactItems.map((item) => (
                <div key={item.label} className="text-center">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-2xl font-extrabold mt-1">{item.value.toLocaleString()}</p>
                  <p className="text-xs opacity-80">{item.unit} {item.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="text-center transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <span className="text-4xl">{f.icon}</span>
                <h3 className="mt-3 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Schools */}
      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-xl font-bold text-foreground text-center">🏆 أفضل المدارس هذا الأسبوع</h2>
          {isLoading ? (
            <p className="text-center text-muted-foreground">جاري التحميل...</p>
          ) : topSchools.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                لا توجد بيانات متاحة
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                {topSchools.map((school, i) => (
                  <div
                    key={school.rank}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i < topSchools.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6 text-center">
                        {school.medal || school.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{school.name}</p>
                        <p className="text-xs text-muted-foreground">{school.city}</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{school.points.toLocaleString()} نقطة</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        صنع بـ 💚 للعراق
      </footer>
    </div>
  );
};

export default Landing;
