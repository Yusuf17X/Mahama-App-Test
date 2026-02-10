import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, schoolsApi } from "@/lib/api";
import type { School } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await schoolsApi.getAll();
        if (res.data?.schools) {
          setSchools(res.data.schools);
        }
      } catch (error) {
        console.error("Failed to fetch schools:", error);
        toast({
          title: "⚠️ تحذير",
          description: "فشل تحميل المدارس. يرجى المحاولة لاحقاً",
          variant: "destructive",
        });
      }
    };
    fetchSchools();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (!selectedSchool) {
      toast({
        title: "❌ خطأ",
        description: "يرجى اختيار المدرسة",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.signup({ 
        name, 
        email, 
        password, 
        passwordConfirm,
        school_id: selectedSchool 
      });
      if (res.token && res.data?.user) {
        login(res.token, res.data.user);
        navigate("/challenges");
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في إنشاء الحساب",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <span className="text-5xl">📋</span>
          <CardTitle className="mt-2 text-2xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>انضم للآلاف من الطلاب العراقيين</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" name="name" placeholder="أدخل اسمك الكامل" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" placeholder="example@email.com" dir="ltr" className="text-left" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">تأكيد كلمة المرور</Label>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>المدرسة</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool} required>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مدرستك" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s._id} value={s._id}>{s.name} - {s.city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <button onClick={() => navigate("/login")} className="font-semibold text-primary hover:underline">
              تسجيل الدخول
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
