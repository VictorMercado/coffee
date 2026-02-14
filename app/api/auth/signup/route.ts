import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { signupRequestSchema } from "@/lib/validations";
import * as UserRepo from "@/lib/server/repo/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = signupRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    // Check if username already exists
    const existingUser = await UserRepo.findUserByUsername(username);

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserRepo.createUser({
      username,
      password: hashedPassword,
      role: "USER",
    });

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
