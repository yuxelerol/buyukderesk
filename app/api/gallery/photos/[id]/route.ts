export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFileFromFirebase } from "@/lib/firebase-storage";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const photo = await prisma.galleryPhoto.findUnique({ where: { id: params?.id } });
    if (photo?.imagePath) { try { await deleteFileFromFirebase(photo.imagePath); } catch {} }

    await prisma.galleryPhoto.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Silme hatası" }, { status: 500 });
  }
}
