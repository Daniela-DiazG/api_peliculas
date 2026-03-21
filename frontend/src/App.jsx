import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout      from './components/Layout';
import Dashboard   from './pages/Dashboard';
import Generos     from './pages/Generos';
import Directores  from './pages/Directores';
import Productoras from './pages/Productoras';
import Tipos       from './pages/Tipos';
import Media       from './pages/Media';
import './styles/globals.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"            element={<Dashboard />}   />
            <Route path="/generos"     element={<Generos />}     />
            <Route path="/directores"  element={<Directores />}  />
            <Route path="/productoras" element={<Productoras />} />
            <Route path="/tipos"       element={<Tipos />}       />
            <Route path="/media"       element={<Media />}       />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
