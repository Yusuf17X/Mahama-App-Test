import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import SubmitChallengeModal from "@/components/SubmitChallengeModal";
import { challengesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Challenge } from "@/lib/api";

const frequencyLabels: Record<string, string> = {
  daily: "📅 يومية",
  weekly: "📆 أسبوعية",
  one_time: "⭐ لمرة واحدة",
};

const ChallengeList = ({
  items,
  onSelect,
}: {
  items: Challenge[];
  onSelect: (c: Challenge) => void;
}) => {
  const grouped = {
    daily: items.filter((c) => c.frequency === "daily"),
    weekly: items.filter((c) => c.frequency === "weekly"),
    one_time: items.filter((c) => c.frequency === "one_time"),
  };

  return (
    <div className="space-y-4">
      {(["daily", "weekly", "one_time"] as const).map((freq) => {
        const group = grouped[freq];
        if (group.length === 0) return null;
        return (
          <div key={freq}>
            <h3 className="text-sm font-bold text-muted-foreground mb-2">{frequencyLabels[freq]}</h3>
            <div className="space-y-3">
              {group.map((challenge) => (
                <Card key={challenge._id} className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-3 py-4">
                    <span className="text-3xl mt-1">{challenge.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-foreground">{challenge.title}</h3>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          +{challenge.points} نقطة
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{challenge.description}</p>
                      <Button size="sm" className="mt-3" onClick={() => onSelect(challenge)}>
                        📸 أرسل الإثبات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Challenges = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [soloChallenges, setSoloChallenges] = useState<Challenge[]>([]);
  const [schoolChallenges, setSchoolChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoading(true);
        const [soloRes, schoolRes] = await Promise.all([
          challengesApi.getAvailable("solo"),
          challengesApi.getAvailable("school_task"),
        ]);
        
        if (soloRes.data?.challenges) {
          setSoloChallenges(soloRes.data.challenges);
        }
        if (schoolRes.data?.challenges) {
          setSchoolChallenges(schoolRes.data.challenges);
        }
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const openModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Stats Card */}
        <Card className="border-0 bg-gradient-to-l from-primary to-secondary text-primary-foreground overflow-hidden">
          <CardContent className="grid grid-cols-3 gap-2 py-5 text-center">
            <div>
              <p className="text-xs opacity-80">🏆 نقاطك</p>
              <p className="text-2xl font-extrabold">{user?.points ?? 0}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">📈 مستواك</p>
              <p className="text-2xl font-extrabold">{user?.levelName ?? "مبتدئ"}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">🔥 سلسلتك</p>
              <p className="text-2xl font-extrabold">{user?.streak ?? 0} أيام</p>
            </div>
          </CardContent>
        </Card>

        {/* Challenges Tabs */}
        <Tabs defaultValue="solo" dir="rtl">
          <TabsList className="w-full">
            <TabsTrigger value="solo" className="flex-1">🎯 مهام فردية</TabsTrigger>
            <TabsTrigger value="school_task" className="flex-1">🏫 مهام المدرسة</TabsTrigger>
          </TabsList>

          <TabsContent value="solo" className="mt-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground">جاري التحميل...</p>
            ) : (
              <ChallengeList items={soloChallenges} onSelect={openModal} />
            )}
          </TabsContent>

          <TabsContent value="school_task" className="mt-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground">جاري التحميل...</p>
            ) : (
              <ChallengeList items={schoolChallenges} onSelect={openModal} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />

      {selectedChallenge && (
        <SubmitChallengeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          challenge={selectedChallenge}
        />
      )}
    </div>
  );
};

export default Challenges;
