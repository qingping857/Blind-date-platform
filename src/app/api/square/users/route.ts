import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const minAge = Number(searchParams.get("minAge")) || 18;
    const maxAge = Number(searchParams.get("maxAge")) || 50;
    const gender = searchParams.get("gender");
    const location = searchParams.get("location");

    const db = await connectToDatabase();
    const collection = db.collection("users");

    // 构建查询条件
    const filter: any = {
      age: { $gte: minAge, $lte: maxAge },
    };

    if (query) {
      filter.$or = [
        { introduction: { $regex: query, $options: "i" } },
        { expectation: { $regex: query, $options: "i" } },
      ];
    }

    if (gender && gender !== "all") {
      filter.gender = gender;
    }

    if (location && location !== "all") {
      filter.location = location;
    }

    const users = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 