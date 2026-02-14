import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { settingsRequestSchema } from "@/lib/validations";
import * as SettingsRepo from "@/lib/server/repo/settings";

export async function GET(request: NextRequest) {
  try {
    const settings = await SettingsRepo.getOrCreateSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = settingsRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const settings = await SettingsRepo.updateSettings(validationResult.data);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
