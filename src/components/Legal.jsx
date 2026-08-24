import { ArrowLeft } from 'lucide-react';

export default function Legal() {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-outline" 
          style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.9rem', color: '#1E293B', background: 'white' }}
        >
          <ArrowLeft size={16} /> 戻る
        </button>

        <div style={{ background: 'white', padding: '3rem 2.5rem', borderRadius: '24px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', lineHeight: 1.8, color: '#334155' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', borderBottom: '2px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '2rem', letterSpacing: '-0.5px' }}>
            特定商取引法に基づく表記
          </h1>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <tbody>
              <tr>
                <th style={{ width: '32%', padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B', borderRadius: '8px 0 0 0' }}>販売事業者</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>PoliStep運営事務局</td>
              </tr>
              <tr>
                <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B' }}>お問い合わせ窓口</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>
                  Eメール：poliside.info@gmail.com<br />
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>（※電話でのお問い合わせは受け付けておりません。メールにてお問い合わせください。）</span>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B' }}>販売価格</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>
                  各サービスの購入ページにて表示する価格<br />
                  <strong style={{ color: '#2563EB' }}>※【2027年 統一地方選挙 応援キャンペーン】現在、通常有料（月額980円）の全機能を「完全0円」で提供しております。</strong>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B' }}>商品代金以外の必要料金</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>
                  インターネット接続料金その他の電気通信回線の通信に関する費用はお客様にてご負担ください。
                </td>
              </tr>
              <tr>
                <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B' }}>支払方法</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>クレジットカード決済、その他当事務局が定める決済方法</td>
              </tr>
              <tr>
                <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B' }}>支払時期</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>
                  各カード会社等の引き落とし日<br />
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>（※月額制サービスの場合、毎月指定日に課金されます）</span>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B' }}>サービスの提供時期</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>購入・登録手続き完了後、直ちにご利用いただけます。</td>
              </tr>
              <tr>
                <th style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', textAlign: 'left', fontWeight: 'bold', color: '#1E293B', borderRadius: '0 0 0 8px' }}>返品・キャンセルについて</th>
                <td style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #E2E8F0' }}>
                  提供するサービスの性質上、購入後のキャンセルや返金はお受けできません。<br />
                  退会（解約）を希望される場合は、所定の手続きによりいつでも退会可能です。解約手続きが完了した月の末日をもってサービスの提供を終了します。
                </td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', fontSize: '0.9rem', color: '#64748B' }}>
            <p>制定日：2026年8月23日</p>
            <p>PoliStep運営事務局</p>
          </div>
        </div>
      </div>
    </div>
  );
}
