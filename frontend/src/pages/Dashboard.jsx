import { useApp } from '../context/AppContext';
import { Card } from '../components/UI';
import styles from './Dashboard.module.css';
import shared from '../styles/shared.module.css';

const STATS = [
  { key: 'generos',     label: 'Géneros',          icon: '🎭', color: '#e63946' },
  { key: 'directores',  label: 'Directores',        icon: '🎬', color: '#f4a261' },
  { key: 'productoras', label: 'Productoras',       icon: '🏢', color: '#2ec4b6' },
  { key: 'tipos',       label: 'Tipos',             icon: '📽', color: '#9b5de5' },
  { key: 'medias',      label: 'Películas / Series', icon: '🎞', color: '#00b4d8' },
];

function MiniBar({ value, total, color }) {
  const pct = total === 0 ? 0 : (value / total) * 100;
  return (
    <div className={styles.miniBarTrack}>
      <div className={styles.miniBarFill} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function Dashboard() {
  const { data } = useApp();

  const activeGeneros = data.generos.filter(g => g.estado === 'Activo').length;
  const activeDir     = data.directores.filter(d => d.estado === 'Activo').length;
  const activeProd    = data.productoras.filter(p => p.estado === 'Activo').length;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>DASHBOARD</h2>
        <p className={styles.subtitle}>Panel de control — IU Digital de Antioquia</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STATS.map(s => (
          <div key={s.key} className={styles.statCard} style={{ '--accent-color': s.color }}>
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{data[s.key].length}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Activity bars */}
      <div className={styles.barsGrid}>
        <Card>
          <div className={styles.barCard}>
            <h3>Géneros activos</h3>
            <MiniBar value={activeGeneros} total={data.generos.length} color="var(--success)" />
            <div className={styles.barLegend}>
              <span><span style={{ color: 'var(--success)' }}>●</span> Activos: {activeGeneros}</span>
              <span><span style={{ color: 'var(--muted)' }}>●</span> Inactivos: {data.generos.length - activeGeneros}</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.barCard}>
            <h3>Directores activos</h3>
            <MiniBar value={activeDir} total={data.directores.length} color="var(--accent2)" />
            <div className={styles.barLegend}>
              <span><span style={{ color: 'var(--accent2)' }}>●</span> Activos: {activeDir}</span>
              <span><span style={{ color: 'var(--muted)' }}>●</span> Inactivos: {data.directores.length - activeDir}</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.barCard}>
            <h3>Productoras activas</h3>
            <MiniBar value={activeProd} total={data.productoras.length} color="#9b5de5" />
            <div className={styles.barLegend}>
              <span><span style={{ color: '#9b5de5' }}>●</span> Activas: {activeProd}</span>
              <span><span style={{ color: 'var(--muted)' }}>●</span> Inactivas: {data.productoras.length - activeProd}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent media */}
      <Card>
        <div className={styles.tableHeader}><h3>Últimas producciones</h3></div>
        <div className={shared.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Serial</th>
                <th>Título</th>
                <th>Año</th>
                <th>Fecha creación</th>
              </tr>
            </thead>
            <tbody>
              {data.medias.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px' }}>Sin producciones aún</td></tr>
              ) : [...data.medias].reverse().slice(0, 6).map(m => (
                <tr key={m.id}>
                  <td><span className="badge" style={{ background: 'rgba(0,180,216,.12)', color: '#00b4d8', border: '1px solid rgba(0,180,216,.3)', padding: '3px 10px', borderRadius: 100, fontSize: 11 }}>{m.serial}</span></td>
                  <td className={shared.bold}>{m.titulo}</td>
                  <td>{m.anioEstreno}</td>
                  <td><span className={shared.dateText}>{m.fechaCreacion}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
