import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { type: string } }) {
  const { type } = params;

  try {
    const videoDir = path.join(process.cwd(), "public/videos", type); // Path to the video type folder
    const folders = await fs.readdir(videoDir, { withFileTypes: true });

    // Filter and map folder names only
    const folderNames = folders.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

    return NextResponse.json(folderNames); // Return folder names as JSON
  } catch (error) {
    console.error("Error reading video folders:", error);
    return NextResponse.json({ error: "Unable to fetch folders." }, { status: 500 });
  }
}
