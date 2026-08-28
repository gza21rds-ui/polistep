import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function DashboardTour({ run, onFinish }) {
  const [tourRun, setTourRun] = useState(false);

  useEffect(() => {
    if (run) {
      setTourRun(true);
    }
  }, [run]);

  const steps = [
    {
      target: 'body',
      placement: 'center',
      title: '🌟 PoliStepへようこそ！',
      content: '政治活動・ドブ板活動を見える化し、チーム一丸で勝利を目指すための管理画面です。基本的な使い方を30秒でご案内します！',
      disableBeacon: true,
    },
    {
      target: '#tour-progress-bar',
      title: '🎯 1. まずは活動目標を設定しましょう！',
      content: '選挙本番（投票日）までに必要な「訪問件数」や「ビラ配布枚数」の目標を設定します。右上の「目標再設定」からいつでも変更でき、本番までの「1日あたりの必要ノルマ」が自動計算されます！',
    },
    {
      target: '#tour-dashboard-map',
      title: '🗺️ 2. 活動エリアマップで全体を可視化！',
      content: 'チーム全員が立てたピンの広がりがひと目でわかります。どの地域を訪問済みで、どこがまだ未開拓かが直感的に把握できます。',
    },
    {
      target: '#tour-today-summary',
      title: '📊 3. チームの活動実績を集計！',
      content: '本日達成された「対話」「ポスター」「ビラ配り」「辻立ち」などの合計数がリアルタイムに集計されます。下のボタンから「活動報告用のSNS画像」も一瞬で作成できます！',
    },
    {
      target: '#tour-share-link',
      title: '🔗 4. スタッフへマップを共有！',
      content: '表示されているURLをLINEやメールでボランティア・運動員に共有するだけ！スタッフは面倒な会員登録なしで、スマホの地図からすぐに活動を記録できます。',
    },
    {
      target: '#tour-timeline',
      title: '⚡ 5. 現場の声をリアルタイム確認！',
      content: '運動員が現場で記録したお名前や対話メモがリアルタイムに届きます。過去のメモはお名前やキーワードでいつでも検索可能です。',
    },
    {
      target: '#tour-action-button',
      title: '🚀 6. マップを開いて活動開始！',
      content: '候補者ご自身やスタッフが現場に出る際は、ここからマップを開いてスマホのGPS連動でピンを打っていきましょう！',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setTourRun(false);
      localStorage.setItem('polistep_dashboard_tour_seen', 'true');
      if (onFinish) onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={tourRun}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      locale={{
        back: '戻る',
        close: '閉じる',
        last: '完了して始める！',
        next: '次へ',
        skip: 'スキップ',
      }}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(15, 23, 42, 0.7)',
          primaryColor: '#2563EB',
          textColor: '#0F172A',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
          fontFamily: "'Noto Sans JP', sans-serif",
        },
        tooltipTitle: {
          fontSize: '1.2rem',
          fontWeight: 800,
          marginBottom: '0.6rem',
          color: '#0F172A',
        },
        tooltipContent: {
          fontSize: '0.95rem',
          lineHeight: 1.65,
          color: '#334155',
        },
        buttonNext: {
          backgroundColor: '#2563EB',
          borderRadius: '8px',
          fontWeight: 700,
          padding: '0.6rem 1.2rem',
          fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        },
        buttonBack: {
          color: '#64748B',
          fontWeight: 600,
          marginRight: '0.5rem',
        },
        buttonSkip: {
          color: '#94A3B8',
          fontSize: '0.85rem',
        },
      }}
    />
  );
}
