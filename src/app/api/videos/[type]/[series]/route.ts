import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Handle the GET request
export async function GET(req: Request, { params }: { params: { type: string, series: string } }) {
  const { type, series } = params;

  try {
    // Define the path to the series folder
    const seriesPath = path.join(process.cwd(), "public", "videos", type, series);

    // Read the folder contents for the given series
    const folderNames = await fs.readdir(seriesPath, { withFileTypes: true });

    // Filter and return only the directories (representing seasons)
    const seasons = folderNames
      .filter((folder) => folder.isDirectory()) // Only get directories (seasons)
      .map((folder) => folder.name); // Return the folder names as an array

    return NextResponse.json(seasons); // Return the list of seasons as a JSON response
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return NextResponse.json({ error: "Unable to fetch seasons." }, { status: 500 });
  }
}
