import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import apiFetch from '../services/api';
import {directoresPath, generosPath,productorasPath, tiposPath,peliculasPath} from '../services/paths';

const AppContext = createContext(null);

const EMPTY_DATA = {
  generos:     [],
  directores:  [],
  productoras: [],
  tipos:       [],
  medias:      [],
};

export function AppProvider({ children }) {
  const [data,    setData]    = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [toasts,  setToasts]  = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [generos, directores, productoras, tipos, medias] = await Promise.all([
          apiFetch('GET', generosPath),
          apiFetch('GET', directoresPath),
          apiFetch('GET', productorasPath),
          apiFetch('GET', tiposPath),
          apiFetch('GET', peliculasPath),
        ]);
        
        setData({
          generos:     generos     ?? [],
          directores:  directores  ?? [],
          productoras: productoras ?? [],
          tipos:       tipos       ?? [],
          medias:      medias      ?? [],
        });
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000');
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  return (
    <AppContext.Provider value={{ data, setData, loading, error, toasts, toast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
