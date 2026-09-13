export default async function handler(req, res) {
    // 1. GET THE HIDDEN TOKENS SECURELY FROM VERCEL
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 2. CATCH THE FORM SUBMISSION DATA
    const messageText = "New submission received by proxy!";
    const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

    try {
        // 3. FORWARD THE DATA TO TELEGRAM
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, message: "Sent to Telegram!" });
        } else {
            return res.status(400).json({ success: false, error: data.description });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
