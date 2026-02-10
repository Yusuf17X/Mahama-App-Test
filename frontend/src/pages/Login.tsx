import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMockLogin } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const mockLogin = useMockLogin();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with actual API call
    // const res = await authApi.login(email, password);
    // login(res.token, res.data.user);
    mockLogin();
    navigate("/challenges");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <span className="text-5xl">📋</span>
          <CardTitle className="mt-2 text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>مرحباً بعودتك!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="example@email.com" dir="ltr" className="text-left" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
            <Button type="submit" className="w-full">تسجيل الدخول</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <button onClick={() => navigate("/register")} className="font-semibold text-primary hover:underline">
              إنشاء حساب جديد
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
