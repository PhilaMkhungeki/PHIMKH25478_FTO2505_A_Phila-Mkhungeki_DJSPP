import { formatDate } from "../utils/formatDate";
import styles from "./PodcastCard.module.css";
import {useFavourites} from '../context/FavouritesContext';

/**
 * Renders a single podcast preview card with image, title, number of seasons,
 * genres (as styled tags), and the last updated date.
 *
 * @param {Object} props
 * @param {Object} props.podcast - The podcast data object to display.
 * @param {string} props.podcast.id - Unique ID of the podcast.
 * @param {string} props.podcast.title - Title of the podcast.
 * @param {string} props.podcast.image - URL of the podcast image.
 * @param {number} props.podcast.seasons - Number of seasons available.
 * @param {string} props.podcast.updated - ISO date string for the last update.
 * @param {Array<Object>} props.genres - Array of genre objects for mapping IDs to titles.
 *
 * @returns {JSX.Element} The rendered podcast card component.
 */
export default function PodcastCard({ podcast, genres }) {
  const { favourites, isFavourite } = useFavourites();

  const genreSpans = podcast.genres.map((id) => {
    const match = genres.find((genre) => genre.id === id);
    return (
      <span key={id} className={styles.tag}>
        {match ? match.title : `Unknown (${id})`}

      </span>
    );
  });

  // check if any episodes from this podcast are favourited
  const hasFavouritedEpisodes = favourites.some(fav => fav.showTitle === podcast.title);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
          <img src={podcast.image} alt={podcast.title} />
          {/* Show heart indicator if podcast has favourited episodes */}
          {hasFavouritedEpisodes && (
            <div className={styles.favouriteIndicator} title="Has favourited episodes">
              ❤️
            </div>
          )}
      </div>   
      <div className={styles.content}>
          <h3>{podcast.title}</h3>
          <p className={styles.seasons}>{podcast.seasons} seasons</p>
          <div className={styles.tags}>{genreSpans}</div>
          <p className={styles.updatedText}>
            Updated {formatDate(podcast.updated)}
          </p>
      </div>    
    </div>
  );
}
