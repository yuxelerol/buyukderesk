export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const news = await prisma.news.findMany({ orderBy: { publishDate: "desc" } });

    const newsWithUrls = (news ?? []).map((n: any) => ({
      ...(n ?? {}),
      coverUrl: n?.coverPath || null,
    }));

    return NextResponse.json(newsWithUrls);
  } catch (error: any) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
