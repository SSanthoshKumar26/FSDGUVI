
const axios = require('axios');
require('dotenv').config();

const quotes = [
    { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
    { text: "A penny saved is a penny earned.", author: "Benjamin Franklin" },
    { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
    { text: "It’s not your salary that makes you rich, it’s your spending habits.", author: "Charles A. Jaffe" },
    { text: "The art is not in making money, but in keeping it.", author: "Proverb" },
    { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
    { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
    { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
    { text: "You must gain control over your money or the lack of it will forever control you.", author: "Dave Ramsey" },
    { text: "Don’t tell me where your priorities are. Show me where you spend your money and I’ll tell you what they are.", author: "James W. Frick" }
];

const sendMotivationMail = async () => {
    console.log('Crafting premium motivation email...');

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const subject = "🚀 Ready for a Productive Day?";

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #0f172a; margin: 0; padding: 0; color: #f8fafc; }
                .wrapper { padding: 60px 20px; }
                .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 32px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,255,255,0.1); }
                .content { padding: 50px 40px; text-align: center; }
                .icon { font-size: 40px; margin-bottom: 20px; }
                .quote-text { font-size: 24px; line-height: 1.4; font-weight: 700; margin-bottom: 25px; color: #38bdf8; }
                .quote-author { font-size: 14px; text-transform: uppercase; letter-spacing: 3px; color: #94a3b8; font-weight: 600; }
                .hr { width: 40px; height: 3px; background: #38bdf8; margin: 30px auto; border-radius: 2px; }
                .cta { display: inline-block; padding: 14px 30px; background: #38bdf8; color: #0f172a; text-decoration: none; border-radius: 99px; font-weight: 800; font-size: 14px; margin-top: 10px; transition: transform 0.2s; }
                .footer { margin-top: 30px; text-align: center; color: #64748b; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="content">
                        <div class="icon">💎</div>
                        <div class="quote-text">"${randomQuote.text}"</div>
                        <div class="hr"></div>
                        <div class="quote-author">— ${randomQuote.author}</div>
                        <div style="margin-top: 40px;">
                            <a href="#" class="cta">TRACK YOUR PROGRESS</a>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <p>© 2024 Money Manager. Built for your success.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        const emailData = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                to_email: "srisrikanthtvs@gmail.com", // Or make this dynamic if needed
                subject: subject,
                message: htmlContent
            }
        };

        await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
        console.log('✅ Motivation Email sent via EmailJS');
    } catch (error) {
        console.error('EmailJS Error:', error.response?.data || error.message);
    }
};

sendMotivationMail();
