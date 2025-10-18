import React, { useRef, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
/*import styles from './AudioPlayer.module.css';*/

const AudioPlayer = () => {
  const { state, dispatch } = useAudio();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying, state.currentTrack]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (state.isPlaying) {
        e.preventDefault();
        e.returnValue = 'You are currently playing audio. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.isPlaying]);

  const handlePlayPause = () => {
    dispatch({ type: state.isPlaying ? 'PAUSE' : 'PLAY' });
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    dispatch({ type: 'SET_PROGRESS', payload: newProgress });
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      dispatch({ type: 'SET_PROGRESS', payload: audioRef.current.currentTime });
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      dispatch({ type: 'SET_DURATION', payload: audioRef.current.duration });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!state.currentTrack) return null;

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioRef}
        src={state.currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => dispatch({ type: 'PAUSE' })}
      />
      
      <div className={styles.playerContent}>
        <div className={styles.trackInfo}>
          <img 
            src={state.currentTrack.image} 
            alt={state.currentTrack.title}
            className={styles.trackImage}
          />
          <div className={styles.trackDetails}>
            <h4 className={styles.trackTitle}>{state.currentTrack.title}</h4>
            <p className={styles.trackShow}>{state.currentTrack.showTitle}</p>
          </div>
        </div>

        <div className={styles.controls}>
          <button onClick={handlePlayPause} className={styles.controlButton}>
            {state.isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className={styles.progressSection}>
            <span className={styles.time}>{formatTime(state.progress)}</span>
            <input
              type="range"
              min="0"
              max={state.duration || 100}
              value={state.progress}
              onChange={handleProgressChange}
              className={styles.progressBar}
            />
            <span className={styles.time}>{formatTime(state.duration)}</span>
          </div>
        </div>

        <div className={styles.volumeSection}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={state.volume}
            onChange={(e) => {
              dispatch({ type: 'SET_VOLUME', payload: parseFloat(e.target.value) });
              if (audioRef.current) {
                audioRef.current.volume = parseFloat(e.target.value);
              }
            }}
            className={styles.volumeSlider}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;