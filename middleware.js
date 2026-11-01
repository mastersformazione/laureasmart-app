// Serve the approved Laurea Smart UI on the existing app domain.
// No CRM credentials, Connector changes, or native app changes.
const SITE = 'https://laureasmart.it';
const ASSETS = '/wp-content/plugins/laureasmart-collaudo/assets/';
const APP_ORIGIN = 'https://app.laureasmart.it';

export async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const isPost = path === '/ls-request';
  const isAsset = path.startsWith('/ls-assets/');
  const headers = new Headers({ 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Laurea-Release': 'web-20261101-wizard' });
  const fail = (message, status) => new Response(JSON.stringify({ ok: false, message }), { status, headers: { ...Object.fromEntries(headers), 'Content-Type': 'application/json' } });
  if (isPost ? request.method !== 'POST' : !['GET', 'HEAD'].includes(request.method)) return fail('Metodo non consentito.', 405);
  const upstreamHeaders = new Headers();
  let body;
  if (isPost) {
    // Validate the browser origin here before using the existing site's origin guard.
    if (request.headers.get('origin') !== APP_ORIGIN || url.origin !== APP_ORIGIN) return fail('Inviare la richiesta dall’app Laurea Smart.', 403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return fail('Formato non valido.', 415);
    if (Number(request.headers.get('content-length')) > 32768) return fail('Richiesta troppo grande.', 413);
    body = await request.text();
    if (new TextEncoder().encode(body).length > 32768) return fail('Richiesta troppo grande.', 413);
    upstreamHeaders.set('Content-Type', 'application/json');
    upstreamHeaders.set('Origin', SITE);
    upstreamHeaders.set('X-Laurea-Session', request.headers.get('x-laurea-session') || '');
    const session = (request.headers.get('cookie') || '').split(';').map(v => v.trim()).find(v => v.startsWith('__Host-ls_app_session='));
    if (!session) return fail('Sessione dell’app non disponibile. Ricarica il modulo e riprova.', 403);
    const sessionValue = session.slice('__Host-ls_app_session='.length);
    if (sessionValue !== request.headers.get('x-laurea-session')) return fail('Sessione dell’app non aggiornata. Ricarica il modulo e riprova.', 403);
    upstreamHeaders.set('Cookie', 'ls_form_session=' + sessionValue);
  }
  let target = SITE + '/wp-admin/admin-post.php?action=' + (path === '/privacy' ? 'laureasmart_privacy' : 'laureasmart_app');
  if (isPost) target = SITE + '/wp-json/laureasmart/v1/request';
  if (isAsset) {
    const name = path.slice('/ls-assets/'.length);
    if (!/^(?:styles\.css|qualification\.js|crm-client\.js|quiz-access\.js|app\.js|brand-kit\/fonts\/manrope-variable\.ttf)$/.test(name)) return fail('Risorsa non trovata.', 404);
    target = SITE + ASSETS + name + url.search;
  }
  try {
    const upstream = await fetch(target, { method: isPost ? 'POST' : 'GET', headers: upstreamHeaders, body, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(55000) });
    const type = upstream.headers.get('content-type') || 'application/octet-stream';
    headers.set('Content-Type', type);
    if (isPost || isAsset || !type.includes('text/html')) return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers });
    let html = await upstream.text();
    html = html.replace(/window\.LaureaWPCRM=(\{.*?\});<\/script>/, (_, json) => {
      const config = JSON.parse(json);
      // Bind the WordPress-signed token to an HttpOnly cookie on the actual app host.
      // Never reconstruct this cookie from a submitted header or expose credentials.
      if (!/^[a-f0-9]{32}\.\d+\.live\.[a-f0-9]{64}$/.test(config.token)) throw new Error('Invalid session');
      headers.set('Set-Cookie', '__Host-ls_app_session=' + config.token + '; Path=/; Max-Age=7200; Secure; HttpOnly; SameSite=Strict');
      config.api = '/ls-request';
      config.privacy = '/privacy';
      return 'window.LaureaWPCRM=' + JSON.stringify(config).replace(/</g, '\\u003c') + ';</script>';
    });
    html = html.split(SITE + ASSETS).join('/ls-assets/');
    if (path === '/privacy' && !html.includes('sono gestiti tramite Vercel')) {
      html = html.replace('percorso e modello di ateneo eventualmente scelti', 'percorso eventualmente scelto e preferenze per individuare l’ateneo');
      html = html.replace('</body>', '<p>L’interfaccia su app.laureasmart.it è distribuita tramite Vercel, che gestisce anche il transito tecnico della richiesta verso il sito WordPress. La richiesta viene poi gestita nel CRM Laurea Smart come descritto sopra. Per informazioni sui fornitori, sulle ubicazioni del trattamento e sulle garanzie applicabili puoi contattare info@laureasmart.it.</p></body>');
    }
    return new Response(request.method === 'HEAD' ? null : html, { status: upstream.status, headers });
  } catch {
    return new Response('<!doctype html><html lang="it"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Laurea Smart</title><body style="font-family:system-ui;padding:32px"><h1>LAUREA SMART</h1><p>Connessione momentaneamente non disponibile. Riprova tra poco.</p><a href="/">Riprova</a></body></html>', { status: 503, headers: { ...Object.fromEntries(headers), 'Content-Type': 'text/html; charset=utf-8' } });
  }
}

export const config = { matcher: ['/', '/privacy', '/ls-request', '/ls-assets/:path*'] };
