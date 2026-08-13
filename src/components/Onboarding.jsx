import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
  const navigate = useNavigate();
  const [electionDate, setElectionDate] = useState('');
  const [targetActions, setTargetActions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!electionDate || !targetActions) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not logged in');

      const { error } = await supabase
        .from('users')
        .update({
          election_date: electionDate,
          target_actions: parseInt(targetActions, 10)
        })
        .eq('id', session.user.id);

      if (error) throw error;
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ justifyContent: 'center' }}>
      <div className="auth-form-side" style={{ width: '100%', maxWidth: '600px', flex: 'none', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div className="auth-form-wrapper">
          <h2 className="auth-title">活動目標の設定</h2>
          <p className="auth-subtitle">
            PoliStepへようこそ！まずは選挙や政治活動の目標を設定しましょう。
          </p>

          <div style={{ background: '#F0F9FF', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid #BAE6FD' }}>
            <h4 style={{ color: '#0369A1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <Target size={18} /> 目標設定のヒント
            </h4>
            <p style={{ color: '#0C4A6E', fontSize: '0.9rem', lineHeight: 1.6 }}>
              一般的にドブ板政治活動において、訪問した家のうち実際に投票等の成果に結びつくのはごく一部です。<br/>
              そのため、<strong>目標票数の3〜5倍の接触（ご挨拶回り・ポスター等）が必要</strong>と言われています。<br/>
              例: 2000票目標なら、6000〜10000件の活動を目標にするのがセオリーです。
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E293B' }}>
                <Calendar size={18} /> 選挙・投票予定日
              </label>
              <input 
                type="date" 
                className="input-premium" 
                value={electionDate}
                onChange={(e) => setElectionDate(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E293B' }}>
                <Target size={18} /> 目標とする活動総件数（訪問やご挨拶の数）
              </label>
              <input 
                type="number" 
                placeholder="例: 10000" 
                className="input-premium" 
                value={targetActions}
                onChange={(e) => setTargetActions(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="btn-premium" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
              {loading ? '保存中...' : '目標を設定して始める'} <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
