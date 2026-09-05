import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
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
            プライバシーポリシー
          </h1>
      <p style={{ marginBottom: '1rem' }}>
        PoliStep運営事務局（以下、「当事務局」といいます。）は、本ウェブサイト上で提供するサービス「PoliStep」（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第1条（個人情報）</h2>
      <p style={{ marginBottom: '1rem' }}>「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報、及び特定の個人を識別できる情報（個人識別符号）を指します。</p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第2条（個人情報の収集方法）</h2>
      <p style={{ marginBottom: '1rem' }}>当事務局は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレスなどの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当事務局の提携先などから収集することがあります。</p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第3条（個人情報を収集・利用する目的）</h2>
      <p style={{ marginBottom: '1rem' }}>当事務局が個人情報を収集・利用する目的は、以下のとおりです。</p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc' }}>
        <li style={{ marginBottom: '0.5rem' }}>当事務局サービスの提供・運営のため</li>
        <li style={{ marginBottom: '0.5rem' }}>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
        <li style={{ marginBottom: '0.5rem' }}>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当事務局が提供する他のサービスの案内のメールを送付するため</li>
        <li style={{ marginBottom: '0.5rem' }}>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
        <li style={{ marginBottom: '0.5rem' }}>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
        <li style={{ marginBottom: '0.5rem' }}>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第4条（利用目的の変更）</h2>
      <p style={{ marginBottom: '1rem' }}>当事務局は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について、当事務局所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。</p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第5条（個人情報の第三者提供）</h2>
      <p style={{ marginBottom: '1rem' }}>当事務局は、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。</p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', borderLeft: '4px solid #3b82f6', paddingLeft: '0.5rem' }}>第6条（お問い合わせ窓口）</h2>
      <p style={{ marginBottom: '1rem' }}>本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。</p>
      <p style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '4px' }}>
        運営：PoliStep運営事務局<br />
        Eメールアドレス：poliside.info@gmail.com
      </p>

      <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#64748b' }}>
        <p>改定日：2026年9月5日</p>
        <p>PoliStep運営事務局</p>
      </div>
        </div>
      </div>
    </div>
  );
}
