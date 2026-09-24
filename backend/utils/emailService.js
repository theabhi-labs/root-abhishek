import nodemailer from 'nodemailer';

// Helper to create Nodemailer transporter
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (process.env.EMAIL_SERVICE === 'gmail' || (!host && user && pass)) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass }
    });
  }

  return null;
};

// 1. CLIENT AUTO-REPLY HTML TEMPLATE
const getClientWelcomeTemplate = ({ name, message }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Reaching Out | Abhishek Yadav</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080b12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080b12; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: #0f1422; border: 1px solid rgba(255, 103, 0, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Cyber Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #131b2e 0%, #0a0d18 100%); padding: 35px 30px; border-bottom: 2px solid #FF6700; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      <span style="color: #FF6700;">root</span><span style="color: #64748b;">@</span>abhishek<span style="color: #FF6700;">_</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 5px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; background: rgba(255,103,0,0.15); color: #FF6700; border: 1px solid rgba(255,103,0,0.3); border-radius: 999px;">
                      Project Inquiry Received
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 35px;">
              <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; line-height: 1.2;">
                Hello <span style="color: #FF6700;">${name}</span>,
              </h1>
              
              <p style="font-size: 15px; line-height: 1.7; color: #94a3b8; margin: 0 0 24px 0;">
                Thank you for reaching out! I have received your message regarding a potential project collaboration. I appreciate your interest in my engineering and development expertise.
              </p>

              <!-- Message Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #080b12; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #FF6700; margin-bottom: 8px;">
                      Your Message Summary
                    </div>
                    <div style="font-size: 14px; color: #cbd5e1; font-style: italic; line-height: 1.6;">
                      "${message.length > 250 ? message.substring(0, 250) + '...' : message}"
                    </div>
                  </td>
                </tr>
              </table>

              <!-- What's Next Section -->
              <h3 style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 1px;">
                ⚡ What Happens Next?
              </h3>
              
              <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 28px 0;">
                I personally review every project specification. You will receive a detailed follow-up within <strong style="color: #ffffff;">12–24 hours</strong> containing initial architectural thoughts, estimated timeline, and next steps for our discussion.
              </p>

              <!-- Featured Work Highlights -->
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 12px;">
                Explore Recent Builds & Platforms
              </div>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <a href="https://www.jascomputerinstitute.in/" target="_blank" style="text-decoration: none; display: block; background: #131b2e; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
                      <div style="font-size: 14px; font-weight: 700; color: #ffffff;">🏢 JAS Computer Institute</div>
                      <div style="font-size: 12px; color: #94a3b8; margin-top: 3px;">Institutional portal & student management system &rarr;</div>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="https://www.primeidpro.online/" target="_blank" style="text-decoration: none; display: block; background: #131b2e; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
                      <div style="font-size: 14px; font-weight: 700; color: #ffffff;">🚀 PrimeID Pro</div>
                      <div style="font-size: 12px; color: #94a3b8; margin-top: 3px;">Next-Gen smart ID card generation SaaS suite &rarr;</div>
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Direct CTA -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://rootabhi.com" target="_blank" style="display: inline-block; background: #FF6700; color: #000000; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 8px 20px rgba(255,103,0,0.3);">
                      Visit Portfolio
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #080b12; padding: 25px 35px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="font-size: 13px; color: #64748b; margin: 0 0 10px 0;">
                Abhishek Yadav &bull; Full-Stack Engineer &bull; India
              </p>
              <p style="font-size: 12px; color: #475569; margin: 0;">
                Direct Email: <a href="mailto:rootabhishekyadav@gmail.com" style="color: #FF6700; text-decoration: none;">rootabhishekyadav@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// 2. DEVELOPER / DESIGNER WELCOME HTML TEMPLATE
const getDeveloperWelcomeTemplate = ({ name, linkedin, github, discord, message }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digital Handshake Established | Abhishek Yadav</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080b12; font-family: 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080b12; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: #0c101c; border: 1px solid #FF6700; border-radius: 20px; overflow: hidden; box-shadow: 0 0 40px rgba(255,103,0,0.15);">
          
          <!-- Terminal Header -->
          <tr>
            <td style="background: #141a29; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ff5f56; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27c93f;"></span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; color: #FF6700; font-weight: 700; letter-spacing: 2px;">DEV_BRIDGE_ESTABLISHED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <div style="font-size: 12px; color: #FF6700; margin-bottom: 10px; font-weight: bold;">
                // INCOMING_PEER_CONNECTION: ACK 200 OK
              </div>

              <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0;">
                Hey <span style="color: #FF6700;">${name}</span>! 🚀
              </h1>
              
              <p style="font-size: 14px; line-height: 1.8; color: #94a3b8; margin: 0 0 24px 0;">
                Great to connect with a fellow builder! Whether you're coding, designing, brainstorming open-source tools, or prepping for a hackathon, I'm always hyped to collaborate and exchange ideas.
              </p>

              <!-- Digital Coordinates Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #080b12; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
                      Received Digital Coordinates:
                    </div>
                    ${github ? `<div style="font-size: 13px; color: #cbd5e1; margin-bottom: 5px;">⚡ <strong>GitHub:</strong> <span style="color: #38bdf8;">${github}</span></div>` : ''}
                    ${linkedin ? `<div style="font-size: 13px; color: #cbd5e1; margin-bottom: 5px;">💼 <strong>LinkedIn:</strong> <span style="color: #38bdf8;">${linkedin}</span></div>` : ''}
                    ${discord ? `<div style="font-size: 13px; color: #cbd5e1; margin-bottom: 5px;">💬 <strong>Discord:</strong> <span style="color: #a855f7;">${discord}</span></div>` : ''}
                    <div style="font-size: 13px; color: #94a3b8; margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.08);">
                      <strong>Note:</strong> "${message}"
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Abhishek's Digital Coordinates -->
              <div style="font-size: 12px; font-weight: 700; color: #FF6700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1.5px;">
                My Coordinates & Stack
              </div>

              <p style="font-size: 13px; color: #94a3b8; line-height: 1.7; margin: 0 0 24px 0;">
                • <strong>Core Stack:</strong> React, Next.js, Node.js, Express, MongoDB, TailwindCSS, TypeScript, Docker<br>
                • <strong>GitHub:</strong> <a href="https://github.com/theabhi-labs/" target="_blank" style="color: #FF6700; text-decoration: none;">github.com/theabhi-labs</a><br>
                • <strong>Discord:</strong> <a href="https://discord.com/users/anuragabhi" target="_blank" style="color: #FF6700; text-decoration: none;">anuragabhi</a><br>
                • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/abhishek-yadav-rootabhi/" target="_blank" style="color: #FF6700; text-decoration: none;">linkedin.com/in/abhishek-yadav-rootabhi</a>
              </p>

              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://github.com/theabhi-labs/" target="_blank" style="display: inline-block; background: #FF6700; color: #000000; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
                      Explore My GitHub Repos
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #080b12; padding: 20px 30px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                root@abhishek_ // Built with Passion for Clean Architecture
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// 3. ADMIN NOTIFICATION HTML TEMPLATE
const getAdminNotificationTemplate = ({ name, email, isDeveloper, message, devData }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Contact Message</title></head>
<body style="font-family: Arial, sans-serif; background: #080b12; color: #e2e8f0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #0f1422; border: 1px solid #FF6700; border-radius: 12px; padding: 25px;">
    <h2 style="color: #FF6700; margin-top: 0;">📬 New Portfolio Message</h2>
    <p><strong>Sender Type:</strong> <span style="background: ${isDeveloper ? '#38bdf8' : '#FF6700'}; color: #000; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${isDeveloper ? 'Developer / Designer' : 'Client / Project Lead'}</span></p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #FF6700;">${email}</a></p>
    ${isDeveloper && devData ? `
      <div style="background: #141a29; padding: 12px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0 0 5px 0;"><strong>LinkedIn:</strong> ${devData.linkedin || 'N/A'}</p>
        <p style="margin: 0 0 5px 0;"><strong>GitHub:</strong> ${devData.github || 'N/A'}</p>
        <p style="margin: 0;"><strong>Discord:</strong> ${devData.discord || 'N/A'}</p>
      </div>
    ` : ''}
    <p><strong>Message:</strong></p>
    <blockquote style="background: #080b12; border-left: 4px solid #FF6700; padding: 12px 15px; margin: 0; color: #cbd5e1; font-style: italic;">
      ${message}
    </blockquote>
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
    <p style="font-size: 12px; color: #64748b;">Received at ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;
};

// Main Exported Email Sending Function
export const processContactEmails = async ({ name, email, message, isDeveloper, devData }) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER || 'rootabhishekyadav@gmail.com';
  const transporter = createTransporter();

  const results = {
    adminSent: false,
    welcomeSent: false,
    simulated: !transporter
  };

  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL SIMULATION] SMTP not configured. Details logged:`);
    console.log(`From: ${name} (${email}) | Type: ${isDeveloper ? 'Developer' : 'Client'}`);
    console.log(`Message: ${message}`);
    if (isDeveloper && devData) console.log(`Dev Coordinates:`, devData);
    console.log(`======================================================\n`);
    return results;
  }

  // 1. Send Admin Notification Email
  try {
    const adminMailOptions = {
      from: `"root@abhishek Portfolio" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: `🔥 New ${isDeveloper ? 'Dev Connect' : 'Client Message'} from ${name}`,
      html: getAdminNotificationTemplate({ name, email, isDeveloper, message, devData })
    };
    await transporter.sendMail(adminMailOptions);
    results.adminSent = true;
    console.log(`✅ Admin notification email sent to ${adminEmail}`);
  } catch (err) {
    console.error(`❌ Failed to send admin notification email:`, err.message);
  }

  // 2. Send Auto-Reply Welcome Email to Sender
  try {
    const welcomeHtml = isDeveloper
      ? getDeveloperWelcomeTemplate({ name, ...devData, message })
      : getClientWelcomeTemplate({ name, message });

    const welcomeSubject = isDeveloper
      ? `Digital Coordinates Established // Welcome from Abhishek Yadav 🚀`
      : `Thank you for reaching out to Abhishek Yadav`;

    const userMailOptions = {
      from: `"Abhishek Yadav" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: welcomeSubject,
      html: welcomeHtml
    };
    await transporter.sendMail(userMailOptions);
    results.welcomeSent = true;
    console.log(`✅ Welcome auto-reply email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send welcome auto-reply email:`, err.message);
  }

  return results;
};
