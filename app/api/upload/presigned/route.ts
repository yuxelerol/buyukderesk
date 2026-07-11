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
    return NextResponse.json({ 
      error: "Yükleme hatası", 
      details: error?.message || String(error),
      envCheck: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        hasStorageBucket: !!process.env.FIREBASE_STORAGE_BUCKET,
        privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 40),
        privateKeyEnd: process.env.FIREBASE_PRIVATE_KEY?.substring((process.env.FIREBASE_PRIVATE_KEY?.length || 0) - 40),
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length,
        hasBeginMarker: process.env.FIREBASE_PRIVATE_KEY?.includes('BEGIN'),
        hasNewlines: process.env.FIREBASE_PRIVATE_KEY?.includes('\n'),
        hasEscapedNewlines: process.env.FIREBASE_PRIVATE_KEY?.includes('\\n'),
      }
    }, { status: 500 });
  }
}
