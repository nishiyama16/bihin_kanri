import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ItemPage from "./pages/item";
import ItemListPage from "./pages/ItemListPage";

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
