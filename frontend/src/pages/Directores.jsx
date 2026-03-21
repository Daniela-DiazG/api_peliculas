import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useConfirm } from '../hooks/useConfirm';
import {
  PageHeader, SearchBar, Card, Badge, Button,
  Modal, ConfirmDialog, FormGroup, EmptyState,
} from '../components/UI';
import shared from '../styles/shared.module.css';
import apiFetch from '../services/api';
import { directoresPath} from '../services/paths';


const EMPTY = { nombres: '', estado: 'Activo' };

export default function Directores() {
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
    if (!form.nombres.trim()) return;
    setSaving(true);
    try {
      if (modal === 'create') {
        const nuevo = await apiFetch('POST', directoresPath, form);
        setData(p => ({ ...p, directores: [...p.directores, nuevo] }));
        toast('Director creado exitosamente');
      } else {
        const actualizado = await apiFetch('PUT', `${directoresPath}/${form.id}`, form);
        setData(p => ({ ...p, directores: p.directores.map(d => d.id === form.id ? actualizado : d) }));
        toast('Director actualizado');
      }
      closeModal();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await apiFetch('DELETE', `${directoresPath}/${id}`);
      setData(p => ({ ...p, directores: p.directores.filter(d => d.id !== id) }));
      toast('Director eliminado', 'error');
    } catch (err) { toast(err.message, 'error'); }
  };

  const filtered = data.directores.filter(d =>
    d.nombres.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="DIRECTORES" subtitle="Administra los directores de producción"
        action={<Button onClick={openCreate}>+ Nuevo director</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar director…">
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{filtered.length} resultado(s)</span>
      </SearchBar>
      <Card>
        <div className={shared.tableWrap}>
          <table>
            <thead><tr>
              <th>Nombres</th><th>Estado</th><th>Fecha creación</th><th>Fecha actualización</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon="🎬" title="Sin directores" subtitle="Agrega el primer director" /></td></tr>
              ) : filtered.map(d => (
                <tr key={d.id}>
                  <td className={shared.bold}>{d.nombres}</td>
                  <td><Badge variant={d.estado === 'Activo' ? 'active' : 'inactive'}>{d.estado}</Badge></td>
                  <td><span className={shared.dateText}>{d.fechaCreacion}</span></td>
                  <td><span className={shared.dateText}>{d.fechaActualizacion}</span></td>
                  <td><div className={shared.tdActions}>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(d)}>✏️</Button>
                    <Button variant="danger" size="sm" onClick={() => ask(d.id, `Se eliminará a "${d.nombres}".`)}>🗑️</Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal && (
        <Modal title={modal === 'create' ? 'NUEVO DIRECTOR' : 'EDITAR DIRECTOR'} onClose={closeModal}
          footer={<>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
          </>}>
          <div className={shared.formGrid}>
            <FormGroup label="Nombres completos" required>
              <input className={shared.control} value={form.nombres} onChange={set('nombres')} placeholder="ej. Guillermo del Toro" />
            </FormGroup>
            <FormGroup label="Estado">
              <select className={shared.control} value={form.estado} onChange={set('estado')}>
                <option>Activo</option><option>Inactivo</option>
              </select>
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
