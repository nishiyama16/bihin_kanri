// src/pages/ItemListPage.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import QRCode from 'qrcode';

export default function ItemListPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('すべて');

  // データ取得
  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from('01assets')
        .select(`
          id,
          category,
          ownership,
          lent_to_name,
          qr_url,
          model2:model (
            manual_url,
            model
          )
        `);
      if (error) {
        console.error('取得エラー:', error);
      } else {
        setAssets(data);
      }
      setLoading(false);
    };

    fetchAssets();
  }, []);

  // QR作成処理
  const createQr = async (item) => {
    try {
      // URL作成
      const url = `${location.origin}/item?id=${item.id}`;
      const qrDataUrl = await QRCode.toDataURL(url);

      // 画像としてアップロード
      const fileName = `qr_${item.id}.png`;
      const blob = await (await fetch(qrDataUrl)).blob();

      const { error: uploadError } = await supabase.storage
        .from('qr')
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('qr').getPublicUrl(fileName);
      const publicUrl = publicUrlData.publicUrl;

      // DBに反映
      const { error: updateError } = await supabase
        .from('01assets')
        .update({ qr_url: publicUrl })
        .eq('id', item.id);

      if (updateError) throw updateError;

      alert('QR作成・登録完了✨');
    } catch (e) {
      console.error('QR作成エラー:', e);
      alert('QR作成失敗❌');
    }
  };

  if (loading) return <p>読み込み中...</p>;

  const categories = ['すべて', ...new Set(assets.map((item) => item.category))];
  const filteredAssets =
    filterCategory === 'すべて'
      ? assets
      : assets.filter((item) => item.category === filterCategory);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>備品一覧</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>カテゴリで絞り込み：</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>カテゴリ</th>
            <th>貸与先</th>
            <th>型式</th>
            <th>QR作成</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((item) => (
            <tr key={item.id}>
              <td>
                <a href={`/item?id=${item.id}`}>{item.id}</a>
              </td>
              <td>{item.category}</td>
              <td>{item.ownership}</td>
              <td>{item.model2?.model || '-'}</td>
              <td>
                <button onClick={() => createQr(item)}>作成</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
