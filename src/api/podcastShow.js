import { getGenreTitle } from './fetchPodcasts';
import { formatDate } from '../utils/formatDate';
 
const API_BASE_URL = 'https://podcast-api.netlify.app';

// Fetch specific podcast with full details
export const getShowDetail = async (showId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/id/${showId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch podcast details');
    }
    const showData = await response.json();
    console.log('Raw API response:', showData);
    return transformShowData(showData);
  } catch (error) {
    console.error('Error fetching show detail:', error);
    throw error;
  }
};

const transformShowData = (showData) => {
  
  if (!showData) {
    throw new Error('No show data received');
  }

  console.log('=== DEBUG EPISODE DATA ===');
  if (showData.seasons?.[0]?.episodes?.[0]) {
    const firstEpisode = showData.seasons[0].episodes[0];
    console.log('First episode object:', firstEpisode);
    console.log('Available keys:', Object.keys(firstEpisode));
    console.log('Audio-related fields:');
    console.log('- audio:', firstEpisode.audio);
    console.log('- audioUrl:', firstEpisode.audioUrl);
    console.log('- file:', firstEpisode.file);
    console.log('- url:', firstEpisode.url);
  }
  console.log('========================');


  return {
    id: showData.id,
    title: showData.title || 'Unknown title',
    description: showData.description || 'No desnpmcription available.',
    image: showData.image,

    genres: showData.genres || ['General'],
    genreIds: showData.genres || [],

    updated: showData.updated,

    seasons: (showData.seasons || []).map(season => ({
      id: season.id,
      title: season.title || `Season ${season.number || 1}`,
      number: season.number || 1,
      description: season.description || '',
      image: season.image || showData.image,
      year: season.year || new Date().getFullYear(),
      episodes: (season.episodes || []).map(episode => ({
        id: episode.id,
        title: episode.title || 'Untitled Episode',
        description: episode.description || 'No description available.',
        duration: formatDuration(episode.duration),
        releaseDate: 'Jan 15, 2025',
        number: episode.episode || episode.number || 1,
        seasonNumber: season.number || 1,
        audioUrl: episode.audio || episode.audioUrl || episode.file || episode.url,
        image: episode.image || season.image || showData.image
      }))
    }))
  };
};

// Format duration from seconds to minutes
/*const formatDuration = (seconds) => {
  if (!seconds) return 'Unknown duration';
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};*/
// Format duration from seconds to minutes - ROBUST VERSION
const formatDuration = (seconds) => {
  // Check for null, undefined, empty string, etc.
  if (!seconds && seconds !== 0) {
    console.warn('formatDuration: Missing duration value');
    return 'Unknown duration';
  }
  
  // Handle case where duration might already be in "mm:ss" or "X min" format
  if (typeof seconds === 'string') {
    if (seconds.includes(':') || seconds.includes('min')) {
      return seconds; // Already formatted, return as-is
    }
  }
  
  // Convert to number
  const numSeconds = parseInt(seconds);
  
  // Check if conversion resulted in a valid number
  if (isNaN(numSeconds)) {
    console.warn('formatDuration: Invalid duration format:', seconds);
    return 'Unknown duration';
  }
  
  // Handle zero or negative duration
  if (numSeconds <= 0) {
    return '0 min';
  }
  
  const minutes = Math.floor(numSeconds / 60);
  const remainingSeconds = numSeconds % 60;
  
  // Format as "X min" for simplicity, or "X:XX" for more precision
  if (remainingSeconds > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes} min`;
};