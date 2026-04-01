import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Relying on Prisma Cascade Delete to implicitly eradicate 'analyses'.
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "Account entirely erased" }, { status: 200 });
  } catch (error: any) {
    console.error("Profile deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
