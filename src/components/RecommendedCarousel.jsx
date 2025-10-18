import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePodcast } from '../context/PodcastContext';
/*import styles from './Carousel.module.css';*/

const RecommendedCarousel = () => {
  const { podcasts } = usePodcast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendedShows, setRecommendedShows] = useState([]);

  useEffect(() => {
    // Get random shows for recommendations
    const shuffled = [...podcasts].sort(() => 0.5 - Math.random());
    setRecommendedShows(shuffled.slice(0, 10));
  }, [podcasts]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === recommendedShows.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recommendedShows.length - 1 : prevIndex - 1
    );
  };

  if (recommendedShows.length === 0) return null;

  return (
    <section className={styles.carouselSection}>
      <h2 className={styles.carouselTitle}>Recommended For You</h2>
      <div className={styles.carouselContainer}>
        <button onClick={prevSlide} className={styles.carouselButton}>
          ‹
        </button>
        
        <div className={styles.carousel}>
          <div
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${currentIndex * 320}px)` }}
          >
            {recommendedShows.map((show) => (
              <div key={show.id} className={styles.carouselItem}>
                <Link to={`/show/${show.id}`} className={styles.carouselLink}>
                  <img
                    src={show.image}
                    alt={show.title}
                    className={styles.carouselImage}
                  />
                  <div className={styles.carouselContent}>
                    <h3 className={styles.carouselShowTitle}>{show.title}</h3>
                    <div className={styles.carouselGenres}>
                      {show.genres.slice(0, 2).map((genre) => (
                        <span key={genre} className={styles.carouselGenre}>
                          {genre}
                        </span>
                      ))}
                    </div>
                    <p className={styles.carouselSeasons}>
                      {show.seasons} seasons
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button onClick={nextSlide} className={styles.carouselButton}>
          ›
        </button>
      </div>
    </section>
  );
};

export default RecommendedCarousel;