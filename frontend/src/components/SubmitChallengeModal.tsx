import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Challenge, EcoStats } from "@/lib/api";

interface SubmitChallengeModalProps {
  open: boolean;
  onClose: () => void;
  challenge: Challenge;
}

const encouragingPhrases = [
  "🌟 رائع! أنت تصنع الفرق!",
  "💪 أحسنت! كل خطوة تحسب!",
  "🎯 ممتاز! البيئة تشكرك!",
  "🌈 عمل رائع! استمر!",
];

const formatImpact = (impact: EcoStats | undefined) => {
  if (!impact) return [];
  const items = [];
  if (impact.co2Saved > 0) items.push({ label: "CO₂ الموفر", value: `${impact.co2Saved} كجم`, icon: "🌿" });
  if (impact.waterSaved > 0) items.push({ label: "الماء الموفر", value: `${impact.waterSaved} لتر`, icon: "💧" });
  if (impact.plasticSaved > 0) items.push({ label: "البلاستيك الموفر", value: `${impact.plasticSaved} كجم`, icon: "♻️" });
  if (impact.energySaved > 0) items.push({ label: "الطاقة الموفرة", value: `${impact.energySaved} كيلوواط`, icon: "⚡" });
  if (impact.treesEquivalent > 0) items.push({ label: "ما يعادل", value: `${impact.treesEquivalent} شجرة`, icon: "🌳" });
  return items;
};

const SubmitChallengeModal = ({ open, onClose, challenge }: SubmitChallengeModalProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append("photo", file);
    // formData.append("challenge_id", challenge._id);
    // const res = await userChallengesApi.submit(challenge._id, file);
    setSubmitted(true);
  };

  const handleClose = () => {
    setImage(null);
    setSubmitted(false);
    onClose();
  };

  const randomPhrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];
  const impactItems = formatImpact(challenge.ecoImpact);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto rounded-xl">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">📸 إرسال إثبات المهمة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl">{challenge.emoji}</span>
                <p className="font-semibold text-foreground mt-1">{challenge.title}</p>
                <span className="inline-block mt-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                  +{challenge.points} نقطة
                </span>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {!image ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Camera className="h-10 w-10" />
                  <span className="font-medium">اضغط لرفع صورة</span>
                  <span className="text-xs">PNG, JPG حتى 5MB</span>
                </button>
              ) : (
                <div className="relative">
                  <img src={image} alt="preview" className="w-full rounded-lg object-cover max-h-48" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 left-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={!image} className="flex-1">
                  ✅ إرسال المهمة
                </Button>
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="text-6xl">🎉</span>
            <h3 className="text-xl font-bold text-foreground">أحسنت! 🎉</h3>
            <p className="text-muted-foreground">{randomPhrase}</p>
            <span className="text-2xl font-bold text-primary animate-bounce">+{challenge.points} نقطة</span>

            {impactItems.length > 0 && (
              <div className="w-full rounded-lg bg-primary/5 p-3 space-y-2">
                <p className="text-sm font-bold text-foreground">🌍 الأثر البيئي المتوقع:</p>
                {impactItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.icon} {item.label}</span>
                    <span className="font-bold text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={handleClose} className="w-full mt-2">
              العودة للمهام
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitChallengeModal;
