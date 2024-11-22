"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type EpisodeDetails = {
  title: string;
  description: string;
  videoPath: string;
};

export default function EpisodePage() {
  const params = useParams();

  if (!params || !params.season) {
    return <div>Loading...</div>;
  }

  const { type, series, season } = params as {
    type: string;
    series: string;
    season: string;
  };

  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
  const [details, setDetails] = useState<EpisodeDetails | null>(null);
  const [seasonList, setSeasonList] = useState<string[]>([]);
  const [episodeList, setEpisodeList] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const extractEpisodeNumber = (episodeName: string): number => {
    const match = episodeName.match(/episode\s+(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  useEffect(() => {
    if (videoRef.current) {
      // Play video automatically with muted sound initially
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [currentEpisode]);

  // Fetch episode details based on current season and episode
  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      try {
        const response = await fetch(
          `/api/videos/${type}/${series}/${currentSeason}/${currentEpisode}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDetails(data);

        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error fetching episode details:", error);
      }
    };

    if (currentEpisode) {
      fetchEpisodeDetails();
    }
  }, [type, series, currentSeason, currentEpisode]);

  // Fetch seasons for the series
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`/api/videos/${type}/${series}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSeasonList(data.sort((a: string, b: string) => +a - +b));
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };

    fetchSeasons();
  }, [type, series]);

  // Fetch episodes for the current season
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`/api/videos/${type}/${series}/${currentSeason}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const sortedData = data.sort((a: string, b: string) => {
          const episodeNumberA = extractEpisodeNumber(a);
          const episodeNumberB = extractEpisodeNumber(b);
          return episodeNumberA - episodeNumberB;
        });
        setEpisodeList(sortedData);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    fetchEpisodes();
  }, [type, series, currentSeason]);

  // Set the first episode when episodeList is populated and currentEpisode is not set
  useEffect(() => {
    if (episodeList.length > 0 && !currentEpisode) {
      setCurrentEpisode(episodeList[0]);
    }
  }, [episodeList, currentEpisode]);

  const handleNextEpisode = () => {
    const currentIndex = episodeList.indexOf(currentEpisode);
    if (currentIndex !== -1 && currentIndex < episodeList.length - 1) {
      setCurrentEpisode(episodeList[currentIndex + 1]);
    } else {
      const currentSeasonIndex = seasonList.indexOf(currentSeason);
      if (currentSeasonIndex < seasonList.length - 1) {
        setCurrentSeason(seasonList[currentSeasonIndex + 1]);
        setCurrentEpisode(episodeList[0]);
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current && document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    }
  };

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 3 }}>
        <h1>{details.title}</h1>
        <p>{details.description}</p>
        <video
          key={details.videoPath}  // Use episode as key to force reload
          ref={videoRef}
          controls
          autoPlay
          onPlay={handleFullscreen}
          onEnded={() => {
            handleNextEpisode();
          }}
          width="100%"
        >
          <source src={details.videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div
        style={{
          flex: 1,
          marginLeft: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <h2>Seasons</h2>
        <ul>
          {seasonList.map((seasonName) => (
            <li
              key={seasonName}
              style={{
                fontWeight: currentSeason === seasonName ? "bold" : "normal",
              }}
            >
              <button
                onClick={() => {
                  setCurrentSeason(seasonName);
                  setCurrentEpisode("1");
                }}
              >
                {seasonName}
              </button>
            </li>
          ))}
        </ul>
        <h3>Episodes</h3>
        <ul>
          {episodeList.map((episodeName) => (
            <li
              key={episodeName}
              style={{
                fontWeight: currentEpisode === episodeName ? "bold" : "normal",
              }}
            >
              <button onClick={() => setCurrentEpisode(episodeName)}>
                {episodeName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
