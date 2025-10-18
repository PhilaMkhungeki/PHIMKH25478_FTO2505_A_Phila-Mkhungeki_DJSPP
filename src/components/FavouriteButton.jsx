import React from 'react';
import { useFavourites } from '../../context/FavouritesContext';
import styles from './FavouriteButton.module.css';

const FavouriteButton = ({ episode, showTitle, seasonTitle }) => {
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();

  const handleToggleFavourite = () => {
    const favouriteData = {
      episodeId: episode.id,
      title: episode.title,
      description: episode.description,
      duration: episode.duration,
      releaseDate: episode.releaseDate,
      image: episode.image,
      audioUrl: episode.audioUrl,
      showTitle,
      seasonTitle,
    };

    if (isFavourite(episode.id)) {
      // Find the favourite ID to remove
      const favourites = JSON.parse(localStorage.getItem('podcast-favourites') || '[]');
      const favouriteToRemove = favourites.find(fav => fav.episodeId === episode.id);
      if (favouriteToRemove) {
        removeFavourite(favouriteToRemove.id);
      }
    } else {
      addFavourite(favouriteData);
    }
  };

  return (
    <button
      onClick={handleToggleFavourite}
      className={`${styles.favouriteButton} ${
        isFavourite(episode.id) ? styles.favourited : ''
      }`}
      aria-label={isFavourite(episode.id) ? 'Remove from favourites' : 'Add to favourites'}
    >
      {isFavourite(episode.id) ? '❤️' : '🤍'}
    </button>
  );
};

export default FavouriteButton;