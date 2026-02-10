import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { schoolsApi, leaderboardApi } from "@/lib/api";
import type { SchoolLeaderboardItem, StudentLeaderboardItem } from "@/lib/api";

const Leaderboard = () => {
  const [studentFilter, setStudentFilter] = useState("مدرستي");
  const [schools, setSchools] = useState<SchoolLeaderboardItem[]>([]);
  const [students, setStudents] = useState<StudentLeaderboardItem[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await schoolsApi.getLeaderboard();
        if (res.data?.schools) {
          setSchools(res.data.schools);
        }
      } catch (error) {
        console.error("Failed to fetch schools leaderboard:", error);
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const res = studentFilter === "مدرستي" 
          ? await leaderboardApi.schoolStudents()
          : await leaderboardApi.iraqStudents();
        
        if (res.data?.users) {
          setStudents(res.data.users);
        }
      } catch (error) {
        console.error("Failed to fetch students leaderboard:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [studentFilter]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <Tabs defaultValue="schools" dir="rtl">
          <TabsList className="w-full">
            <TabsTrigger value="schools" className="flex-1">🏫 المدارس</TabsTrigger>
            <TabsTrigger value="students" className="flex-1">👥 الطلاب</TabsTrigger>
          </TabsList>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-3 mt-4">
            {isLoadingSchools ? (
              <p className="text-center text-muted-foreground">جاري التحميل...</p>
            ) : schools.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد بيانات متاحة
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  {schools.map((school, i) => (
                    <div
                      key={school.rank}
                      className={`flex items-center justify-between px-4 py-3 ${
                        i < schools.length - 1 ? "border-b" : ""
                      } ${school.rank === 1 ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground w-6 text-center">
                          {school.medal || school.rank}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground">
                            {school.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{school.city} • {school.students} طالب</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{school.points.toLocaleString()} نقطة</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-3 mt-4">
            <div className="flex gap-2">
              {["مدرستي", "العراق"].map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={studentFilter === f ? "default" : "outline"}
                  onClick={() => setStudentFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
            {isLoadingStudents ? (
              <p className="text-center text-muted-foreground">جاري التحميل...</p>
            ) : students.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد بيانات متاحة
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  {students.map((student, i) => (
                    <div
                      key={student.rank}
                      className={`flex items-center justify-between px-4 py-3 ${
                        i < students.length - 1 ? "border-b" : ""
                      } ${student.isCurrentUser ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground w-6 text-center">
                          {student.medal || student.rank}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground">
                            {student.name}
                            {student.isCurrentUser && (
                              <span className="mr-1 text-xs text-primary font-bold">(أنت)</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{student.school}</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{student.points} نقطة</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
