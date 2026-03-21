import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useConfirm } from '../hooks/useConfirm';
import {
  PageHeader, Card, Badge, Button,
  Modal, ConfirmDialog, FormGroup, EmptyState,
} from '../components/UI';
import shared from '../styles/shared.module.css';
import apiFetch from '../services/api';
import { tiposPath,} from '../services/paths';

const EMPTY = { nombre: '', descripcion: '' };

export default function Tipos() {
  const { data, setData, toast } = useApp();
  const { confirmState, ask, resolve } = useConfirm();
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
        const nuevo = await apiFetch('POST', tiposPath, form);
        setData(p => ({ ...p, tipos: [...p.tipos, nuevo] }));
        toast('Tipo creado exitosamente');
      } else {
        const actualizado = await apiFetch('PUT', `${tiposPath}/${form.id}`, form);
        setData(p => ({ ...p, tipos: p.tipos.map(t => t.id === form.id ? actualizado : t) }));
        toast('Tipo actualizado');
      }
      closeModal();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await apiFetch('DELETE', `${tiposPath}/${id}`);
      setData(p => ({ ...p, tipos: p.tipos.filter(t => t.id !== id) }));
      toast('Tipo eliminado', 'error');
    } catch (err) { toast(err.message, 'error'); }
  };

  return (
    <div>
      <PageHeader title="TIPOS" subtitle="Administra los tipos de contenido multimedia"
        action={<Button onClick={openCreate}>+ Nuevo tipo</Button>} />
      <Card>
        <div className={shared.tableWrap}>
          <table>
            <thead><tr>
              <th>Nombre</th><th>Descripción</th><th>Fecha creación</th><th>Fecha actualización</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              {data.tipos.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon="📽" title="Sin tipos" subtitle="Agrega el primer tipo" /></td></tr>
              ) : data.tipos.map(t => (
                <tr key={t.id}>
                  <td><Badge variant="type">{t.nombre}</Badge></td>
                  <td className={shared.muted}>{t.descripcion || '—'}</td>
                  <td><span className={shared.dateText}>{t.fechaCreacion}</span></td>
                  <td><span className={shared.dateText}>{t.fechaActualizacion}</span></td>
                  <td><div className={shared.tdActions}>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(t)}>✏️</Button>
                    <Button variant="danger" size="sm" onClick={() => ask(t.id, `Se eliminará el tipo "${t.nombre}".`)}>🗑️</Button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal && (
        <Modal title={modal === 'create' ? 'NUEVO TIPO' : 'EDITAR TIPO'} onClose={closeModal}
          footer={<>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button>
          </>}>
          <div className={shared.formGrid}>
            <FormGroup label="Nombre" required>
              <input className={shared.control} value={form.nombre} onChange={set('nombre')} placeholder="ej. Documental" />
            </FormGroup>
            <FormGroup label="Descripción">
              <textarea className={shared.control} value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción del tipo…" />
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
