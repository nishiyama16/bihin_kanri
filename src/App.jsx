import { Routes, Route } from 'react-router-dom';
import ItemPage from './pages/item';
import ItemListPage from './pages/ItemListPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ItemListPage />} />
      <Route path="/item" element={<ItemPage />} />
    </Routes>
  );
}

export default App;
