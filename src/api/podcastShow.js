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


  return {
    id: showData.id,
    title: showData.title || 'Unknown title',
    description: showData.description || 'No description available.',
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
      episodes: (season.episodes || []).map(episode => {
        console.log('Processing episode:', episode.title);
        console.log('Raw duration value:', episode.duration);

        return{
          id: episode.id,
          title: episode.title || 'Untitled Episode',
          description: episode.description || 'No description available.',
          duration: formatDuration(episode.duration),
          releaseDate: 'Jan 15, 2025',
          number: episode.episode || episode.number || 1,
          seasonNumber: season.number || 1,
          audioUrl: episode.audio || episode.audioUrl || episode.file || episode.url,
          image: episode.image || season.image || showData.image
        };
      })
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
// Format duration from seconds to minutes - FIXED VERSION
const formatDuration = (seconds) => {
  console.log('Duration value received:', seconds, 'Type:', typeof seconds);
  
  if (!seconds && seconds !== 0) {
    return 'Unknown duration';
  }
  
  // Convert to number if it's a string
  const numSeconds = parseInt(seconds);
  
  if (isNaN(numSeconds)) {
    return 'Unknown duration';
  }
  
  // Convert seconds to minutes
  const minutes = Math.floor(numSeconds / 60);
  return `${minutes} min`;
};