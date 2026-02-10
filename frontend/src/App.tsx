import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import SchoolStats from "./pages/SchoolStats";
import Review from "./pages/Review";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/school-stats" element={<SchoolStats />} />
            <Route path="/review" element={<Review />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
