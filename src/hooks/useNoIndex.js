import { useEffect } from 'react';

export default function useNoIndex() {
  useEffect(() => {
    // 既存の robots meta タグがあれば取得
    let meta = document.querySelector('meta[name="robots"]');
    let created = false;

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
      created = true;
    } else {
      // 既存の meta タグがある場合、元々の content を保存して上書き
      meta.dataset.originalContent = meta.content;
      meta.content = 'noindex, nofollow';
    }

    return () => {
      if (created) {
        document.head.removeChild(meta);
      } else {
        // 元の content に戻す
        if (meta.dataset.originalContent) {
          meta.content = meta.dataset.originalContent;
        } else {
          meta.removeAttribute('content');
        }
      }
    };
  }, []);
}
