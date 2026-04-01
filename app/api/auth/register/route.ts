import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, age, weight, height, gender } = await req.json();

    if (!email || !password || !age || !weight || !height || !gender) {
      return NextResponse.json(
        { message: "All biological fields and credentials are strictly required for AI health context." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        age: parseInt(age, 10),
        weight: parseFloat(weight),
        height: parseFloat(height),
        gender,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration. Validation error check." },
      { status: 500 }
    );
  }
}
