export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams?.get("limit") ?? "50");
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { publishDate: "desc" },
      take: limit,
    });

    const newsWithUrls = (news ?? []).map((n: any) => ({
      ...(n ?? {}),
      coverUrl: n?.coverPath || null,
    }));

    return NextResponse.json(newsWithUrls);
  } catch (error: any) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();
    const news = await prisma.news.create({ data: body });
    return NextResponse.json(news);
  } catch (error: any) {
    return NextResponse.json({ error: "Oluşturma hatası" }, { status: 500 });
  }
}
