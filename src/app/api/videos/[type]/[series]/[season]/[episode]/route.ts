import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: { params: { type: string; series: string; season: string; episode: string } }
) {
  const { type, series, season, episode } = params;

  // Mock data for demonstration
  const mockData = {
    title: `${episode}`,
    description: `This is the description for episode ${episode} in season ${season} of ${series}.`,
    videoPath: `/videos/${type}/${series}/${season}/${episode}/video.mp4`,
  };

  // Return the mock data as a JSON response
  return NextResponse.json(mockData);
}
