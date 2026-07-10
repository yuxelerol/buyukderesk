export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const members = await prisma.boardMember.findMany({ orderBy: { sortOrder: "asc" } });

    const withUrls = (members ?? []).map((m: any) => ({
      ...(m ?? {}),
      photoUrl: m?.photoPath || null,
    }));

    return NextResponse.json(withUrls);
  } catch (error: any) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const body = await req.json();
    const member = await prisma.boardMember.create({ data: body });
    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: "Oluşturma hatası" }, { status: 500 });
  }
}
