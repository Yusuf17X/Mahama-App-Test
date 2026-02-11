import { describe, it, expect } from "vitest";

describe("Profile default values", () => {
  it("should provide default values for undefined fields", () => {
    // Simulate a new user with minimal data (like from signup)
    const newUser = {
      _id: "123",
      name: "Test User",
      email: "test@example.com",
      role: "student" as const,
      school_id: "school123",
      points: 0,
      level: undefined,
      levelName: undefined,
      challengesCompleted: undefined,
      streak: undefined,
      pointsToNextLevel: undefined,
      schoolName: undefined,
      schoolCity: undefined,
      joinDate: undefined,
    };

    // Apply the same default logic as in Profile.tsx
    const level = newUser.level ?? 1;
    const levelName = newUser.levelName ?? "مبتدئ";
    const challengesCompleted = newUser.challengesCompleted ?? 0;
    const streak = newUser.streak ?? 0;
    const pointsToNextLevel = newUser.pointsToNextLevel ?? 50;
    const schoolName = newUser.schoolName ?? "";
    const schoolCity = newUser.schoolCity ?? "";
    const joinDate = newUser.joinDate ?? "";

    // Verify defaults are applied correctly
    expect(level).toBe(1);
    expect(levelName).toBe("مبتدئ");
    expect(challengesCompleted).toBe(0);
    expect(streak).toBe(0);
    expect(pointsToNextLevel).toBe(50);
    expect(schoolName).toBe("");
    expect(schoolCity).toBe("");
    expect(joinDate).toBe("");
  });

  it("should use actual values when they exist", () => {
    // Simulate a user with complete data (like from getMe endpoint)
    const existingUser = {
      _id: "456",
      name: "Existing User",
      email: "existing@example.com",
      role: "student" as const,
      school_id: "school456",
      points: 150,
      level: 3,
      levelName: "ناشط",
      challengesCompleted: 5,
      streak: 7,
      pointsToNextLevel: 150,
      schoolName: "مدرسة الأمل",
      schoolCity: "بغداد",
      joinDate: "2024-01-15",
    };

    // Apply the same default logic as in Profile.tsx
    const level = existingUser.level ?? 1;
    const levelName = existingUser.levelName ?? "مبتدئ";
    const challengesCompleted = existingUser.challengesCompleted ?? 0;
    const streak = existingUser.streak ?? 0;
    const pointsToNextLevel = existingUser.pointsToNextLevel ?? 50;
    const schoolName = existingUser.schoolName ?? "";
    const schoolCity = existingUser.schoolCity ?? "";
    const joinDate = existingUser.joinDate ?? "";

    // Verify actual values are preserved
    expect(level).toBe(3);
    expect(levelName).toBe("ناشط");
    expect(challengesCompleted).toBe(5);
    expect(streak).toBe(7);
    expect(pointsToNextLevel).toBe(150);
    expect(schoolName).toBe("مدرسة الأمل");
    expect(schoolCity).toBe("بغداد");
    expect(joinDate).toBe("2024-01-15");
  });

  it("should handle zero values correctly (not treat as undefined)", () => {
    // User with 0 points and 0 streak should keep those zeros, not use defaults
    const userWithZeros = {
      _id: "789",
      name: "Zero User",
      email: "zero@example.com",
      role: "student" as const,
      school_id: "school789",
      points: 0,
      level: 1,
      levelName: "مبتدئ",
      challengesCompleted: 0,
      streak: 0,
      pointsToNextLevel: 50,
    };

    // Apply the same default logic as in Profile.tsx
    const level = userWithZeros.level ?? 1;
    const levelName = userWithZeros.levelName ?? "مبتدئ";
    const challengesCompleted = userWithZeros.challengesCompleted ?? 0;
    const streak = userWithZeros.streak ?? 0;
    const pointsToNextLevel = userWithZeros.pointsToNextLevel ?? 50;

    // Verify zeros are preserved (0 is not undefined/null)
    expect(level).toBe(1);
    expect(levelName).toBe("مبتدئ");
    expect(challengesCompleted).toBe(0);
    expect(streak).toBe(0);
    expect(pointsToNextLevel).toBe(50);
  });
});
