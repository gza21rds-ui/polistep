import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
  const navigate = useNavigate();
  const [electionDate, setElectionDate] = useState('');
  const [targetActions, setTargetActions] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('users').select('election_date, target_actions').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) {
              if (data.election_date) setElectionDate(data.election_date);
              if (data.target_actions) setTargetActions(data.target_actions.toString());
            }
            setInitialLoading(false);
          });
      } else {
        setInitialLoading(false);
      }
    });
  }, []);

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

  if (initialLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;
  }

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
              <Target size={18} /> 目標設定の目安
            </h4>
            <p style={{ color: '#0C4A6E', fontSize: '0.9rem', lineHeight: 1.6 }}>
              政治活動において、訪問した家のうち実際に投票に結びつくのは一部です。<br/>
              そのため、<strong>【当選に必要な目標票数】の「3〜5倍」の活動件数</strong>を目標にするのが標準的なセオリーです。<br/>
              <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#E0F2FE', borderRadius: '8px', color: '#0369A1', fontWeight: 'bold' }}>
                💡 例：2,000票目標なら、6,000〜10,000件の活動を目標に設定しましょう。
              </span>
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
