import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useConfirm } from '../hooks/useConfirm';
import { uid } from '../utils/general';
import {
  PageHeader, SearchBar, Card, Badge, Button,
  Modal, ConfirmDialog, FormGroup, EmptyState,
} from '../components/UI';
import shared from '../styles/shared.module.css';
import styles from './Media.module.css';
import apiFetch from '../services/api';
import { peliculasPath,} from '../services/paths';

const EMPTY = {
  serial: '', titulo: '', sinopsis: '', url: '', portada: '',
  anioEstreno: new Date().getFullYear(),
  generoId: '', directorId: '', productoraId: '', tipoId: '',
};

export default function Media() {
  const { data, setData, toast } = useApp();
  const { confirmState, ask, resolve } = useConfirm();
  const [search, setSearch]   = useState('');
  const [view, setView]       = useState('table');
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const activeGeneros    = data.generos.filter(g  => g.estado  === 'Activo');
  const activeDirectores = data.directores.filter(d => d.estado === 'Activo');
  const activeProductoras= data.productoras.filter(p => p.estado === 'Activo');
  const getName = (arr, id, key = 'nombre') => arr.find(x => x.id === id)?.[key] ?? '—';

  const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }));
  const openCreate = () => { setForm({ ...EMPTY, serial: 'MED-' + uid() }); setModal('create'); };
  const openEdit   = row => { setForm({ ...row }); setModal('edit'); };
  const closeModal = () => setModal(null);

  const save = async () => {
    if (!form.titulo.trim() || !form.url.trim()) return;
    setSaving(true);
    try {
      if (modal === 'create') {
        const nuevo = await apiFetch('POST', peliculasPath, form);
        setData(p => ({ ...p, medias: [...p.medias, nuevo] }));
        toast('Producción agregada exitosamente');
      } else {
        const actualizado = await apiFetch('PUT', `${peliculasPath}/${form.id}`, form);
        setData(p => ({ ...p, medias: p.medias.map(m => m.id === form.id ? actualizado : m) }));
        toast('Producción actualizada');
      }
      closeModal();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await apiFetch('DELETE', `${peliculasPath}/${id}`);
      setData(p => ({ ...p, medias: p.medias.filter(m => m.id !== id) }));
      toast('Producción eliminada', 'error');
    } catch (err) { toast(err.message, 'error'); }
  };

  const filtered = data.medias.filter(m =>
    m.titulo.toLowerCase().includes(search.toLowerCase()) ||
    m.serial.toLowerCase().includes(search.toLowerCase())
  );

  const FormFields = () => (
    <div className={shared.formGrid}>
      <div className={shared.formGrid2}>
        <FormGroup label="Serial (único)" required>
          <input className={shared.control} value={form.serial} onChange={set('serial')} />
        </FormGroup>
        <FormGroup label="Año de estreno">
          <input type="number" className={shared.control} value={form.anioEstreno} onChange={set('anioEstreno')} min="1888" max="2100" />
        </FormGroup>
      </div>
      <FormGroup label="Título" required>
        <input className={shared.control} value={form.titulo} onChange={set('titulo')} placeholder="Título de la producción" />
      </FormGroup>
      <FormGroup label="Sinopsis">
        <textarea className={shared.control} value={form.sinopsis} onChange={set('sinopsis')} placeholder="Breve descripción argumental…" />
      </FormGroup>
      <FormGroup label="URL de la película (único)" required>
        <input className={shared.control} value={form.url} onChange={set('url')} placeholder="https://stream.iudigital.edu.co/…" />
      </FormGroup>
      <FormGroup label="URL imagen de portada">
        <input className={shared.control} value={form.portada} onChange={set('portada')} placeholder="https://…/portada.jpg" />
      </FormGroup>
      <div className={shared.formGrid2}>
        <FormGroup label="Género (solo activos)">
          <select className={shared.control} value={form.generoId} onChange={set('generoId')}>
            <option value="">— Seleccionar —</option>
            {activeGeneros.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Director (solo activos)">
          <select className={shared.control} value={form.directorId} onChange={set('directorId')}>
            <option value="">— Seleccionar —</option>
            {activeDirectores.map(d => <option key={d.id} value={d.id}>{d.nombres}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Productora (solo activas)">
          <select className={shared.control} value={form.productoraId} onChange={set('productoraId')}>
            <option value="">— Seleccionar —</option>
            {activeProductoras.map(pr => <option key={pr.id} value={pr.id}>{pr.nombre}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Tipo">
          <select className={shared.control} value={form.tipoId} onChange={set('tipoId')}>
            <option value="">— Seleccionar —</option>
            {data.tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </FormGroup>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="MEDIA" subtitle="Gestiona películas, series y más"
        action={<Button onClick={openCreate}>+ Nueva producción</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por título o serial…">
        <div className={styles.viewToggle}>
          <button className={view === 'table' ? styles.active : ''} onClick={() => setView('table')}>☰ Tabla</button>
          <button className={view === 'grid'  ? styles.active : ''} onClick={() => setView('grid')}>⊞ Grilla</button>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{filtered.length} resultado(s)</span>
      </SearchBar>

      {view === 'table' && (
        <Card>
          <div className={shared.tableWrap}>
            <table>
              <thead><tr>
                <th>Serial</th><th>Título</th><th>Género</th><th>Director</th>
                <th>Productora</th><th>Tipo</th><th>Año</th><th>URL</th><th>Acciones</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9}><EmptyState icon="🎞" title="Sin producciones" subtitle="Agrega la primera película o serie" /></td></tr>
                ) : filtered.map(m => (
                  <tr key={m.id}>
                    <td><Badge variant="serial">{m.serial}</Badge></td>
                    <td className={shared.bold}>{m.titulo}</td>
                    <td><Badge variant="genre">{getName(data.generos, m.generoId)}</Badge></td>
                    <td className={shared.muted}>{getName(data.directores, m.directorId, 'nombres')}</td>
                    <td className={shared.muted}>{getName(data.productoras, m.productoraId)}</td>
                    <td>{getName(data.tipos, m.tipoId)}</td>
                    <td>{m.anioEstreno}</td>
                    <td><span className={shared.urlText} title={m.url}>{m.url || '—'}</span></td>
                    <td><div className={shared.tdActions}>
                      <Button variant="secondary" size="sm" onClick={() => openEdit(m)}>✏️</Button>
                      <Button variant="danger" size="sm" onClick={() => ask(m.id, `Se eliminará "${m.titulo}".`)}>🗑️</Button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === 'grid' && (
        filtered.length === 0
          ? <EmptyState icon="🎞" title="Sin producciones" subtitle="Agrega la primera película o serie" />
          : <div className={styles.mediaGrid}>
              {filtered.map(m => (
                <div className={styles.mediaCard} key={m.id}>
                  <div className={styles.mediaPoster}>
                    {m.portada ? <img src={m.portada} alt={m.titulo} onError={e => { e.target.style.display = 'none'; }} /> : <span>🎬</span>}
                    <div className={styles.mediaOverlay}><Badge variant="serial">{m.serial}</Badge></div>
                  </div>
                  <div className={styles.mediaBody}>
                    <h4 className={styles.mediaTitle}>{m.titulo}</h4>
                    <div className={styles.mediaMeta}>
                      <span>{m.anioEstreno}</span>
                      <Badge variant="genre">{getName(data.generos, m.generoId)}</Badge>
                      <Badge variant="type">{getName(data.tipos, m.tipoId)}</Badge>
                    </div>
                    {m.sinopsis && <p className={styles.mediaSynopsis}>{m.sinopsis}</p>}
                  </div>
                  <div className={styles.mediaFooter}>
                    <Button variant="secondary" size="sm" style={{ flex: 1 }} onClick={() => openEdit(m)}>✏️ Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => ask(m.id, `Se eliminará "${m.titulo}".`)}>🗑️</Button>
                  </div>
                </div>
              ))}
            </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'NUEVA PRODUCCIÓN' : 'EDITAR PRODUCCIÓN'}
          size="lg" onClose={closeModal}
          footer={<>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
          </>}>
          <FormFields />
        </Modal>
      )}
      {confirmState.open && (
        <ConfirmDialog message={confirmState.message}
          onConfirm={() => resolve(true, remove)} onCancel={() => resolve(false)} />
      )}
    </div>
  );
}
