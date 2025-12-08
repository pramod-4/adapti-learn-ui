import React, { useEffect, useRef } from "react";

interface YTPlayer {
  destroy: () => void;
  loadVideoById: (videoId: string | object, startSeconds?: number, suggestedQuality?: string) => void;
}

interface YTAPI {
  Player: new (element: HTMLDivElement | null, options: {
    videoId: string;
    events: {
      onReady?: (event: YTEvent) => void;
      onStateChange: (event: YTEvent) => void;
      onError?: (event: YTEvent) => void;
    };
    playerVars: {
        [key: string]: string | number | boolean | undefined;
    };
  }) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

interface YTEvent {
  data: number;
  target: YTPlayer;
}

declare global {
  interface Window {
    YT: YTAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Props {
  videoId: string | null;
  onWatchTime: (seconds: number) => void;
}

const YouTubePlayer: React.FC<Props> = ({ videoId, onWatchTime }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const watchStartRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0);

  useEffect(() => {
    const loadApi = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        
        window.onYouTubeIframeAPIReady = () => {
          createPlayer();
        };
      } else {
        createPlayer();
      }
    };

    const createPlayer = () => {
      if (!containerRef.current || !window.YT) return;
      
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId || "",
        events: {
          onStateChange: onPlayerStateChange,
        },
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
      });
      accumulatedRef.current = 0;
      watchStartRef.current = null;
      onWatchTime(0);
    };

    const onPlayerStateChange = (event: YTEvent) => {
      const YT = window.YT;
      if (!YT) return;
      
      if (event.data === YT.PlayerState.PLAYING) {
        if (!watchStartRef.current) watchStartRef.current = Date.now();
      } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        if (watchStartRef.current) {
          const delta = (Date.now() - watchStartRef.current) / 1000;
          accumulatedRef.current += Math.floor(delta);
          watchStartRef.current = null;
          onWatchTime(Math.floor(accumulatedRef.current));
        }
      }
    };

    loadApi();

    return () => {
      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      } catch {}
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    const t = setInterval(() => {
      if (watchStartRef.current) {
        const delta = (Date.now() - watchStartRef.current) / 1000;
        onWatchTime(Math.floor(accumulatedRef.current + delta));
      } else {
        onWatchTime(Math.floor(accumulatedRef.current));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [onWatchTime]);

  return <div ref={containerRef} style={{ width: "100%", maxWidth: 560, height: 315 }} />;
};

export default YouTubePlayer;