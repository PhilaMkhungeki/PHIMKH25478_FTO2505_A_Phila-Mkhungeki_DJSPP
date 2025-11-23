import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShowDetail } from '../api/podcastShow';
import { formatDate } from '../utils/formatDate';
import FavouriteButton from './FavouriteButton';
import { useAudio } from '../context/AudioContext';
import styles from './ShowDetail.module.css';

const ShowDetail = () => {
  const { showId } = useParams();
  const { dispatch } = useAudio();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    const fetchShowDetail = async () => {
      try {
        setLoading(true);
       
        const showData = await getShowDetail(showId);
        setShow(showData);
        // Set first season as default selected
        if (showData.seasons && showData.seasons.length > 0) {
          setSelectedSeason(showData.seasons[0]);
        }
      } catch (err) {
        setError('Failed to load show details. Please try again.');
        console.error('Error fetching show detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetail();
  }, [showId]);

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
  };

  // Add play functionality for episodes
  const handlePlayEpisode = (episode) => {
    dispatch({
      type: 'SET_CURRENT_TRACK',
      payload: {
        title: episode.title,
        showTitle: show.title,
        audioUrl: episode.audioUrl,
        image: episode.image || show.image // Fallback to show image if episode has none
      }
    });
  };

  // Calculate total episodes
  const totalEpisodes = show?.seasons?.reduce((total, season) => 
    total + (season.episodes?.length || 0), 0
  ) || 0;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading podcast details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Link to="/" className={styles.backLink}>← Back to All Podcasts</Link>
      </div>
    );
  }

  if (!show) {
    return (
      <div className={styles.notFound}>
        <h2>Podcast Not Found</h2>
        <p>The podcast you're looking for doesn't exist.</p>
        <Link to="/" className={styles.backLink}>← Back to All Podcasts</Link>
      </div>
    );
  }
    
  return (
    <div className={styles.showDetail}>
      <nav className={styles.detailNav}>
        <Link to="/" className={styles.backLink}>← Back to All Podcasts</Link>
      </nav>

      {/* Podcast Info Table */}
      <div className={styles.podcastTopSection}>
        <div className={styles.podcastImageContainer}>
          <img src={show.image} alt={show.title} className={styles.podcastCover} />
        </div>
        <div className={styles.podcastHeader}>
          <h1 className={styles.podcastTitle}>{show.title}</h1>
          <p className={styles.podcastDescription}>{show.description}</p>
          <div className={styles.podcastDetails}>
            <div className={styles.genresSection}>
              <span className={styles.sectionLabel}>GENRES</span>
                <div className={styles.genresList}>
                  {show.genres.map((genre, index) => (
                    <span key={index} className={styles.genreTag}>
                      {genre}
                    </span>
                  ))}
              </div>
            </div>
            <div className={styles.updateSection}>
              <span className={styles.sectionLabel}>LAST UPDATED</span>
              <span className={styles.updateDate}>{formatDate(show.updated)}</span>
            </div>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>TOTAL SEASONS</span>
              <span className={styles.statValue}>{show.seasons?.length || 0} Seasons</span>
            </div>
            <div className={styles.statEpisodes}>
              <span className={styles.statLabel}>TOTAL EPISODES</span>
              <span className={styles.statValue}>{totalEpisodes} Episodes</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentSections}>
        {/* Season Navigation */}
        <div className={styles.seasonNavigationSection}>
          <div className={styles.seasonsHeader}>
            <h2>Current Season</h2>

           {/* <div className={styles.seasonDropdown}>
              <select
                value={selectedSeason?.id || ''}
                onChange={(e) => {
                  const selected = show.seasons?.find(season => season.id === e.target.value);
                  if (selected) handleSeasonSelect(selected);
                }}
                className={styles.seasonSelect}
              >
                {show.seasons?.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.title}
                  </option>
                ))}
              </select>
            </div> */}

            {/*<div className={styles.seasonDropdown}>
              <select
                value={selectedSeason?.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selected = show.seasons?.find(season => season.id?.toString() === selectedId);
                  if (selected) {
                    setSelectedSeason(selected);
                  }
                }}
                className={styles.seasonSelect}
              >
                {show.seasons?.map(season => (
                  <option key={season.id || season.title} value={season.id?.toString() || season.title}>
                    {season.title}
                  </option>
                ))}
              </select>
            </div>*/}
            <div className={styles.seasonDropdown}>
              <select
                value={selectedSeason?.title || ''}
                onChange={(e) => {
                  const selectedTitle = e.target.value;
                  const selected = show.seasons?.find(season => season.title === selectedTitle);
                  if (selected) {
                    setSelectedSeason(selected);
                  }
                }}
                className={styles.seasonSelect}
              >
                {show.seasons?.map(season => (
                  <option key={season.title} value={season.title}>
                    {season.title}
                  </option>
                ))}
              </select>
            </div>

          </div>  
        </div>

        {/* Selected Season Info */}
        <div className={styles.selectedSeasonSection}> 
          {selectedSeason && (
            <div className={styles.currentSeasonInfo}>
              <h3>{selectedSeason.title}</h3>
              <p className={styles.seasonDescription}>{selectedSeason.description}</p>
              <p className={styles.seasonMeta}>
                {selectedSeason.episodes?.length || 0} Episodes • Released {selectedSeason.year || '2024'}
              </p>
            </div>
          )}
          {/* Episodes List */}
          <div className={styles.episodesSection}>
            <div className={styles.episodesList}>
              {selectedSeason?.episodes?.map(episode => (
                <div key={episode.id} className={styles.episodeCard}>
                  <div className={styles.episodeContent}>
                    <div className={styles.episodeHeader}>
                      <div className={styles.episodeInfo}>
                        <h4 className={styles.episodeTitle}>{episode.title}</h4>
                        <div className={styles.episodeMeta}>
                          <span className={styles.seasonEpisode}>
                            Season {episode.seasonNumber} • Episode {episode.number}
                          </span>
                          <span className={styles.episodeDuration}>{episode.duration}</span>
                        </div>
                      </div>
                      <div className={styles.episodeActions}>
                        <FavouriteButton 
                          episode={episode}
                          showTitle={show.title}
                          seasonTitle={selectedSeason.title}
                        />
                      </div>
                    </div>
                    <p className={styles.episodeDescription}>{episode.description}</p>
                    <div className={styles.episodeBottomRow}>
                      <span>{episode.releaseDate}</span>
                      <button 
                          onClick={() => handlePlayEpisode(episode)}
                          className={styles.playButton}
                          title="Play episode"
                      >
                          ▶ Play
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetail;
