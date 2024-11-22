"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SeasonPage({ params }: { params: { type: string; series: string, season: string } }) {
  const [type, setType] = useState<string | null>(null);
  const [series, setSeries] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to extract the episode number from the episode name (e.g., "Episode 1")
  const extractEpisodeNumber = (episodeName: string): number => {
    const match = episodeName.match(/episode\s+(\d+)/i); // Match "episode" followed by a number
    return match ? parseInt(match[1], 10) : 0; // Return the number, defaulting to 0 if not found
  };

  useEffect(() => {
    const fetchEpisodes = async () => {
        const resolvedParams = await Promise.resolve(params);
        setType(resolvedParams.type);
        setSeries(resolvedParams.series);
        setSeason(resolvedParams.season);

        if (resolvedParams.type) {
            const fetchepisodeList = async () => {
              try {
                const response = await fetch(`/api/videos/${resolvedParams.type}/${resolvedParams.series}/${resolvedParams.season}`);
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();

                // Sort episodes by extracting the episode number using regex
                const sortedData = data.sort((a: string, b: string) => {
                    const episodeNumberA = extractEpisodeNumber(a);
                    const episodeNumberB = extractEpisodeNumber(b);
                    return episodeNumberA - episodeNumberB; // Sort numerically by episode number
                });

                setEpisodes(sortedData);
              } catch (error) {
                console.error("Error fetching series list:", error);
              }
            };
    
            fetchepisodeList();
        }
    };

    fetchEpisodes();
  }, [params]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!episodes.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{series} - {season} - Episodes</h1>
      <ul>
        {episodes.map((episode, index) => (
          <li key={index}>
            <Link href={`/Dashboard/${type}/${series}/${season}/${episode}`}>{episode}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
