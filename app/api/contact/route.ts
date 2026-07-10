export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(messages ?? []);
  } catch (error: any) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Ad, e-posta ve mesaj gerekli" }, { status: 400 });
    }

    const msg = await prisma.contactMessage.create({
      data: { name, email, subject: subject ?? "", message },
    });

    return NextResponse.json(msg);
  } catch (error: any) {
    return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 500 });
  }
}
