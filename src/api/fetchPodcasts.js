import { genres } from '../data';

// genre mapping from local data
const GENRE_MAPPING = genres.reduce((mapping, genre) => {
  mapping[genre.id] = genre.title;
  return mapping;
}, {});

// Get genre title from ID
const getGenreTitle = (genreId) => {
  return GENRE_MAPPING[genreId] || 'Unknown Genre';
};

/**
 * @function fetchPodcasts
 * Asynchronously fetches podcast data from the remote API and updates state accordingly.
 * Handles loading, error, and successful data response via provided state setters.
 *
 * @param {Function} setPodcasts - State setter function to update the podcasts array.
 * @param {Function} setError - State setter function to update the error message (string).
 * @param {Function} setLoading - State setter function to toggle the loading state (boolean).
 *
 * @returns {Promise<void>} A promise that resolves when the fetch process completes.
 *
 **/
export async function fetchPodcasts(setPodcasts, setError, setLoading) {
  try {
    const res = await fetch("https://podcast-api.netlify.app/shows");
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    
    // Transform the data to include genre titles and IDs for filtering
    const transformedData = data.map(preview => ({
      id: preview.id,
      title: preview.title,
      description: preview.description,
      seasons: preview.seasons,
      image: preview.image,
      genres: preview.genres.map(genreId => getGenreTitle(genreId)),
      updated: preview.updated,
      genreIds: preview.genres // Keep original genre IDs for filtering
    }));
    
    setPodcasts(transformedData);
  } catch (err) {
    console.error("Failed to fetch podcasts:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

// Export helper functions for use in other components
export { GENRE_MAPPING, getGenreTitle };