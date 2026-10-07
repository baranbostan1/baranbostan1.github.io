// Zaman aşımı, yedek adres ve yeniden deneme ile JSON isteği.
export interface FetchJsonOptions {
  timeoutMs: number;
  /** İlk turdan sonra kaç tur daha denenecek; her turda bütün adresler sırayla denenir */
  retries: number;
  /** Test için değiştirilebilir; varsayılan tarayıcının fetch'i */
  fetcher?: (url: string, init?: RequestInit) => Promise<Response>;
}

async function fetchOnce(url: string, timeoutMs: number, fetcher: NonNullable<FetchJsonOptions['fetcher']>): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as unknown;
  } finally {
    clearTimeout(timer);
  }
}

/** Adresleri sırayla dener; hepsi başarısız olursa turu `retries` kez yineler, sonra son hatayı fırlatır. */
export async function fetchJson(urls: readonly string[], options: FetchJsonOptions): Promise<unknown> {
  if (urls.length === 0) throw new Error('fetchJson: adres listesi boş');
  const fetcher = options.fetcher ?? ((url, init) => fetch(url, init));
  let lastError: unknown = new Error('fetchJson: istek yapılamadı');
  for (let round = 0; round <= options.retries; round += 1) {
    for (const url of urls) {
      try {
        return await fetchOnce(url, options.timeoutMs, fetcher);
      } catch (error) {
        lastError = error;
      }
    }
  }
  throw lastError;
}
