import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM || "NCC <noreply@ngogbeheicc.org>";
const ADMIN = process.env.ADMIN_EMAIL || "info@ngogbeheicc.org";

/* ── Shared HTML shell ───────────────────────────────────────────── */
function shell(body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#F1F5F9;font-family:'Helvetica Neue',Arial,sans-serif;color:#1E293B}
  .wrap{max-width:600px;margin:40px auto;padding:0 16px 40px}
  .card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
  .hdr{background:#0A2240;padding:28px 36px;display:flex;align-items:center;gap:10px}
  .hdr-dot{width:10px;height:10px;border-radius:50%;background:#059669;flex-shrink:0}
  .hdr-name{color:#fff;font-size:18px;font-weight:900;letter-spacing:-0.4px}
  .hdr-name span{color:#F5C300}
  .body{padding:36px}
  h2{font-size:22px;font-weight:900;color:#0A2240;letter-spacing:-0.5px;margin-bottom:8px}
  .sub{font-size:14px;color:#64748B;margin-bottom:28px;line-height:1.6}
  .row{margin-bottom:16px}
  .lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#94A3B8;margin-bottom:4px}
  .val{font-size:14px;font-weight:600;color:#1E293B}
  .msg-box{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:16px;font-size:14px;color:#334155;line-height:1.7;margin-top:4px}
  .pill{display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}
  .green{background:#F0FDF4;color:#059669}
  .blue{background:#EFF6FF;color:#2563EB}
  .yellow{background:#FEFCE8;color:#D97706}
  .purple{background:#FAF5FF;color:#7C3AED}
  .divider{height:1px;background:#F1F5F9;margin:24px 0}
  .btn{display:inline-block;padding:12px 28px;background:#059669;color:#fff;border-radius:10px;text-decoration:none;font-weight:900;font-size:14px;margin-top:8px}
  .ftr{padding:20px 36px;background:#F8FAFC;border-top:1px solid #E2E8F0}
  .ftr p{font-size:11px;color:#94A3B8;line-height:1.6}
  </style></head><body><div class="wrap"><div class="card">
  <div class="hdr"><div class="hdr-dot"></div><div class="hdr-name">Ngogbehei <span>Cancer Center</span></div></div>
  <div class="body">${body}</div>
  <div class="ftr"><p>Marcel Ngogbehei Center for Cancer Education &amp; Care<br>info@ngogbeheicc.org · ngogbeheicc.org<br>Abuja, Nigeria · Lagos, Nigeria · London, UK</p></div>
  </div></div></body></html>`;
}

/* ── Contact emails ──────────────────────────────────────────────── */
export async function sendContactEmails({ name, email, phone, reason, message }) {
  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your message — Ngogbehei Cancer Center",
      html: shell(`
        <h2>Message received, ${name.split(" ")[0]}!</h2>
        <p class="sub">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
        <div class="row"><div class="lbl">Your message</div><div class="msg-box">${message}</div></div>
        ${reason ? `<div class="row"><div class="lbl">Topic</div><div class="val"><span class="pill green">${reason}</span></div></div>` : ""}
        <div class="divider"></div>
        <p style="font-size:13px;color:#64748B;">If you have an urgent enquiry, call us at <strong>+234-800-NCC-CARE</strong> or email <strong>info@ngogbeheicc.org</strong>.</p>
      `),
    }),
    resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `📬 New Contact: ${name} — ${reason || "General Enquiry"}`,
      html: shell(`
        <h2>New Contact Submission</h2>
        <p class="sub">Received just now from the contact form.</p>
        <div class="row"><div class="lbl">Name</div><div class="val">${name}</div></div>
        <div class="row"><div class="lbl">Email</div><div class="val"><a href="mailto:${email}" style="color:#059669">${email}</a></div></div>
        ${phone ? `<div class="row"><div class="lbl">Phone</div><div class="val">${phone}</div></div>` : ""}
        ${reason ? `<div class="row"><div class="lbl">Reason</div><div class="val"><span class="pill green">${reason}</span></div></div>` : ""}
        <div class="row"><div class="lbl">Message</div><div class="msg-box">${message}</div></div>
        <a href="mailto:${email}" class="btn">Reply to ${name.split(" ")[0]}</a>
      `),
    }),
  ]);
}

/* ── Volunteer emails ────────────────────────────────────────────── */
export async function sendVolunteerEmails({ name, email, phone, location, pathway, availability, skills, why }) {
  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: email,
      subject: "Application received — Ngogbehei Cancer Center",
      html: shell(`
        <h2>Thank you, ${name.split(" ")[0]}!</h2>
        <p class="sub">Your volunteer application has been received. We'll review it and reach out within 5 business days.</p>
        <div class="row"><div class="lbl">Your chosen pathway</div><div class="val"><span class="pill blue">${pathway}</span></div></div>
        ${availability ? `<div class="row"><div class="lbl">Availability</div><div class="val">${availability}</div></div>` : ""}
        <div class="divider"></div>
        <p style="font-size:13px;color:#64748B;">While you wait, explore our <a href="https://ngogbeheicc.org/impact" style="color:#059669">impact page</a> to see the difference volunteers like you are making.</p>
      `),
    }),
    resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `🙋 New Volunteer: ${name} — ${pathway}`,
      html: shell(`
        <h2>New Volunteer Application</h2>
        <p class="sub">Received just now from the volunteer form.</p>
        <div class="row"><div class="lbl">Name</div><div class="val">${name}</div></div>
        <div class="row"><div class="lbl">Email</div><div class="val"><a href="mailto:${email}" style="color:#059669">${email}</a></div></div>
        ${phone ? `<div class="row"><div class="lbl">Phone</div><div class="val">${phone}</div></div>` : ""}
        <div class="row"><div class="lbl">Location</div><div class="val">${location}</div></div>
        <div class="row"><div class="lbl">Pathway</div><div class="val"><span class="pill blue">${pathway}</span></div></div>
        ${availability ? `<div class="row"><div class="lbl">Availability</div><div class="val">${availability}</div></div>` : ""}
        ${skills ? `<div class="row"><div class="lbl">Skills</div><div class="msg-box">${skills}</div></div>` : ""}
        <div class="row"><div class="lbl">Why they want to volunteer</div><div class="msg-box">${why}</div></div>
        <a href="mailto:${email}" class="btn">Contact ${name.split(" ")[0]}</a>
      `),
    }),
  ]);
}

/* ── Donation emails ─────────────────────────────────────────────── */
export async function sendDonationEmails({ name, email, amount, currency, frequency, dedicate, dedicatee }) {
  const symbols = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };
  const sym = symbols[currency] || currency;
  const displayAmt = `${sym}${Number(amount).toLocaleString()}`;
  const freqLabel = frequency === "monthly" ? "Monthly recurring" : "One-time";

  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: email,
      subject: `Thank you for your donation — Ngogbehei Cancer Center`,
      html: shell(`
        <h2>Thank you, ${name.split(" ")[0]}!</h2>
        <p class="sub">Your generous donation is being processed. You'll receive a payment confirmation separately.</p>
        <div class="row"><div class="lbl">Amount</div><div class="val" style="font-size:28px;font-weight:900;color:#059669">${displayAmt}</div></div>
        <div class="row"><div class="lbl">Frequency</div><div class="val"><span class="pill ${frequency === "monthly" ? "blue" : "green"}">${freqLabel}</span></div></div>
        ${dedicate && dedicatee ? `<div class="row"><div class="lbl">Dedicated to</div><div class="msg-box" style="font-style:italic">"${dedicatee}"</div></div>` : ""}
        <div class="divider"></div>
        <p style="font-size:13px;color:#64748B;">Every donation brings us one step closer to a cancer-aware Africa. <strong>100% of your gift goes directly to outreach, screenings, and patient support.</strong></p>
        <a href="https://ngogbeheicc.org/impact" class="btn">See your impact →</a>
      `),
    }),
    resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `💚 New Donation: ${displayAmt} from ${name}`,
      html: shell(`
        <h2>New Donation Received</h2>
        <p class="sub">Received just now from the donation form.</p>
        <div class="row"><div class="lbl">Donor</div><div class="val">${name}</div></div>
        <div class="row"><div class="lbl">Email</div><div class="val"><a href="mailto:${email}" style="color:#059669">${email}</a></div></div>
        <div class="row"><div class="lbl">Amount</div><div class="val" style="font-size:24px;font-weight:900;color:#D97706">${displayAmt} ${currency}</div></div>
        <div class="row"><div class="lbl">Frequency</div><div class="val"><span class="pill ${frequency === "monthly" ? "blue" : "green"}">${freqLabel}</span></div></div>
        ${dedicate && dedicatee ? `<div class="row"><div class="lbl">Dedicated to</div><div class="msg-box" style="font-style:italic">"${dedicatee}"</div></div>` : ""}
      `),
    }),
  ]);
}

/* ── Newsletter emails ───────────────────────────────────────────── */
export async function sendNewsletterEmails({ name, email, phone, message }) {
  const displayName = name || "friend";
  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're connected — Ngogbehei Cancer Center",
      html: shell(`
        <h2>Welcome, ${displayName.split(" ")[0]}!</h2>
        <p class="sub">Thank you for getting in touch. Our team will respond to your message within 24 hours.</p>
        ${message ? `<div class="row"><div class="lbl">Your message</div><div class="msg-box">${message}</div></div>` : ""}
        <div class="divider"></div>
        <p style="font-size:13px;color:#64748B;">In the meantime, explore our <a href="https://ngogbeheicc.org" style="color:#059669">website</a> to learn more about our programs and how to get involved.</p>
      `),
    }),
    resend.emails.send({
      from: FROM,
      to: ADMIN,
      subject: `📮 New Subscriber: ${name || email}`,
      html: shell(`
        <h2>New Subscriber / Footer Contact</h2>
        <p class="sub">Received from the website footer contact form.</p>
        <div class="row"><div class="lbl">Name</div><div class="val">${name || "—"}</div></div>
        <div class="row"><div class="lbl">Email</div><div class="val"><a href="mailto:${email}" style="color:#059669">${email}</a></div></div>
        ${phone ? `<div class="row"><div class="lbl">Phone</div><div class="val">${phone}</div></div>` : ""}
        ${message ? `<div class="row"><div class="lbl">Message</div><div class="msg-box">${message}</div></div>` : ""}
        <a href="mailto:${email}" class="btn">Reply</a>
      `),
    }),
  ]);
}
