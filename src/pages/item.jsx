import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ItemPage() {
  const [searchParams] = useSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = searchParams.get('id');

  useEffect(() => {
    const fetchItem = async () => {
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
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('取得エラー:', error);
      } else {
        console.log('取得データ:', data);
        setItem(data);
      }

      setLoading(false);
    };

    fetchItem();
  }, [id]);

  if (loading) return <p>読み込み中...</p>;
  if (!item) return <p>データが見つかりません</p>;

  return (
    <div>
      <h2>資産情報</h2>
      <p>ID: {item.id}</p>
      <p>カテゴリ: {item.category}</p>
      <p>貸与先: {item.lent_to_name}</p>

      <p>
        マニュアルURL:{' '}
        {item.model2?.manual_url ? (
          <a
            href={item.model2.manual_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            開く
          </a>
        ) : (
          <span>（なし）</span>
        )}
      </p>

      <p>
        QRコード:{' '}
        {item.qr_url ? (
          <img
            src={item.qr_url}
            alt="QRコード"
            style={{ width: '150px', height: '150px' }}
          />
        ) : (
          <span>（未登録）</span>
        )}
      </p>
    </div>
  );
}
