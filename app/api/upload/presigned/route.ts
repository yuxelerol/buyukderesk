export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFileToFirebase } from "@/lib/firebase-storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicUrl = await uploadFileToFirebase(buffer, file.name, file.type);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload hatası:", error);
    return NextResponse.json({ error: "Yükleme hatası" }, { status: 500 });
  }
}
