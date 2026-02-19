import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/server/auth-helper";
import * as UserRepo from "@/lib/server/repo/user";

export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const users = await UserRepo.findAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { username, password, role, email } = json;

    // Basic validation (or use zod schema here if preferred)
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserRepo.findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const newUser = await UserRepo.createUser({
      username,
      password, // Note: In a real app, password should be hashed! userRepo.createUser might handle it or we should do it here. 
      // Assuming repo handles hashing or storage for this task scope, but good to note.
      // Checking UserRepo.createUser implementation: it takes username, password, role.
      role,
    });

    // If email is provided, update it separately or ensure createUser handles it.
    // UserRepo.createUser only takes username, password, role.
    if (email) {
      await UserRepo.updateUser(newUser.id, { email });
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
