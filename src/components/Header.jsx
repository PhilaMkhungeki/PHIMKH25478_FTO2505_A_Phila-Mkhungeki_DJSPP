import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>🎙️ Podcast App</h1>
        </div>
        
        <nav className={styles.navigation}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/favourites" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Favourites
          </NavLink>
        </nav>
        
        <div className={styles.controls}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
