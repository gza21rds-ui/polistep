import React, { useState, useRef, useEffect } from 'react';

export default function SnsShareGenerator({ visible, onClose, stats, statsToday = {}, user = {} }) {
  const [regionName, setRegionName] = useState('');
  const [copied, setCopied] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const canvasRef = useRef(null);
  
  console.log("SnsShareGenerator rendered, visible:", visible);

  const talkedTotal = stats?.talked || 0;
  const talkedToday = statsToday?.talked || 0;
  const talkedTarget = user?.target_visits || 0;

  const flyersTotal = (stats?.flyer || 0) + (stats?.station_flyer || 0) + (stats?.absent || 0) + (stats?.flyerCount || 0);
  const flyersToday = (statsToday?.flyer || 0) + (statsToday?.station_flyer || 0) + (statsToday?.absent || 0) + (statsToday?.flyerCount || 0);
  const flyersTarget = user?.target_flyers || 0;
  const speechToday = statsToday?.speech || 0;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBgImage(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setBgImage(null);
    // Reset the input value so the same file can be uploaded again if needed
    const fileInput = document.getElementById('sns-bg-upload');
    if (fileInput) fileInput.value = '';
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Canvas size: 1080x1920 (9:16 vertical - standard for Stories/Reels)
    canvas.width = 1080;
    canvas.height = 1920;
    
    if (bgImage) {
      // Draw custom background image with object-fit: cover logic
      const scale = Math.max(canvas.width / bgImage.width, canvas.height / bgImage.height);
      const x = (canvas.width / 2) - (bgImage.width / 2) * scale;
      const y = (canvas.height / 2) - (bgImage.height / 2) * scale;
      
      ctx.drawImage(bgImage, x, y, bgImage.width * scale, bgImage.height * scale);
      
      // Draw dark semi-transparent overlay to ensure text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Default Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, '#020617'); // Slate-950
      gradient.addColorStop(0.5, '#0F172A'); // Slate-900
      gradient.addColorStop(1, '#1E1B4B'); // Indigo-950
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Decorative glowing orbs
      ctx.globalCompositeOperation = 'screen';
      
      const orb1 = ctx.createRadialGradient(900, 200, 50, 900, 200, 600);
      orb1.addColorStop(0, 'rgba(37, 99, 235, 0.4)'); // Blue-600
      orb1.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const orb2 = ctx.createRadialGradient(100, 1600, 50, 100, 1600, 700);
      orb2.addColorStop(0, 'rgba(245, 158, 11, 0.25)'); // Amber-500
      orb2.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = 'source-over';
    }

    // Header Area
    ctx.textAlign = 'center';
    ctx.fillStyle = '#60A5FA'; // Blue-400
    ctx.font = 'bold 45px sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillText('POLISTEP REPORT', canvas.width / 2, 200);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 95px sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('本日の活動レポート', canvas.width / 2, 330);

    if (regionName) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText(`📍 ${regionName}周辺`, canvas.width / 2, 450);
    }

    // Safe round rect helper for older browsers (e.g. iOS 15)
    const safeRoundRect = (x, y, w, h, r) => {
      if (w <= 0 || h <= 0) return;
      let radius = r;
      if (w < 2 * radius) radius = w / 2;
      if (h < 2 * radius) radius = h / 2;
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    // Helper function for rounded rects (Glassmorphism cards)
    const drawGlassCard = (x, y, w, h) => {
      ctx.fillStyle = bgImage ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      safeRoundRect(x, y, w, h, 40);
      ctx.fill();
      ctx.stroke();
    };

    // Card 1: 訪問・ご挨拶 (Primary KPI)
    drawGlassCard(90, 550, 900, 480);
    
    ctx.textAlign = 'left';
    ctx.fillStyle = '#60A5FA';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText('🤝 訪問・ご挨拶', 150, 650);

    // 3 Numbers Layout (Today, Total, Target)
    const drawStatBox = (x, y, label, value, unit, isHighlight = false) => {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 35px sans-serif';
      ctx.fillText(label, x, y);
      
      ctx.fillStyle = isHighlight ? '#FCD34D' : '#FFFFFF';
      ctx.font = '900 85px sans-serif';
      ctx.fillText(value, x, y + 100);
      
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(unit, x + (ctx.measureText(value).width / 2) + 40, y + 95);
    };

    // Columns: X = 270 (Left), 540 (Center), 810 (Right)
    drawStatBox(270, 780, '本日の実績', talkedToday.toLocaleString(), '件', true);
    drawStatBox(540, 780, '累計実績', talkedTotal.toLocaleString(), '件', false);
    drawStatBox(810, 780, '目標設定', talkedTarget ? talkedTarget.toLocaleString() : '---', '件', false);

    // Progress Bar
    const progressW = 780;
    const p1 = Math.min(1, talkedTotal / (talkedTarget || 1));
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    safeRoundRect(150, 940, progressW, 30, 15); ctx.fill();
    ctx.fillStyle = '#3B82F6';
    safeRoundRect(150, 940, progressW * p1, 30, 15); ctx.fill();


    // Card 2: ビラ・チラシ配布
    drawGlassCard(90, 1080, 900, 480);
    
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText('📄 ビラ・チラシ配布', 150, 1180);

    drawStatBox(270, 1310, '本日の実績', flyersToday.toLocaleString(), '枚', true);
    drawStatBox(540, 1310, '累計実績', flyersTotal.toLocaleString(), '枚', false);
    drawStatBox(810, 1310, '目標設定', flyersTarget ? flyersTarget.toLocaleString() : '---', '枚', false);

    const p2 = Math.min(1, flyersTotal / (flyersTarget || 1));
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    safeRoundRect(150, 1470, progressW, 30, 15); ctx.fill();
    ctx.fillStyle = '#F59E0B';
    safeRoundRect(150, 1470, progressW * p2, 30, 15); ctx.fill();

    // Footer Message
    ctx.textAlign = 'center';
    ctx.font = 'bold 45px sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('地道な活動が、地域を変える。', canvas.width / 2, 1720);
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 35px sans-serif';
    ctx.fillText('一緒に活動してくれる仲間を募集しています！', canvas.width / 2, 1800);

    // Draw PoliStep Logo at bottom right
    const logoImg = new Image();
    logoImg.onload = () => {
      const logoSize = 120;
      ctx.drawImage(logoImg, canvas.width / 2 - logoSize / 2, 1680, logoSize, logoSize);
      ctx.font = '35px sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('Generated by PoliStep', canvas.width / 2, 1850);
    };
    logoImg.src = '/polistep_logo_new.jpg';
  };

  useEffect(() => {
    if (visible) {
      setTimeout(drawCanvas, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, regionName, stats, bgImage]);

  if (!visible) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `polistep_activity_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const shareText = `本日も${regionName || '地域'}で活動させていただきました！🏃‍♂️\n\n🎯 本日の活動実績\n🤝 ご挨拶できた数: ${talkedToday}件\n📄 ビラ配布: ${flyersToday}枚\n🎤 街頭演説: ${speechToday}回\n\n貴重なご意見をいただき、ありがとうございます。引き続き地域のために走り抜きます！\n#政治活動 #PoliStep`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="overlay">
      <div className="modal-content" style={{ maxWidth: '600px', width: '95%', padding: '2rem', textAlign: 'left', maxHeight: '95vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔗</span> SNS用活動報告を作成
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#64748B' }}>×</button>
        </div>
        
        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          日々の努力（活動量）を有権者に分かりやすく伝えるための、インフォグラフィック画像と投稿文章を生成します。
        </p>

        <div style={{ marginBottom: '1.5rem', background: '#F0F9FF', padding: '1rem', borderRadius: '12px', border: '1px dashed #93C5FD' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E3A8A' }}>
            <span>📸</span> 背景写真を追加（任意）
          </label>
          <p style={{ fontSize: '0.85rem', color: '#3B82F6', marginBottom: '1rem' }}>
            街頭演説の様子やチームの集合写真などを背景に設定すると、SNSでの反応率がアップします！
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              id="sns-bg-upload"
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              style={{ flex: 1, fontSize: '0.9rem' }}
            />
            {bgImage && (
              <button 
                onClick={clearImage}
                style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
              >
                <span>🗑️</span> クリア
              </button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1E293B' }}>📍 活動した地域名（任意）</label>
          <input 
            type="text" 
            placeholder="例: 中野区弥生町" 
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            className="input-premium"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          
          {/* 画像セクション */}
          <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
               ① 画像を保存する
            </p>
            <div style={{ border: '1px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden', margin: '0 auto 1.5rem', maxWidth: '240px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#020617' }}>
              <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }}></canvas>
            </div>
            <button onClick={handleDownload} className="btn-premium" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', background: '#1D4ED8', width: '100%' }}>
              <span>⬇️</span> 画像をダウンロード
            </button>
          </div>

          {/* テキストセクション */}
          <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
               ② 文章をコピーする
            </p>
            <div style={{ position: 'relative' }}>
              <textarea 
                value={shareText} 
                readOnly 
                style={{ width: '100%', height: '180px', padding: '1rem', borderRadius: '12px', border: '1px solid #CBD5E1', background: 'white', color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, resize: 'none' }}
              />
              <button 
                onClick={handleCopy}
                style={{ position: 'absolute', bottom: '10px', right: '10px', background: copied ? '#2563EB' : '#1E293B', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
              >
                <span>{copied ? '✅' : '📋'}</span>
                {copied ? 'コピーしました！' : 'コピー'}
              </button>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
              コピーした文章は、SNS投稿画面で自由に編集してご使用ください。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
