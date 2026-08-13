import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Legal() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        ← 戻る
      </button>

      <h1 style={{ fontSize: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>特定商取引法に基づく表記</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <tbody>
          <tr>
            <th style={{ width: '30%', padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>販売事業者</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>PoliStep運営事務局</td>
          </tr>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>お問い合わせ窓口</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              Eメール：poliside.info@gmail.com<br />
              （※電話でのお問い合わせは受け付けておりません。メールにてお問い合わせください。）
            </td>
          </tr>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>販売価格</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              各サービスの購入ページにて表示する価格<br />
              <strong style={{ color: '#ef4444' }}>※【2027年統一地方選挙 応援キャンペーン】現在、通常有料の全機能を「完全無料」で提供しております。</strong>
            </td>
          </tr>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>商品代金以外の必要料金</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              インターネット接続料金その他の電気通信回線の通信に関する費用はお客様にてご負担ください。
            </td>
          </tr>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>支払方法</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>クレジットカード決済、その他当事務局が定める決済方法</td>
          </tr>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>支払時期</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              各カード会社等の引き落とし日<br />
              （※月額制サービスの場合、毎月指定日に課金されます）
            </td>
          </tr>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>サービスの提供時期</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>購入・登録手続き完了後、直ちにご利用いただけます。</td>
          </tr>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', fontWeight: 'bold' }}>返品・キャンセルについて</th>
            <td style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              提供するサービスの性質上、購入後のキャンセルや返金はお受けできません。<br />
              退会（解約）を希望される場合は、所定の手続きによりいつでも退会可能です。解約手続きが完了した月の末日をもってサービスの提供を終了します。
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#64748b' }}>
        <p>制定日：2026年8月1日</p>
        <p>PoliStep運営事務局</p>
      </div>
    </div>
  );
}
