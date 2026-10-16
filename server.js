/**
 * The Minimalist Dentist — Local Development & Production Node Server
 * Serves static web application assets and handles /api/send via Resend.
 * Zero external dependencies required (uses built-in Node.js modules).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { sendEmailViaResend } = require('./api/send.js');

// Load environment variables from .env file
function loadEnv() {
  try {
    if (typeof process.loadEnvFile === 'function') {
      process.loadEnvFile();
      return;
    }
  } catch (e) {
    // Fall back to manual parsing if .env file exists
  }

  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const firstEqual = trimmed.indexOf('=');
          const key = trimmed.slice(0, firstEqual).trim();
          let val = trimmed.slice(firstEqual + 1).trim();
          // Remove wrapping quotes if present
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    } catch (err) {
      console.warn('Could not parse .env file:', err.message);
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. API Route: /api/send
  if (pathname === '/api/send' || pathname === '/api/send.js') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
      return;
    }

    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk;
      if (rawBody.length > 1e6) { // 1MB limit
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        let data;
        try {
          data = JSON.parse(rawBody);
        } catch (e) {
          throw new Error('Invalid JSON format in request body.');
        }

        const result = await sendEmailViaResend(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Appointment request sent successfully to contact@theminimalistdentist.in',
          id: result?.id,
        }));
      } catch (err) {
        console.error('Error handling /api/send:', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: err.message || 'Failed to send appointment inquiry.',
        }));
      }
    });
    return;
  }

  // 2. Static Files & Routing
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  // Legacy redirects for article URLs
  const legacyArticleRedirects = {
    '/why-most-people-brush-wrong.html': '/blog/why-most-people-brush-wrong',
    '/why-most-people-brush-wrong': '/blog/why-most-people-brush-wrong',
    '/real-reason-gums-bleed.html': '/blog/real-reason-gums-bleed',
    '/real-reason-gums-bleed': '/blog/real-reason-gums-bleed',
    '/whitening-strips-vs-in-clinic-whitening.html': '/blog/whitening-strips-vs-in-clinic-whitening',
    '/whitening-strips-vs-in-clinic-whitening': '/blog/whitening-strips-vs-in-clinic-whitening',
    '/dental-anxiety-is-real.html': '/blog/dental-anxiety-is-real',
    '/dental-anxiety-is-real': '/blog/dental-anxiety-is-real',
    '/10-foods-that-quietly-damage-your-enamel.html': '/blog/10-foods-that-quietly-damage-your-enamel',
    '/10-foods-that-quietly-damage-your-enamel': '/blog/10-foods-that-quietly-damage-your-enamel',
    '/dental-implants-guide-for-first-timers.html': '/blog/dental-implants-guide-for-first-timers',
    '/dental-implants-guide-for-first-timers': '/blog/dental-implants-guide-for-first-timers',
    '/when-should-children-get-first-check-up.html': '/blog/when-should-children-get-first-check-up',
    '/when-should-children-get-first-check-up': '/blog/when-should-children-get-first-check-up',
  };

  if (legacyArticleRedirects[pathname]) {
    res.writeHead(301, { Location: legacyArticleRedirects[pathname] });
    res.end();
    return;
  }

  // Dynamic Blog Routing: /blog/:slug -> static in blog/ folder, else dynamic blog-post.html
  let filePath;
  if (pathname.startsWith('/blog/') && pathname !== '/blog/' && !path.extname(pathname)) {
    const slug = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
    const staticBlogPath = path.join(ROOT_DIR, 'blog', `${slug}.html`);
    if (fs.existsSync(staticBlogPath)) {
      filePath = staticBlogPath;
    } else {
      filePath = path.join(ROOT_DIR, 'blog-post.html');
    }
  } else if (pathname === '/blog' || pathname === '/blog/') {
    filePath = path.join(ROOT_DIR, 'blog', 'index.html');
  } else {
    filePath = path.join(ROOT_DIR, pathname);
  }

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  try {
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      // Try adding .html extension
      if (!path.extname(filePath)) {
        const withHtml = filePath + '.html';
        if (fs.existsSync(withHtml)) {
          filePath = withHtml;
          stat = fs.statSync(filePath);
        }
      }
    }

    if (stat && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    }

    if (!stat || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>The requested page was not found.</p><p><a href="/">Return Home</a></p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'max-age=86400',
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    console.error('File serving error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\n🦷 The Minimalist Dentist Server running at http://localhost:${PORT}`);
  console.log(`📧 Contact form endpoint active at http://localhost:${PORT}/api/send\n`);
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Notice: RESEND_API_KEY is not set in .env. Form submissions will prompt you to add your key.');
  }
});
