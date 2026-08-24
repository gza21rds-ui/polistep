import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, ArrowRight, UserPlus, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useNoIndex from '../hooks/useNoIndex';

export default function Onboarding() {
  useNoIndex();
  const navigate = useNavigate();
  const [electionDate, setElectionDate] = useState('');
  const [targetVotes, setTargetVotes] = useState('');
  const [targetVisits, setTargetVisits] = useState('');
  const [targetFlyers, setTargetFlyers] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('users')
          .select('election_date, target_votes, target_visits, target_flyers')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              if (data.election_date) setElectionDate(data.election_date);
              if (data.target_votes) setTargetVotes(data.target_votes.toString());
              if (data.target_visits) setTargetVisits(data.target_visits.toString());
              if (data.target_flyers) setTargetFlyers(data.target_flyers.toString());
            }
            setInitialLoading(false);
          });
      } else {
        setInitialLoading(false);
      }
    });
  }, []);

  const handleVotesChange = (e) => {
    const votes = e.target.value;
    setTargetVotes(votes);
    
    // Auto-calculate recommendations
    if (votes && !isNaN(votes)) {
      const v = parseInt(votes, 10);
      setTargetVisits((v * 4).toString()); // 4倍
      setTargetFlyers((v * 15).toString()); // 15倍
    } else {
      setTargetVisits('');
      setTargetFlyers('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!electionDate || !targetVotes || !targetVisits || !targetFlyers) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not logged in');

      const { error } = await supabase
        .from('users')
        .update({
          election_date: electionDate,
          target_votes: parseInt(targetVotes, 10),
          target_visits: parseInt(targetVisits, 10),
          target_flyers: parseInt(targetFlyers, 10)
        })
        .eq('id', session.user.id);

      if (error) throw error;
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('保存に失敗しました。ネットワークを確認して再試行してください。');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>読み込み中...</div>;
  }

  return (
    <div className="auth-page-container" style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)' }}>
      <div className="auth-form-side" style={{ width: '100%', maxWidth: '700px', flex: 'none', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '3rem', background: 'white', animation: 'fadeInUp 0.5s ease-out' }}>
        <div className="auth-form-wrapper" style={{ padding: 0 }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: '50%', display: 'inline-flex' }}>
              <Target size={40} color="#2563EB" />
            </div>
          </div>
          
          <h2 className="auth-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>活動目標の設定 🎯</h2>
          <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '1rem' }}>
            PoliStepへようこそ！まずは日々の政治活動における必須目標を設定しましょう。
          </p>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'shake 0.4s ease-in-out' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. 期日 */}
            <div style={{ animation: 'popIn 0.3s ease-out', animationDelay: '0.1s', animationFillMode: 'both' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E293B', fontSize: '1.1rem' }}>
                <Calendar size={20} color="#0369A1" /> 決戦（目標）予定日 🗓️
              </label>
              <input 
                type="date" 
                className="input-premium" 
                value={electionDate}
                onChange={(e) => setElectionDate(e.target.value)}
                required 
              />
            </div>

            {/* 2. 目標支持者数 */}
            <div style={{ background: '#F0F9FF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #BAE6FD', animation: 'popIn 0.3s ease-out', animationDelay: '0.2s', animationFillMode: 'both' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#0369A1', fontSize: '1.1rem' }}>
                <CheckCircle2 size={20} /> 目標とする「支持者獲得数」 🗳️
              </label>
              <p style={{ fontSize: '0.85rem', color: '#0C4A6E', marginBottom: '1rem', lineHeight: 1.5 }}>
                活動の成果を出すために必要な獲得数を入力してください。この数値をベースに、必要な活動件数を自動計算します。
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="number" 
                  placeholder="例: 2000" 
                  className="input-premium" 
                  style={{ flex: 1, borderColor: '#BAE6FD', fontSize: '1.25rem', fontWeight: 'bold' }}
                  value={targetVotes}
                  onChange={handleVotesChange}
                  required 
                />
                <span style={{ fontWeight: 'bold', color: '#0C4A6E', fontSize: '1.25rem' }}>票</span>
              </div>
            </div>

            {/* 3. 個別目標 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 0.5rem', animation: 'popIn 0.3s ease-out', animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E293B' }}>
                  <UserPlus size={18} color="#2563EB" /> 個別訪問・ご挨拶の目標件数 🤝
                </label>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>※セオリー：目標支持者数の <strong>3〜5倍</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    className="input-premium" 
                    style={{ flex: 1 }}
                    value={targetVisits}
                    onChange={(e) => setTargetVisits(e.target.value)}
                    required 
                  />
                  <span style={{ fontWeight: 'bold', color: '#475569' }}>件</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E293B' }}>
                  <FileText size={18} color="#F59E0B" /> ビラ・チラシ配布の目標枚数 📄
                </label>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>※セオリー：目標支持者数の <strong>10〜20倍</strong>（対話より反応率が低いため多めに設定）</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    className="input-premium" 
                    style={{ flex: 1 }}
                    value={targetFlyers}
                    onChange={(e) => setTargetFlyers(e.target.value)}
                    required 
                  />
                  <span style={{ fontWeight: 'bold', color: '#475569' }}>枚</span>
                </div>
              </div>
            </div>
            
            <button type="submit" className="btn-premium tap-scale" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1.25rem', fontSize: '1.15rem', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(37,99,235,0.4)', animation: 'popIn 0.3s ease-out', animationDelay: '0.4s', animationFillMode: 'both' }} disabled={loading}>
              {loading ? '保存中...' : '目標を設定して始める'} <ArrowRight size={22} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
