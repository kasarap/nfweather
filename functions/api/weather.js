export async function onRequest(context) {
  const { env } = context;

  const API_KEY  = env.AMBIENT_API_KEY;
  const APP_KEY  = env.AMBIENT_APP_KEY;
  const MAC      = env.AMBIENT_MAC;

  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const base = 'https://rt.ambientweather.net/v1/devices';
    const mac  = encodeURIComponent(MAC);

    const [curRes, hisRes] = await Promise.all([
      fetch(`${base}?apiKey=${API_KEY}&applicationKey=${APP_KEY}&limit=1`),
      fetch(`${base}/${mac}?apiKey=${API_KEY}&applicationKey=${APP_KEY}&limit=96`),
    ]);

    if (!curRes.ok || !hisRes.ok) {
      return new Response(JSON.stringify({ error: 'Upstream API error' }), { status: 502, headers: CORS });
    }

    const [current, history] = await Promise.all([curRes.json(), hisRes.json()]);

    return new Response(JSON.stringify({ current, history }), { status: 200, headers: CORS });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}
