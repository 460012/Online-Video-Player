import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Handle the GET request
export async function GET(req: Request, { params }: { params: { type: string, series: string, season: string } }) {
  const { type, series, season } = params;

  try {
    // Define the path to the series folder
    const seasonPath = path.join(process.cwd(), "public", "videos", type, series, season);

    // Read the folder contents for the given series
    const folderNames = await fs.readdir(seasonPath, { withFileTypes: true });

    // Filter and return only the directories (representing seasons)
    const episodes = folderNames
      .filter((folder) => folder.isDirectory()) // Only get directories (seasons)
      .map((folder) => folder.name); // Return the folder names as an array

    return NextResponse.json(episodes); // Return the list of seasons as a JSON response
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return NextResponse.json({ error: "Unable to fetch episodes." }, { status: 500 });
  }
}
