export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFileFromFirebase } from "@/lib/firebase-storage";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const activity = await prisma.activity.findUnique({ where: { id: params?.id } });
    if (!activity) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    return NextResponse.json({ ...(activity ?? {}), imageUrl: activity?.imagePath || null });
  } catch (error: any) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const body = await req.json();
    const { imageUrl, ...data } = body ?? {};
    const activity = await prisma.activity.update({ where: { id: params?.id }, data });
    return NextResponse.json(activity);
  } catch (error: any) {
    return NextResponse.json({ error: "Güncelleme hatası" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const activity = await prisma.activity.findUnique({ where: { id: params?.id } });
    if (activity?.imagePath) { try { await deleteFileFromFirebase(activity.imagePath); } catch {} }

    await prisma.activity.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Silme hatası" }, { status: 500 });
  }
}
