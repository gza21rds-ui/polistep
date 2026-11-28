const UTM_STORAGE_KEY = 'polistep_attribution_utm';

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  const clean = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) clean[k] = v;
  });
  window.gtag('event', eventName, clean);
}

export function captureUtmParams() {
  if (typeof window === 'undefined') return {};
  try {
    const search = new URLSearchParams(window.location.search);
    const incoming = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((key) => {
      const val = search.get(key);
      if (val) incoming[key] = val;
    });
    if (Object.keys(incoming).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(incoming));
      return incoming;
    }
  } catch {
    // ignore storage errors
  }
  return getStoredUtmParams();
}

export function getStoredUtmParams() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function buildPoliStepUtmUrl(baseUrl, contentLocation, campaign = 'site_nav') {
  try {
    const url = new URL(baseUrl);
    if (!url.searchParams.has('utm_source')) {
      url.searchParams.set('utm_source', 'polistep');
      url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', campaign);
      url.searchParams.set('utm_content', contentLocation);
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

const ROUTE_SEO = {
  '/': {
    title: 'PoliStep - 政治活動DXアプリ | 孤独なドブ板は、可視化で終わる。',
    description:
      'PoliStep(ポリステップ)は、日々の政治活動（地域訪問・対話記録・ポスター貼付・街頭演説・ビラ配り等）をスマホの地図上でリアルタイムに可視化・共有できる政治活動DXアプリです。',
    canonical: 'https://polistep.jp/',
  },
  '/terms': {
    title: '利用規約 | PoliStep',
    description: '政治活動DXアプリ「PoliStep」の利用規約です。',
    canonical: 'https://polistep.jp/terms',
  },
  '/privacy': {
    title: 'プライバシーポリシー | PoliStep',
    description: '政治活動DXアプリ「PoliStep」のプライバシーポリシーです。',
    canonical: 'https://polistep.jp/privacy',
  },
  '/legal': {
    title: '特定商取引法に基づく表記 | PoliStep',
    description: '政治活動DXアプリ「PoliStep」の特定商取引法に基づく表記です。',
    canonical: 'https://polistep.jp/legal',
  },
  '/auth': {
    title: 'ログイン・無料アカウント登録 | PoliStep',
    description: 'PoliStepの無料アカウント登録・ログイン画面です。',
    canonical: 'https://polistep.jp/auth',
  },
};

export function syncRouteSeoAndPageView(pathname, search = '') {
  if (typeof window === 'undefined') return;
  const meta = ROUTE_SEO[pathname];
  if (meta) {
    document.title = meta.title;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', meta.canonical);
    }
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', meta.description);
    }
  }

  trackEvent('page_view', {
    page_path: pathname + search,
    page_title: document.title,
    page_location: window.location.href,
  });
}
