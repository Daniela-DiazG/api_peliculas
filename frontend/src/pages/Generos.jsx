import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useConfirm } from '../hooks/useConfirm';
import {
  PageHeader, SearchBar, Card, Badge, Button,
  Modal, ConfirmDialog, FormGroup, EmptyState,
} from '../components/UI';
import shared from '../styles/shared.module.css';
import apiFetch from '../services/api';
import { generosPath,} from '../services/paths';


const EMPTY = { nombre: '', estado: 'Activo', descripcion: '' };

export default function Generos() {
  const { data, setData, toast } = useApp();
  const { confirmState, ask, resolve } = useConfirm();
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }));
  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = row => { setForm({ ...row }); setModal('edit'); };
  const closeModal = () => setModal(null);

  const save = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      if (modal === 'create') {
        const nuevo = await apiFetch('POST', generosPath, form);
        setData(p => ({ ...p, generos: [...p.generos, nuevo] }));
        toast('Género creado exitosamente');
      } else {
        const actualizado = await apiFetch('PUT', `${generosPath}/${form.id}`, form);
        setData(p => ({ ...p, generos: p.generos.map(g => g.id === form.id ? actualizado : g) }));
        toast('Género actualizado');
      }
      closeModal();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await apiFetch('DELETE', `${generosPath}/${id}`);
      setData(p => ({ ...p, generos: p.generos.filter(g => g.id !== id) }));
      toast('Género eliminado', 'error');
    } catch (err) { toast(err.message, 'error'); }
  };

  const filtered = data.generos.filter(g =>
    g.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="GÉNEROS" subtitle="Administra los géneros cinematográficos"
        action={<Button onClick={openCreate}>+ Nuevo género</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar género…">
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{filtered.length} resultado(s)</span>
      </SearchBar>
      <Card>
        <div className={shared.tableWrap}>
          <table>
            <thead><tr>
              <th>Nombre</th><th>Estado</th><th>Descripción</th>
              <th>Fecha creación</th><th>Fecha actualización</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="🎭" title="Sin géneros" subtitle="Agrega el primer género" /></td></tr>
              ) : filtered.map(g => (
                <tr key={g.id}>
                  <td className={shared.bold}>{g.nombre}</td>
                  <td><Badge variant={g.estado === 'Activo' ? 'active' : 'inactive'}>{g.estado}</Badge></td>
                  <td className={shared.muted} style={{ maxWidth: 220 }}>{g.descripcion || '—'}</td>
                  <td><span className={shared.dateText}>{g.fechaCreacion}</span></td>
                  <td><span className={shared.dateText}>{g.fechaActualizacion}</span></td>
                  <td><div className={shared.tdActions}>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(g)}>✏️</Button>
                    <Button variant="danger" size="sm" onClick={() => ask(g.id, `Se eliminará "${g.nombre}".`)}>🗑️</Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal && (
        <Modal title={modal === 'create' ? 'NUEVO GÉNERO' : 'EDITAR GÉNERO'} onClose={closeModal}
          footer={<>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
          </>}>
          <div className={shared.formGrid}>
            <FormGroup label="Nombre" required>
              <input className={shared.control} value={form.nombre} onChange={set('nombre')} placeholder="ej. Comedia" />
            </FormGroup>
            <FormGroup label="Estado">
              <select className={shared.control} value={form.estado} onChange={set('estado')}>
                <option>Activo</option><option>Inactivo</option>
              </select>
            </FormGroup>
            <FormGroup label="Descripción">
              <textarea className={shared.control} value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción…" />
            </FormGroup>
          </div>
        </Modal>
      )}
      {confirmState.open && (
        <ConfirmDialog message={confirmState.message}
          onConfirm={() => resolve(true, remove)} onCancel={() => resolve(false)} />
      )}
    </div>
  );
}
