import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Ρύθμιση Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.body;
    // Επειδή το FormData είναι stream, θέλει ειδικό χειρισμό στο Next.js
    const data = await req.formData();
    const files = data.getAll("files") as File[];

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url as string);
          })
          .end(buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    return NextResponse.json(urls); // Επιστρέφει το ["url1", "url2"]
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
