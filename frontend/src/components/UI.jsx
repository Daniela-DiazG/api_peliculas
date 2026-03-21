import styles from './UI.module.css';

/* ── Badge ──────────────────────────────────────────────────────── */
export function Badge({ variant = 'default', children }) {
  return <span className={`${styles.badge} ${styles[`badge_${variant}`]}`}>{children}</span>;
}

/* ── Button ─────────────────────────────────────────────────────── */
export function Button({ variant = 'primary', size = 'md', children, ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${styles[`btn_${size}`]}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Toast Container ────────────────────────────────────────────── */
export function ToastContainer({ toasts }) {
  return (
    <div className={styles.toastContainer}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.type}`]}`}>
          <span className={styles.toastIcon}>{t.type === 'success' ? '✓' : '✕'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Confirm Dialog ─────────────────────────────────────────────── */
export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={`${styles.modal} ${styles.confirmModal}`} onClick={e => e.stopPropagation()}>
        <div className={styles.confirmBody}>
          <div className={styles.confirmIcon}>🗑️</div>
          <h4>¿Eliminar registro?</h4>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter} style={{ justifyContent: 'center' }}>
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────────── */
export function Modal({ title, size = 'md', onClose, children, footer }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${size === 'lg' ? styles.modalLg : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}

/* ── SearchBar ──────────────────────────────────────────────────── */
export function SearchBar({ value, onChange, placeholder = 'Buscar…', children }) {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {children}
    </div>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────── */
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h4>{title}</h4>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

/* ── PageHeader ─────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h2 className={styles.pageTitle}>{title}</h2>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────────── */
export function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

/* ── FormGroup ──────────────────────────────────────────────────── */
export function FormGroup({ label, children, required }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}{required && ' *'}</label>
      {children}
    </div>
  );
}
