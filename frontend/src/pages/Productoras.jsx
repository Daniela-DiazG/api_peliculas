import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useConfirm } from '../hooks/useConfirm';
import {
  PageHeader, SearchBar, Card, Badge, Button,
  Modal, ConfirmDialog, FormGroup, EmptyState,
} from '../components/UI';
import shared from '../styles/shared.module.css';
import apiFetch from '../services/api';
import { productorasPath,} from '../services/paths';

const EMPTY = { nombre: '', estado: 'Activo', slogan: '', descripcion: '' };

export default function Productoras() {
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
        const nuevo = await apiFetch('POST', productorasPath, form);
        setData(p => ({ ...p, productoras: [...p.productoras, nuevo] }));
        toast('Productora creada exitosamente');
      } else {
        const actualizado = await apiFetch('PUT', `${productorasPath}/${form.id}`, form);
        setData(p => ({ ...p, productoras: p.productoras.map(pr => pr.id === form.id ? actualizado : pr) }));
        toast('Productora actualizada');
      }
      closeModal();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await apiFetch('DELETE', `${productorasPath}/${id}`);
      setData(p => ({ ...p, productoras: p.productoras.filter(pr => pr.id !== id) }));
      toast('Productora eliminada', 'error');
    } catch (err) { toast(err.message, 'error'); }
  };

  const filtered = data.productoras.filter(pr =>
    pr.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="PRODUCTORAS" subtitle="Administra las casas productoras"
        action={<Button onClick={openCreate}>+ Nueva productora</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Buscar productora…">
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{filtered.length} resultado(s)</span>
      </SearchBar>
      <Card>
        <div className={shared.tableWrap}>
          <table>
            <thead><tr>
              <th>Nombre</th><th>Slogan</th><th>Estado</th><th>Descripción</th>
              <th>Fecha creación</th><th>Fecha actualización</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon="🏢" title="Sin productoras" subtitle="Agrega la primera productora" /></td></tr>
              ) : filtered.map(pr => (
                <tr key={pr.id}>
                  <td className={shared.bold}>{pr.nombre}</td>
                  <td className={`${shared.muted} ${shared.italic}`} style={{ fontSize: 13 }}>{pr.slogan || '—'}</td>
                  <td><Badge variant={pr.estado === 'Activo' ? 'active' : 'inactive'}>{pr.estado}</Badge></td>
                  <td className={shared.muted} style={{ maxWidth: 200 }}>{pr.descripcion || '—'}</td>
                  <td><span className={shared.dateText}>{pr.fechaCreacion}</span></td>
                  <td><span className={shared.dateText}>{pr.fechaActualizacion}</span></td>
                  <td><div className={shared.tdActions}>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(pr)}>✏️</Button>
                    <Button variant="danger" size="sm" onClick={() => ask(pr.id, `Se eliminará "${pr.nombre}".`)}>🗑️</Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal && (
        <Modal title={modal === 'create' ? 'NUEVA PRODUCTORA' : 'EDITAR PRODUCTORA'} onClose={closeModal}
          footer={<>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
          </>}>
          <div className={shared.formGrid}>
            <div className={shared.formGrid2}>
              <FormGroup label="Nombre" required>
                <input className={shared.control} value={form.nombre} onChange={set('nombre')} placeholder="ej. Universal" />
              </FormGroup>
              <FormGroup label="Estado">
                <select className={shared.control} value={form.estado} onChange={set('estado')}>
                  <option>Activo</option><option>Inactivo</option>
                </select>
              </FormGroup>
            </div>
            <FormGroup label="Slogan">
              <input className={shared.control} value={form.slogan} onChange={set('slogan')} placeholder="Frase representativa…" />
            </FormGroup>
            <FormGroup label="Descripción">
              <textarea className={shared.control} value={form.descripcion} onChange={set('descripcion')} placeholder="Historia de la productora…" />
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
