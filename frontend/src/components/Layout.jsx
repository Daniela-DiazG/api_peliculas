import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from './UI';
import { useApp } from '../context/AppContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { toasts, loading, error } = useApp();

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>

        {/* Cargando datos del backend */}
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Conectando con el servidor…</p>
          </div>
        )}

        {/* Error de conexión */}
        {!loading && error && (
          <div className={styles.errorState}>
            <span>⚠️</span>
            <div>
              <strong>Error de conexión</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Contenido normal */}
        {!loading && !error && <Outlet />}

      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
