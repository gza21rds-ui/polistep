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
      content: '政治活動・ドブ板活動の成果をリアルタイムに可視化する「PoliStep」へようこそ！ダッシュボードの基本的な使い方を30秒でご紹介します。',
      disableBeacon: true,
    },
    {
      target: '#tour-dashboard-map',
      title: '🗺️ 1. 活動エリアマップ',
      content: 'ログイン直後に、チーム全体が立てたピンの広がりが一目でわかります。どこを訪問済みで、どこが未開拓かが直感的に把握できます！',
    },
    {
      target: '#tour-progress-bar',
      title: '🎯 2. 必勝プログレスバー',
      content: '当選に必要な目標訪問数やポスター目標に対する、現在の達成率がリアルタイムにメーターで表示されます。',
    },
    {
      target: '#tour-today-summary',
      title: '📊 3. 本日の活動サマリー',
      content: '今日1日で達成された「対話」「ポスター」「ビラ投函」「辻立ち」などの合計アクション数がひと目でわかります。',
    },
    {
      target: '#tour-timeline',
      title: '⚡ 4. リアルタイム・タイムライン',
      content: '現場の運動員やボランティアがピンを立てると、メモや写真付きの活動報告がリアルタイムにここに届きます！',
    },
    {
      target: '#tour-action-button',
      title: '🚀 5. マップを開いて活動する',
      content: 'ここを押すと全画面の活動マップが起動します。スマホの現在地（GPS）と連動して、現場で簡単にピンを打つことができます！',
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
          overlayColor: 'rgba(15, 23, 42, 0.65)',
          primaryColor: '#2563EB',
          textColor: '#0F172A',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
          fontFamily: "'Noto Sans JP', sans-serif",
        },
        tooltipTitle: {
          fontSize: '1.2rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          color: '#0F172A',
        },
        tooltipContent: {
          fontSize: '0.95rem',
          lineHeight: 1.6,
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
