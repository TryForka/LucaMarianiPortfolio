import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Luca Films <onboarding@resend.dev>",
      to: "lucafilmsbusiness@gmail.com",
      replyTo: email,
      subject: `[LUCA FILMS] ${subject}`,
      html: `
        <div style="font-family:monospace;background:#0d0d0d;color:#fff;padding:32px;max-width:600px;">
          <p style="color:#666;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:24px;">LUCA FILMS · NEW INQUIRY</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#666;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;width:80px;">NAME</td>
              <td style="padding:8px 0;color:#fff;font-size:14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">EMAIL</td>
              <td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}" style="color:#fff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#666;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">SUBJECT</td>
              <td style="padding:8px 0;color:#fff;font-size:14px;">${subject}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
          <p style="color:#666;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:12px;">MESSAGE</p>
          <p style="color:#ddd;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
          <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
          <p style="color:#444;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;">LUCAFILMS · CHICAGO · 2026</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
