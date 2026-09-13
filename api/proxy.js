// This parses standard HTML form data automatically
import querystring from 'querystring';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    // 1. GET THE HIDDEN TOKENS SECURELY FROM VERCEL
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 2. PARSE THE SUBMITTED HTML FORM DATA
    let body = req.body;
    if (typeof body === 'string') {
        body = querystring.parse(body);
    }

    const userName = body.name || "Anonymous";
    const userMessage = body.message || "No message provided";

    // 3. CONSTRUCT THE ALERTS TEXT FOR TELEGRAM
    const messageText = `📩 *New Proxy Submission*\n\n*Name:* ${userName}\n*Message:* ${userMessage}`;
    const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

    try {
        // 4. FORWARD THE DATA TO TELEGRAM
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Send a clean success message back to the web browser browser
            return res.status(200).send("<h1>Success!</h1><p>Your message was sent to Telegram safely.</p><a href='/'>Go Back</a>");
        } else {
            return res.status(400).send(`<h1>Error</h1><p>${data.description}</p>`);
        }
    } catch (error) {
        return res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
}
