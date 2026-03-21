import { useState, useCallback } from 'react';

export function useConfirm() {
  const [state, setState] = useState({ open: false, id: null, message: '' });

  const ask = useCallback((id, message = 'Esta acción no se puede deshacer.') => {
    setState({ open: true, id, message });
  }, []);

  const resolve = useCallback((confirmed, onConfirm) => {
    if (confirmed && state.id) onConfirm(state.id);
    setState({ open: false, id: null, message: '' });
  }, [state.id]);

  return { confirmState: state, ask, resolve };
}
