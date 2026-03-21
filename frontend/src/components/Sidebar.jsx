import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const NAV = [
  { to: '/',            icon: '⬡', label: 'Dashboard'   },
  { to: '/generos',     icon: '🎭', label: 'Géneros'     },
  { to: '/directores',  icon: '🎬', label: 'Directores'  },
  { to: '/productoras', icon: '🏢', label: 'Productoras' },
  { to: '/tipos',       icon: '📽', label: 'Tipos'       },
  { to: '/media',       icon: '🎞', label: 'Media'       },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>CINE<br />ADMIN</h1>
        <span>IU Digital de Antioquia</span>
      </div>

      <nav className={styles.nav}>
        <p className={styles.sectionLabel}>Módulos</p>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <footer className={styles.footer}>
        Ingeniería Web II &copy; 2025
      </footer>
    </aside>
  );
}
