"use client";

import { useState, useRef, useEffect } from "react";

const MUSIC_SRC = "/audio/background.mp3";

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unmutedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.muted = true;
    audioRef.current = audio;

    const unmute = () => {
      if (unmutedRef.current || !audioRef.current) return;
      unmutedRef.current = true;
      audioRef.current.muted = false;
      audioRef.current.volume = 0.4;
      setPlaying(true);
      setShowUnmuteHint(false);
      document.removeEventListener("click", unmute);
      document.removeEventListener("touchstart", unmute);
      document.removeEventListener("keydown", unmute);
    };

    document.addEventListener("click", unmute, { once: true });
    document.addEventListener("touchstart", unmute, { once: true });
    document.addEventListener("keydown", unmute, { once: true });

    audio.play().then(() => setPlaying(true)).catch(() => {});

    return () => {
      document.removeEventListener("click", unmute);
      document.removeEventListener("touchstart", unmute);
      document.removeEventListener("keydown", unmute);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [mounted]);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (!unmutedRef.current) {
      unmutedRef.current = true;
      audio.muted = false;
      audio.volume = 0.4;
      setShowUnmuteHint(false);
    }
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  if (!mounted) return null;

  return (
    <div className="fixed bottom-20 left-4 z-[90] flex flex-col items-start gap-2">
      {showUnmuteHint && (
        <p className="rounded-lg border border-[#707164]/50 bg-[#12110D]/95 px-3 py-2 text-xs text-[#E5E7E3]/90 shadow-lg sm:text-sm">
          Tryck var som helst för att spela musik
        </p>
      )}
      <button
        type="button"
        onClick={toggle}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#707164]/50 bg-[#12110D]/95 text-[#E5E7E3] shadow-lg transition-colors hover:bg-[#1a1916] hover:text-[#EAC84E] focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D]"
        aria-label={playing ? "Stäng bakgrundsmusik" : "Spela bakgrundsmusik"}
        title={playing ? "Stäng musik" : "Spela musik"}
      >
      {playing ? (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
      </button>
    </div>
  );
}
