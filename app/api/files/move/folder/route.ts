import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    return Response.json("ok");
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === "Record to update not found.") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
