export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { message } = req.body;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,  // ← tu API key guardada en Vercel
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 300,
                system: `Eres FreddyBot...`, // personalidad del bot
                messages: [{ role: 'user', content: message }]
            })
        });

        const data = await response.json();
        const text = data.content?.[0]?.text || '¡Ups!';
        res.status(200).json({ reply: text });

    } catch (error) {
        res.status(500).json({ reply: '¡Error de sistema! 🛠️' });
    }
}