import { getGenreTitle } from './fetchPodcasts';
import { formatDate } from '../utils/formatDate';

const API_BASE_URL = 'https://podcast-api.netlify.app';

// Fetch specific show with full details
export const getShowDetail = async (showId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/id/${showId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch show details');
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

    genres: (showData.genres || []).map(genreId => getGenreTitle(genreId)),
    genreIds: showData.genres || [],

    updated: showData.updated,

    seasons: (showData.seasons || []).map(season => ({
      id: season.id,
      title: season.title || `Season ${season.number || 1}`,
      number: season.number || 1,
      description: season.description || '',
      image: season.image || showData.image,

      episodes: (season.episodes || []).map(episode => ({
        id: episode.id,
        title: episode.title || 'Untitled Episode',
        description: episode.description || 'No description available.',
        duration: formatDuration(episode.duration),
        releaseDate: formatDate(episode.releaseDate),
        number: episode.number || 1,
        seasonNumber: season.number || 1
      }))
    }))
  };
};

// Format duration from seconds to minutes
const formatDuration = (seconds) => {
  if (!seconds) return 'Unknown duration';
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};