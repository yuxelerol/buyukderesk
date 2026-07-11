import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

let app: App;

function getFirebaseApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
  // Handle various formats of private key in environment variables
  // Vercel may wrap the value in quotes or escape newlines differently
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, "\n");

  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  return app;
}

function getBucket() {
  const firebaseApp = getFirebaseApp();
  return getStorage(firebaseApp).bucket();
}

export async function uploadFileToFirebase(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const bucket = getBucket();
  const filePath = `uploads/${Date.now()}-${fileName}`;
  const file = bucket.file(filePath);

  await file.save(buffer, {
    metadata: {
      contentType,
    },
    public: true,
  });

  // Return public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  return publicUrl;
}

export async function deleteFileFromFirebase(fileUrl: string): Promise<void> {
  try {
    const bucket = getBucket();
    // Extract file path from URL
    const bucketName = bucket.name;
    const prefix = `https://storage.googleapis.com/${bucketName}/`;
    
    let filePath = "";
    if (fileUrl.startsWith(prefix)) {
      filePath = decodeURIComponent(fileUrl.replace(prefix, ""));
    } else if (fileUrl.startsWith("uploads/")) {
      filePath = fileUrl;
    } else {
      return; // Cannot determine file path, skip deletion
    }

    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
    }
  } catch (error) {
    console.error("Firebase Storage silme hatası:", error);
  }
}

export function getPublicUrl(filePath: string): string {
  // If it's already a full URL, return as-is
  if (filePath.startsWith("http")) return filePath;
  
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET ?? "";
  return `https://storage.googleapis.com/${bucketName}/${filePath}`;
}
