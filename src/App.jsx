import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PodcastProvider } from "./context/PodcastContext";
import { AudioProvider } from "./context/AudioContext";
import { FavouritesProvider } from "./context/FavouritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { fetchPodcasts } from "./api/fetchPodcasts";
import { genres } from "./data";

// Components
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import SortSelect from "./components/SortSelect";
import GenreFilter from "./components/GenreFilter";
import PodcastGrid from "./components/PodcastGrid";
import Pagination from "./components/Pagination";
import ShowDetail from "./components/ShowDetail";
import FavouritesPage from "./components/FavouritePage";
import AudioPlayer from "./components/AudioPlayer";
import RecommendedCarousel from "./components/RecommendedCarousel";
import ThemeToggle from "./components/ThemeToggle";

// Styles
import "./components/Themes.css";
import styles from "./App.module.css";

function AppContent() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPodcasts(setPodcasts, setError, setLoading);
  }, []);

  return (
    <>
      <Header />
      <ThemeToggle />
      
      <Routes>
        <Route path="/" element={
          <PodcastProvider initialPodcasts={podcasts}>
            <main className={styles.main}>
              <RecommendedCarousel />
              
              <section className={styles.controls}>
                <SearchBar />
                <GenreFilter genres={genres} />
                <SortSelect />
              </section>

              {loading && (
                <div className={styles.messageContainer}>
                  <div className={styles.spinner}></div>
                  <p>Loading podcasts...</p>
                </div>
              )}

              {error && (
                <div className={styles.message}>
                  <div className={styles.error}>
                    Error occurred while fetching podcasts: {error}
                  </div>
                </div>
              )}

              {!loading && !error && (
                <>
                  <PodcastGrid genres={genres} />
                  <Pagination />
                </>
              )}
            </main>
          </PodcastProvider>
        } />
        
        <Route path="/show/:showId" element={<ShowDetail />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>

      <AudioPlayer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavouritesProvider>
        <AudioProvider>
          <Router>
            <AppContent />
          </Router>
        </AudioProvider>
      </FavouritesProvider>
    </ThemeProvider>
  );
}