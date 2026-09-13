export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send("Method not allowed");
    }

    // 1. GET THE HIDDEN TOKENS SECURELY FROM VERCEL
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    try {
        // 2. NATIVELY PARSE THE FORM SUBMISSION DATA WITHOUT EXTERNAL PACKAGES
        let formData = req.body;
        if (typeof formData === 'string') {
            const params = new URLSearchParams(formData);
            formData = Object.fromEntries(params.entries());
        }

        const userName = formData.name || "Anonymous";
        const userEmail = formData.email || "No email provided";
        const userMessage = formData.message || "No message provided";

        // 3. CONSTRUCT THE ALERT TEXT FOR TELEGRAM
        const messageText = `📩 *New Proxy Submission*\n\n*Name:* ${userName}\n*Email:* ${userEmail}\n*Message:* ${userMessage}`;
        const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

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
            return res.status(200).send("<h1>Success!</h1><p>Your message was sent to Telegram safely.</p><a href='/'>Go Back</a>");
        } else {
            return res.status(400).send(`<h1>Telegram Error</h1><p>${data.description}</p>`);
        }
    } catch (error) {
        return res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
}
