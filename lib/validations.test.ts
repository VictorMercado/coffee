import { expect, test, describe } from "bun:test";
import { signupRequestSchema } from "./validations";

describe("signupRequestSchema", () => {
  // Happy Path
  test("should validate a valid signup request", () => {
    const validData = {
      username: "cosmic_coffee",
      password: "password123",
    };
    const result = signupRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("should validate a username with numbers and underscores", () => {
    const validData = {
      username: "user_123",
      password: "password123",
    };
    const result = signupRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Username Validations
  test("should fail if username is too short (< 3 characters)", () => {
    const invalidData = {
      username: "jo",
      password: "password123",
    };
    const result = signupRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Username must be at least 3 characters");
    }
  });

  test("should fail if username is too long (> 20 characters)", () => {
    const invalidData = {
      username: "a_very_long_username_that_exceeds_twenty_chars",
      password: "password123",
    };
    const result = signupRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Username must be less than 20 characters");
    }
  });

  test("should fail if username contains spaces", () => {
    const invalidData = {
      username: "cosmic coffee",
      password: "password123",
    };
    const result = signupRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Username can only contain letters, numbers, and underscores");
    }
  });

  test("should fail if username contains special characters", () => {
    const invalidData = {
      username: "user!@#",
      password: "password123",
    };
    const result = signupRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Username can only contain letters, numbers, and underscores");
    }
  });

  // Password Validations
  test("should fail if password is too short (< 6 characters)", () => {
    const invalidData = {
      username: "johndoe",
      password: "12345",
    };
    const result = signupRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must be at least 6 characters");
    }
  });

  // Required Fields
  test("should fail if username is missing", () => {
    const invalidData = {
      password: "password123",
    };
    const result = signupRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test("should fail if password is missing", () => {
    const invalidData = {
      username: "johndoe",
    };
    const result = signupRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test("should fail if both are missing", () => {
    const result = signupRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
