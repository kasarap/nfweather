export async function onRequest(context) {
  const { env } = context;

  const API_KEY = env.AMBIENT_API_KEY;
  const APP_KEY = env.AMBIENT_APP_KEY;
  const MAC     = env.AMBIENT_MAC;

  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function fetchWithRetry(url, attempts = 3) {
    for (let i = 0; i < attempts; i++) {
      const res = await fetch(url);
      if (res.ok) return res;
      if (res.status === 429 || res.status === 502) {
        await sleep(1200 * (i + 1));
        continue;
      }
      throw new Error(`HTTP ${res.status}`);
    }
    throw new Error('Max retries exceeded');
  }

  try {
    const base = 'https://rt.ambientweather.net/v1/devices';
    const mac  = encodeURIComponent(MAC);

    // Sequential with 1.1s gap to respect Ambient Weather rate limit (1 req/sec)
    const curRes  = await fetchWithRetry(`${base}?apiKey=${API_KEY}&applicationKey=${APP_KEY}&limit=1`);
    const current = await curRes.json();

    await sleep(1100);

    const hisRes  = await fetchWithRetry(`${base}/${mac}?apiKey=${API_KEY}&applicationKey=${APP_KEY}&limit=96`);
    const history = await hisRes.json();

    return new Response(JSON.stringify({ current, history }), { status: 200, headers: CORS });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}
