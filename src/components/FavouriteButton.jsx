import React from 'react';
import { useFavourites } from '../context/FavouritesContext';
import styles from './FavouriteButton.module.css';

const FavouriteButton = ({ episode, showTitle, seasonTitle }) => {
  const { addFavourite, removeFavourite, isFavourite, favourites } = useFavourites();

  // Debug logging
  console.log('=== FavouriteButton Debug ===');
  console.log('Episode ID:', episode.id);
  console.log('Episode Title:', episode.title);
  console.log('Is favourite result:', isFavourite(episode.id));
  console.log('All favourites:', favourites.map(f => ({ episodeId: f.episodeId, title: f.title })));
  console.log('=============================');

  const handleToggleFavourite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Toggling favourite for episode:', episode.id);

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
      console.log('Removing favourite');
      const favouriteToRemove = favourites.find(fav => fav.episodeId === episode.id);
      console.log('Found favourite to remove:', favouriteToRemove);
      if (favouriteToRemove) {
        removeFavourite(favouriteToRemove.id);
      }
    } else {
      console.log('Adding favourite');
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