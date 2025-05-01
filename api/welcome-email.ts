// api/welcome-email.ts
export default async function handler(req: Request) {
    const { email, role } = await req.json();
  
    const apiKey = process.env.SENDGRID_API_KEY!;
    const from = 'no-reply@merchconsign.com';
    const subject = 'Welcome to MerchConsign';
    const text = `Hey there 👋\n\nThanks for signing up as a ${role}!\nWe're excited to have you.`
  
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: from },
        subject,
        content: [{ type: 'text/plain', value: text }],
      }),
    });
  
    if (!response.ok) {
      return new Response(`SendGrid error: ${await response.text()}`, { status: 500 });
    }
  
    return new Response('Email sent', { status: 200 });
  }
  