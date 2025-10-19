import React from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { Link } from 'react-router-dom';
import styles from './FavouritesPage.module.css';

const FavouritesPage = () => {
  const { favourites, sortOrder, setSortOrder } = useFavourites();

  const groupedFavourites = favourites.reduce((groups, favourite) => {
    const showTitle = favourite.showTitle;
    if (!groups[showTitle]) {
      groups[showTitle] = [];
    }
    groups[showTitle].push(favourite);
    return groups;
  }, {});

  if (favourites.length === 0) {
    return (
      <div className={styles.favouritesPage}>
        <div className={styles.header}>
          <h1>Favourite Episodes</h1>
          <p>No favourite episodes yet. Start adding some!</p>
          <Link to="/" className={styles.backLink}>← Browse Podcasts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favouritesPage}>
      <div className={styles.header}>
        <h1>Favourite Episodes</h1>
        <p>Your saved episodes from all shows</p>

        <div className={styles.controls}>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
          <select className={styles.sortSelect}>
            <option>All Shows</option>
          </select>
        </div>
      </div>

      <div className={styles.favouritesList}>
        {Object.entries(groupedFavourites).map(([showTitle, showFavourites]) => (
          <div key={showTitle} className={styles.showGroup}>
            <h2 className={styles.showTitle} data-episode-count={`${showFavourites.length} episodes`}>
              {showTitle}
            </h2>
            <div className={styles.episodesGrid}>
              {showFavourites.map((favourite) => (
                <div key={favourite.id} className={styles.favouriteCard}>
                  <img
                    src={favourite.image}
                    alt={favourite.title}
                    className={styles.episodeImage}
                  />
                  <div className={styles.episodeInfo}>
                    <h3 className={styles.episodeTitle}>{favourite.title}</h3>
                    <p className={styles.episodeSeason}>{favourite.seasonTitle}</p>
                    
                    <p className={styles.episodeDescription}>
                      {favourite.description.length > 100
                        ? `${favourite.description.substring(0, 100)}...`
                        : favourite.description
                      }
                    </p>
                    <div className={styles.episodeMeta}>
                      <span className={styles.duration}>{favourite.duration}</span>
                      <span className={styles.addedDate}>
                        Added: {new Date(favourite.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouritesPage;