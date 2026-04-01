import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.isAdmin;

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access to Core System" }, { status: 403 });
    }

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        weight: true,
        height: true,
        gender: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: { analyses: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users: allUsers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to penetrate index" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.isAdmin;

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('id');

    if (!targetUserId) {
        return NextResponse.json({ error: "Target User ID block required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    return NextResponse.json({ message: "User completely destroyed." }, { status: 200 });
  } catch (error: any) {
    console.error("Admin deletion error:", error);
    return NextResponse.json({ error: "Failed to eradicate user" }, { status: 500 });
  }
}
