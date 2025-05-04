import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import './App.css';

function App() {
  const [assets, setAssets] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 昇順 or 降順を切り替える
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]); // カテゴリ一覧
  const [sortKey, setSortKey] = useState('category'); // 初期はカテゴリで並び替え


  useEffect(() => {
    const fetchAssets = async () => {
    const { data, error } = await supabase
    .from('01assets')
    .select(`
    id,
    serial_number,
    category,
    ownership,
    lent_to_name,
    purchase_date,
    model:02model (
      manual_url,
      model
    )`)
     console.log("データ確認:", data);
      if (error) {
        console.error('取得エラー:', error);
      } else {
        console.log('取得データ:', data);
        setAssets(data);
      }
    };
    fetchAssets();
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('01assets')
        .select('category');
  
      if (error) {
        console.error('カテゴリ取得エラー:', error);
      } else {
        // nullを除いて重複もなくす
        const unique = [...new Set(data.map(item => item.category).filter(Boolean))];
        setCategories(unique);
      }
    };
    fetchCategories(); // カテゴリも実行
  

  }, []);

    const sortedAssets = [...assets].sort((a, b) => {
    const aValue = sortKey === 'model' ? a.model?.model : a[sortKey];
    const bValue = sortKey === 'model' ? b.model?.model : b[sortKey];
      
     if (sortOrder === 'asc') {
      return aValue?.localeCompare(bValue);
     } else {
      return bValue?.localeCompare(aValue);
     }
    });
  
  return (
    
    <div>
      <h1>備品一覧</h1>

      <div>
         <label>カテゴリで絞り込み：</label>
         <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
         <option value="">すべて表示</option>
          {categories.map((cat, index) => (
         <option key={index} value={cat}>{cat}</option>
         ))}
         </select>
     </div>

      {assets.length === 0 ? (
        <p>データがありません。</p>
      ) : (
        <table>
          <thead>
              <tr>
              <th onClick={() => {setSortKey('category');setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');}}>
              カテゴリ {sortKey === 'category' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => {if (sortKey === 'model')
               {setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
               } else {
               setSortKey('model');setSortOrder('asc');}}}>
              型式 {sortKey === 'model' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => { setSortKey('serial_number'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');}}>
              シリアルNo {sortKey === 'serial_number' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => {setSortKey('purchase_date');  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');}}>
              購入日 {sortKey === 'purchase_date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => {setSortKey('ownership');setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');}}>
              所有会社 {sortKey === 'ownership' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>貸与先</th>
              <th>取説</th>
            </tr>
          </thead>
          <tbody>
         
          {sortedAssets
             .filter(item => filterCategory === '' || item.category === filterCategory).map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{item.model?.model}</td>
                <td>{item.serial_number}</td>
                <td>{item.purchase_date}</td>
                <td>{item.ownership}</td>
                <td>{item.lent_to_name}</td>
                <td>
                     {item.model?.manual_url ? (
                        <a href={item.model.manual_url} target="_blank" rel="noopener noreferrer">🔗</a>
                         ) : ("-"
                         )}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
