import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
            利用規約
          </h1>
      <p style={{ marginBottom: '1rem' }}>
        この利用規約（以下、「本規約」といいます。）は、PoliStep運営事務局（以下、「当事務局」といいます。）が提供するサービス「PoliStep」（以下、「本サービス」といいます。）の利用条件を定めるものです。利用者の皆様（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第1条（適用）</h2>
      <p style={{ marginBottom: '1rem' }}>本規約は、ユーザーと当事務局との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第2条（利用登録・利用料金）</h2>
      <p style={{ marginBottom: '1rem' }}>1. 登録希望者が当事務局の定める方法によって利用登録を申請し、当事務局がこれを承認することによって、利用登録が完了するものとします。</p>
      <p style={{ marginBottom: '1rem' }}>2. 本サービスは原則として有料サービスですが、<strong style={{ color: '#ef4444' }}>現在「2027年 政治活動応援キャンペーン」により、特例として全機能を完全無料で提供</strong>しております。キャンペーン終了後の有料化等については、事前にユーザーに通知するものとします。</p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第3条（禁止事項）</h2>
      <p style={{ marginBottom: '1rem' }}>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc' }}>
        <li style={{ marginBottom: '0.5rem' }}>法令または公序良俗に違反する行為</li>
        <li style={{ marginBottom: '0.5rem' }}>犯罪行為に関連する行為</li>
        <li style={{ marginBottom: '0.5rem' }}>当事務局、本サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
        <li style={{ marginBottom: '0.5rem' }}>当事務局のサービスの運営を妨害するおそれのある行為</li>
        <li style={{ marginBottom: '0.5rem' }}>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
        <li style={{ marginBottom: '0.5rem' }}>その他、当事務局が不適切と判断する行為</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第4条（本サービスの提供の停止等）</h2>
      <p style={{ marginBottom: '1rem' }}>当事務局は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc' }}>
        <li style={{ marginBottom: '0.5rem' }}>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
        <li style={{ marginBottom: '0.5rem' }}>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
        <li style={{ marginBottom: '0.5rem' }}>コンピュータまたは通信回線等が事故により停止した場合</li>
        <li style={{ marginBottom: '0.5rem' }}>その他、当事務局が本サービスの提供が困難と判断した場合</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第5条（免責事項）</h2>
      <p style={{ marginBottom: '1rem' }}>当事務局は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第6条（利用規約の変更）</h2>
      <p style={{ marginBottom: '1rem' }}>当事務局は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>

      <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#64748b' }}>
        <p>制定日：2026年8月1日</p>
        <p>PoliStep運営事務局</p>
      </div>
        </div>
      </div>
    </div>
  );
}
