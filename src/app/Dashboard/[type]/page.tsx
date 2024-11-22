"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TypePage({ params }: { params: { type: string } }) {
  const [type, setType] = useState<string | null>(null);
  const [seriesList, setSeriesList] = useState<string[]>([]);

  useEffect(() => {
    const fetchType = async () => {
      // Unwrap `params` using React use
      const resolvedParams = await Promise.resolve(params); // Ensure params is awaited
      setType(resolvedParams.type);

      if (resolvedParams.type) {
        const fetchSeriesList = async () => {
          try {
            const response = await fetch(`/api/videos/${resolvedParams.type}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSeriesList(data);
          } catch (error) {
            console.error("Error fetching series list:", error);
          }
        };

        fetchSeriesList();
      }
    };

    fetchType();
  }, [params]);

  if (!type) {
    return <div>Loading...</div>; // Show loading while `type` is being set
  }

  return (
    <div>
      <h1>{type} Series</h1>
      <ul>
        {seriesList.map((series, index) => (
          <li key={index}>
            <Link href={`/Dashboard/${type}/${series}`}>{series}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
