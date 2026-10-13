/**
 * Resend Email API Handler for The Minimalist Dentist
 * Compatible with Vercel Serverless Functions, Netlify, and standalone Node.js.
 */

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_RECIPIENT = 'contact@theminimalistdentist.in';
const DEFAULT_SENDER = 'The Minimalist Dentist <onboarding@resend.dev>';

/**
 * Clean phone numbers to international digits-only format for WhatsApp links
 */
function cleanPhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Escapes HTML characters to prevent XSS in email bodies
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates responsive, minimalist HTML email template matching brand aesthetics
 */
function generateEmailHtml({ fname, lname, phone, email, service, date, time, message }) {
  const fullName = escapeHtml(`${fname || ''} ${lname || ''}`.trim()) || 'Prospective Patient';
  const cleanPhone = cleanPhoneNumber(phone);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeService = escapeHtml(service) || 'General Consultation';
  const safeDate = escapeHtml(date) || 'Flexible / Not specified';
  const safeTime = escapeHtml(time) || 'Any time';
  const safeMessage = message ? escapeHtml(message).replace(/\n/g, '<br />') : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Appointment Request</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F7F3EC;
      color: #1F2421;
      margin: 0;
      padding: 32px 16px;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #E6E0D6;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }
    .header {
      background-color: #1F2421;
      padding: 28px 32px;
      color: #F7F3EC;
      border-bottom: 3px solid #D96B3A;
    }
    .header-logo {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #D96B3A;
      margin-bottom: 6px;
    }
    .header-title {
      font-size: 22px;
      font-weight: 500;
      margin: 0;
      color: #F7F3EC;
      letter-spacing: 0.02em;
    }
    .body {
      padding: 32px;
    }
    .tag {
      display: inline-block;
      background: rgba(217, 107, 58, 0.1);
      color: #D96B3A;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 4px;
      margin-bottom: 24px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-table tr {
      border-bottom: 1px solid #F0ECE4;
    }
    .details-table tr:last-child {
      border-bottom: none;
    }
    .label-col {
      width: 35%;
      padding: 14px 0;
      vertical-align: top;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #7A756F;
      font-weight: 600;
    }
    .value-col {
      width: 65%;
      padding: 14px 0;
      vertical-align: top;
      font-size: 15px;
      color: #1F2421;
      font-weight: 500;
    }
    .value-col a {
      color: #D96B3A;
      text-decoration: none;
      font-weight: 500;
    }
    .message-card {
      background-color: #FAF8F5;
      border-left: 3px solid #D96B3A;
      padding: 14px 18px;
      font-size: 14px;
      line-height: 1.6;
      color: #2C2C2C;
      margin-top: 6px;
      border-radius: 0 4px 4px 0;
    }
    .footer {
      background-color: #FAF8F5;
      padding: 20px 32px;
      border-top: 1px solid #E6E0D6;
      font-size: 12px;
      color: #8C867E;
      line-height: 1.6;
      text-align: center;
    }
    .footer a {
      color: #D96B3A;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">The Minimalist Dentist</div>
      <h1 class="header-title">New Appointment Request</h1>
    </div>
    <div class="body">
      <div class="tag">Patient Booking Inquiry</div>
      
      <table class="details-table" role="presentation">
        <tr>
          <td class="label-col">Patient Name</td>
          <td class="value-col"><strong>${fullName}</strong></td>
        </tr>
        <tr>
          <td class="label-col">Phone Number</td>
          <td class="value-col">
            <a href="tel:${safePhone}">${safePhone}</a>
            ${cleanPhone ? `<br /><span style="font-size: 13px;"><a href="https://wa.me/${cleanPhone}" target="_blank" style="color: #D96B3A;">Open WhatsApp Chat →</a></span>` : ''}
          </td>
        </tr>
        <tr>
          <td class="label-col">Email Address</td>
          <td class="value-col">
            ${safeEmail ? `<a href="mailto:${safeEmail}">${safeEmail}</a>` : '<em style="color:#8C867E;">Not provided</em>'}
          </td>
        </tr>
        <tr>
          <td class="label-col">Treatment / Service</td>
          <td class="value-col"><strong style="color: #1F2421;">${safeService}</strong></td>
        </tr>
        <tr>
          <td class="label-col">Preferred Date</td>
          <td class="value-col">${safeDate}</td>
        </tr>
        <tr>
          <td class="label-col">Preferred Time</td>
          <td class="value-col">${safeTime}</td>
        </tr>
        <tr>
          <td class="label-col">Patient Notes</td>
          <td class="value-col">
            ${safeMessage ? `<div class="message-card">${safeMessage}</div>` : '<em style="color:#8C867E;">None provided</em>'}
          </td>
        </tr>
      </table>
    </div>
    <div class="footer">
      This booking request was submitted through the online appointment form.<br />
      Delivered to: <strong>contact@theminimalistdentist.in</strong> · <a href="https://theminimalistdentist.in">theminimalistdentist.in</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates plaintext email version
 */
function generateEmailText({ fname, lname, phone, email, service, date, time, message }) {
  const fullName = `${fname || ''} ${lname || ''}`.trim() || 'Prospective Patient';
  return `=== NEW APPOINTMENT REQUEST - THE MINIMALIST DENTIST ===

Patient Name:      ${fullName}
Phone Number:      ${phone || 'N/A'}
Email Address:     ${email || 'N/A'}
Service Required:  ${service || 'General Consultation'}
Preferred Date:    ${date || 'Flexible'}
Preferred Time:    ${time || 'Any time'}

Patient Notes:
${message || 'None provided'}

--------------------------------------------------
Delivered to: contact@theminimalistdentist.in
`;
}

/**
 * Core function to send appointment details via Resend API
 */
async function sendEmailViaResend(formData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_your_api_key_here') {
    throw new Error('Resend API key is not configured. Please set RESEND_API_KEY in your environment or .env file.');
  }

  const { fname, lname, phone, email, service } = formData;
  if (!fname || !phone) {
    throw new Error('Missing required fields: First name and Phone number are required.');
  }

  const fullName = `${fname || ''} ${lname || ''}`.trim();
  const fromEmail = process.env.RESEND_FROM || DEFAULT_SENDER;
  const toEmail = process.env.RESEND_TO || DEFAULT_RECIPIENT;

  const emailPayload = {
    from: fromEmail,
    to: [toEmail],
    subject: `New Appointment Request: ${fullName} (${service || 'Consultation'})`,
    html: generateEmailHtml(formData),
    text: generateEmailText(formData),
  };

  // Set Reply-To to patient's email if valid
  if (email && email.includes('@')) {
    emailPayload.reply_to = email.trim();
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(emailPayload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMsg = responseData?.message || responseData?.error || `Resend API returned status ${response.status}`;
    throw new Error(errorMsg);
  }

  return responseData;
}

/**
 * Serverless Handler (Vercel / Netlify / Node HTTP)
 */
async function handler(req, res) {
  // Enable CORS if invoked cross-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead ? res.writeHead(200).end() : res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    const errorJson = JSON.stringify({ success: false, error: 'Method Not Allowed. Use POST.' });
    if (res.status) {
      return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      return res.end(errorJson);
    }
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    if (!body || typeof body !== 'object') {
      throw new Error('Invalid request body. JSON payload expected.');
    }

    const result = await sendEmailViaResend(body);

    const successData = {
      success: true,
      message: 'Appointment request sent successfully to contact@theminimalistdentist.in',
      id: result?.id,
    };

    if (res.status) {
      return res.status(200).json(successData);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(successData));
    }
  } catch (error) {
    console.error('[Resend Error]', error.message);
    const errorData = {
      success: false,
      error: error.message || 'Failed to send appointment request.',
    };

    if (res.status) {
      return res.status(400).json(errorData);
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(errorData));
    }
  }
}

module.exports = handler;
module.exports.sendEmailViaResend = sendEmailViaResend;
