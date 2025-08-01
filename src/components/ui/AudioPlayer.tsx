import { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';

interface AudioProps {
    src:string
    volume?: number
}

const AudioPlayer:React.FC<AudioProps> = forwardRef(({ src, volume=1 }, ref) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audioRef.current.volume = volume
    }, [])

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current.play();
      setIsPlaying(true);
    },
    pause: () => {
      audioRef.current.pause();
      setIsPlaying(false);
    },
    toggle: () => {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    },
  }));

  return (
    <div>
      <audio ref={audioRef} src={src} preload="auto" volume />
    </div>
  );
});

export default AudioPlayer;
