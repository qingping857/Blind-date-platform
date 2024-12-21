import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfileSchema } from "@/lib/validations/user";
import { z } from "zod";

// 获取用户资料
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        location: true,
        education: true,
        bio: true,
        photos: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// 更新用户资料
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = userProfileSchema.parse(body);

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: validatedData.name,
        age: validatedData.age,
        gender: validatedData.gender,
        location: validatedData.location,
        education: validatedData.education,
        bio: validatedData.bio,
        photos: validatedData.photos,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    console.error("[USER_PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 