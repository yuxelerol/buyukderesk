export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const videos = await prisma.galleryVideo.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(videos ?? []);
  } catch (error: any) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const body = await req.json();
    const video = await prisma.galleryVideo.create({ data: body });
    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: "Oluşturma hatası" }, { status: 500 });
  }
}
