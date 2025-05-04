import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemPage from './pages/item'; // そのままでOK（変更不要）
import ItemListPage from './pages/ItemListPage'; // ← これを追加

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/item" element={<ItemPage />} />
        <Route path="/" element={<ItemListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
