const http = require('http');
const fs = require('fs');
const path = require('path');

// Use same puppeteer setup as the working usage tracker
const modPath = './node_modules';
const puppeteer = require(modPath + '/puppeteer-extra');
const StealthPlugin = require(modPath + '/puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const PORT = 3456;

// --- Session cookie ---
function loadCookie() {
  try {
    const m = fs.readFileSync('./.env', 'utf8').match(/CLAUDE_SESSION_COOKIE=(.+)/);
    return m ? m[1].trim() : null;
  } catch { return null; }
}

// --- Usage cache ---
let cachedUsage = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute
let fetchInProgress = false;

function ttr(ts) {
  try {
    const ms = new Date(ts) - new Date();
    if (ms <= 0) return 'now';
    const m = Math.floor(ms / 60000);
    if (m < 60) return `${m}m`;
    if (m < 1440) { const h = m / 60 | 0, r = m % 60; return r ? `${h}h${r}m` : `${h}h`; }
    const d = m / 1440 | 0, h = (m % 1440) / 60 | 0;
    return h ? `${d}d${h}h` : `${d}d`;
  } catch { return '?'; }
}

async function fetchUsage() {
  // Return cache if fresh
  if (cachedUsage && (Date.now() - cacheTime) < CACHE_TTL) {
    console.log('[cache] Returning cached data');
    return cachedUsage;
  }

  // Prevent concurrent fetches
  if (fetchInProgress) {
    console.log('[fetch] Already in progress, returning cache or waiting');
    if (cachedUsage) return cachedUsage;
    await new Promise(r => setTimeout(r, 5000));
    return cachedUsage || { error: 'Fetch in progress' };
  }

  fetchInProgress = true;
  console.log('[fetch] Starting puppeteer fetch...');

  const cookie = loadCookie();
  if (!cookie) {
    fetchInProgress = false;
    throw new Error('No session cookie');
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

    // Step 1: Navigate to get cf_clearance
    console.log('[fetch] Navigating to claude.ai...');
    await page.goto('https://claude.ai', { waitUntil: 'networkidle2', timeout: 60000 });

    // Step 2: Set session cookie
    await page.setCookie({ name: 'sessionKey', value: cookie, domain: '.claude.ai', path: '/' });

    // Step 3: Reload with cookie active
    console.log('[fetch] Reloading with cookie...');
    await page.goto('https://claude.ai', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    // Step 4: Fetch orgs
    console.log('[fetch] Fetching organizations...');
    await page.goto('https://claude.ai/api/organizations', { waitUntil: 'networkidle2', timeout: 30000 });
    const orgsText = await page.evaluate(() => document.body.textContent);
    console.log('[fetch] Orgs response:', orgsText.substring(0, 100));

    const orgsData = JSON.parse(orgsText);
    if (orgsData.type === 'error') {
      throw new Error(`API error: ${orgsData.error?.message || 'unknown'}`);
    }

    const orgs = Array.isArray(orgsData) ? orgsData : [orgsData];
    const org = orgs.find(o => o.capabilities && o.capabilities.includes('claude_max')) || orgs[0];
    if (!org) throw new Error('No org found');

    // Step 5: Fetch usage
    console.log('[fetch] Fetching usage for', org.name);
    await page.goto(`https://claude.ai/api/organizations/${org.uuid}/usage`, { waitUntil: 'networkidle2', timeout: 30000 });
    const usageText = await page.evaluate(() => document.body.textContent);
    const usage = JSON.parse(usageText);

    console.log('[fetch] Usage data received');

    const isMax = org.capabilities && org.capabilities.includes('claude_max');
    const result = {
      organization: org.name || 'Unknown',
      plan: isMax ? 'Claude Max' : 'Claude Pro',
      rate_limit_tier: org.rate_limit_tier || '',
      timestamp: new Date().toISOString()
    };

    if (usage.five_hour) {
      result.five_hour = {
        utilization: Math.round(usage.five_hour.utilization || 0),
        resets_at: usage.five_hour.resets_at,
        resets_in: ttr(usage.five_hour.resets_at)
      };
    }
    if (usage.seven_day) {
      result.seven_day = {
        utilization: Math.round(usage.seven_day.utilization || 0),
        resets_at: usage.seven_day.resets_at,
        resets_in: ttr(usage.seven_day.resets_at)
      };
    }
    if (usage.seven_day_sonnet) {
      result.seven_day_sonnet = {
        utilization: Math.round(usage.seven_day_sonnet.utilization || 0)
      };
    }
    if (usage.seven_day_opus) {
      result.seven_day_opus = {
        utilization: Math.round(usage.seven_day_opus.utilization || 0)
      };
    }

    // Only cache valid data
    if (result.five_hour || result.seven_day) {
      cachedUsage = result;
      cacheTime = Date.now();
      console.log('[cache] Data cached successfully');
    }

    return result;

  } finally {
    fetchInProgress = false;
    if (browser) await browser.close().catch(() => {});
  }
}

// --- HTTP Server ---
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (url.pathname === '/api/usage') {
    try {
      const data = await fetchUsage();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      console.error('[error]', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Serve static files
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  filePath = path.join(__dirname, filePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.ico': 'image/x-icon'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Claude Monitor running on http://0.0.0.0:${PORT}`);
  console.log('Cookie loaded:', loadCookie() ? 'YES' : 'NO');
});
