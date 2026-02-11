import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { userChallengesApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { UserChallenge } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";

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

const Review = () => {
  const { user, isTeacherOrAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<UserChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isTeacherOrAdmin) return;
      
      try {
        const res = await userChallengesApi.getAllForReview();
        if (res.data?.userChallenges) {
          setSubmissions(res.data.userChallenges);
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        toast({
          title: "❌ خطأ",
          description: "فشل تحميل المهام للمراجعة",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [isTeacherOrAdmin, toast]);

  // Redirect non-authorized users
  if (!isTeacherOrAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-sm mx-4">
          <CardContent className="py-8 text-center">
            <span className="text-5xl">🔒</span>
            <h2 className="mt-4 text-xl font-bold text-foreground">غير مصرح</h2>
            <p className="mt-2 text-muted-foreground">هذه الصفحة متاحة فقط للمعلمين والمشرفين</p>
            <Button className="mt-4" onClick={() => navigate("/challenges")}>
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    try {
      await userChallengesApi.review(id, status);
      setSubmissions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s))
      );
      toast({
        title: status === "approved" ? "✅ تمت الموافقة" : "❌ تم الرفض",
        description: status === "approved" ? "تمت الموافقة على المهمة بنجاح" : "تم رفض المهمة",
      });
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: error instanceof Error ? error.message : "فشل تحديث حالة المهمة",
        variant: "destructive",
      });
    }
  };

  const handleImageError = (submissionId: string) => {
    setImageErrors((prev) => new Set(prev).add(submissionId));
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">📝 مراجعة المهام</h2>
          <p className="text-sm text-muted-foreground">{pendingCount} مهمة بانتظار المراجعة</p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">جاري التحميل...</p>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              لا توجد مهام للمراجعة
            </CardContent>
          </Card>
        ) : (
          submissions.map((sub) => {
            const status = statusLabels[sub.status];
            return (
              <Card key={sub._id}>
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sub.challengeEmoji}</span>
                      <div>
                        <p className="font-bold text-foreground">{sub.challengeTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          👤 {sub.studentName} • 🏫 {sub.schoolName}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${status.color}`}>
                      {status.icon} {status.text}
                    </span>
                  </div>

                  {sub.photo && (
                    <div className="relative">
                      {imageErrors.has(sub._id) ? (
                        <div className="w-full rounded-lg bg-muted flex items-center justify-center min-h-48 text-muted-foreground">
                          <div className="text-center p-4">
                            <span className="text-4xl block mb-2">🖼️</span>
                            <span className="text-sm">لا يمكن تحميل الصورة</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={resolveImageUrl(sub.photo) || ""}
                          alt="إثبات المهمة"
                          className="w-full rounded-lg object-cover max-h-48 bg-muted"
                          onError={() => handleImageError(sub._id)}
                        />
                      )}
                    </div>
                  )}

                  {sub.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleReview(sub._id, "approved")}
                      >
                        ✅ موافقة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleReview(sub._id, "rejected")}
                      >
                        ❌ رفض
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Review;
