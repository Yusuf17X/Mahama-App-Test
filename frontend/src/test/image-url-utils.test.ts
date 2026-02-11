import { describe, it, expect } from "vitest";
import { isAbsoluteUrl, resolveImageUrl } from "@/lib/utils";

describe("Image URL Utilities", () => {
  describe("isAbsoluteUrl", () => {
    it("should return true for http URLs", () => {
      expect(isAbsoluteUrl("http://example.com/image.jpg")).toBe(true);
    });

    it("should return true for https URLs", () => {
      expect(isAbsoluteUrl("https://example.com/image.jpg")).toBe(true);
    });

    it("should return false for relative URLs", () => {
      expect(isAbsoluteUrl("/user-challenges/img/photo.jpg")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isAbsoluteUrl(undefined)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isAbsoluteUrl(null)).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isAbsoluteUrl("")).toBe(false);
    });
  });

  describe("resolveImageUrl", () => {
    it("should return null for undefined", () => {
      expect(resolveImageUrl(undefined)).toBe(null);
    });

    it("should return null for null", () => {
      expect(resolveImageUrl(null)).toBe(null);
    });

    it("should return absolute http URLs as-is", () => {
      const url = "http://example.com/image.jpg";
      expect(resolveImageUrl(url)).toBe(url);
    });

    it("should return absolute https URLs as-is", () => {
      const url = "https://example.com/image.jpg";
      expect(resolveImageUrl(url)).toBe(url);
    });

    it("should return relative URLs as-is", () => {
      const url = "/user-challenges/img/photo.jpg";
      expect(resolveImageUrl(url)).toBe(url);
    });

    it("should extract embedded URLs from malformed paths", () => {
      const malformed = "/user-challenges/img/https://example.com/photo.jpg";
      expect(resolveImageUrl(malformed)).toBe("https://example.com/photo.jpg");
    });

    it("should extract embedded http URLs from malformed paths", () => {
      const malformed = "/user-challenges/img/http://example.com/photo.jpg";
      expect(resolveImageUrl(malformed)).toBe("http://example.com/photo.jpg");
    });

    it("should handle URLs with query parameters", () => {
      const url = "https://images.unsplash.com/photo-123?w=400&q=80";
      expect(resolveImageUrl(url)).toBe(url);
    });
  });
});
