
const mongoose = require('mongoose');
const { sendEmail } = require('../utils/emailService');
const Transaction = require('../models/Transaction');
require('dotenv').config();

const sendSummaryMail = async (targetEmail) => {
    console.log('Generating premium daily summary report...');
    const emailToUse = targetEmail || "srisrikanthtvs@gmail.com";

    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error('DB Connection Failed', error);
        return;
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const transactions = await Transaction.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const incomeTransactions = transactions.filter(t => t.type === 'income');
        const expenseTransactions = transactions.filter(t => t.type === 'expense');

        const totalIncome = incomeTransactions.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpense = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);
        const balance = totalIncome - totalExpense;

        const subject = `✨ Money Insight: Your Daily Report for ${startOfDay.toLocaleDateString('en-IN')}`;

        let txRows = transactions.map(t => `
            <tr>
                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; color: #334155;">
                    <div style="font-weight: 600;">${t.title}</div>
                    <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">${t.category}</div>
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: ${t.type === 'income' ? '#10b981' : '#ef4444'};">
                    ${t.type === 'income' ? '+' : '-'} ₹${t.amount.toLocaleString('en-IN')}
                </td>
            </tr>
        `).join('');

        if (transactions.length === 0) {
            txRows = `<tr><td colspan="2" style="padding: 40px; text-align: center; color: #94a3b8; font-style: italic;">No transactions recorded today. Time to plan for tomorrow!</td></tr>`;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Daily Summary</title>
                <style>
                    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
                    .wrapper { padding: 40px 10px; }
                    .container { max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                    .header { background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 40px 30px; text-align: center; color: white; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
                    .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
                    .content { padding: 30px; }
                    .stats-grid { display: block; margin-bottom: 30px; }
                    .stat-item { padding: 20px; border-radius: 16px; margin-bottom: 15px; text-align: center; border: 1px solid transparent; }
                    .income-stat { background-color: #f0fdf4; border-color: #dcfce7; }
                    .expense-stat { background-color: #fef2f2; border-color: #fee2e2; }
                    .balance-box { background-color: #f0f9ff; border: 1px solid #e0f2fe; padding: 25px; border-radius: 20px; text-align: center; margin-bottom: 35px; }
                    .tx-table { width: 100%; border-collapse: collapse; }
                    .footer { padding: 30px; text-align: center; font-size: 13px; color: #94a3b8; background-color: #f8fafc; }
                    .status-tag { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="container">
                        <div class="header">
                            <h1>Financial Insight</h1>
                            <p>${startOfDay.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        
                        <div class="content">
                            <div class="balance-box">
                                <div style="font-size: 13px; color: #0284c7; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 8px;">Net Savings</div>
                                <div style="font-size: 36px; font-weight: 900; color: ${balance >= 0 ? '#0c4a6e' : '#991b1b'};">
                                    ₹${balance.toLocaleString('en-IN')}
                                </div>
                                <span class="status-tag" style="background: ${balance >= 0 ? '#dcfce7' : '#fee2e2'}; color: ${balance >= 0 ? '#166534' : '#991b1b'};">
                                    ${balance >= 0 ? '🏆 POSITIVE DAY' : '📉 OVER BUDGET'}
                                </span>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="48%" valign="top">
                                        <div class="stat-item income-stat">
                                            <div style="font-size: 11px; color: #16a34a; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Total Income</div>
                                            <div style="font-size: 20px; font-weight: 700; color: #166534;">₹${totalIncome.toLocaleString('en-IN')}</div>
                                        </div>
                                    </td>
                                    <td width="4%"></td>
                                    <td width="48%" valign="top">
                                        <div class="stat-item expense-stat">
                                            <div style="font-size: 11px; color: #dc2626; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Total Expense</div>
                                            <div style="font-size: 20px; font-weight: 700; color: #991b1b;">₹${totalExpense.toLocaleString('en-IN')}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 30px 0 15px 0;">Transaction Details</h3>
                            <table class="tx-table">
                                ${txRows}
                            </table>

                            <div style="margin-top: 40px; border-radius: 20px; background: #faf5ff; border: 1px solid #f3e8ff; padding: 25px; text-align: center;">
                                <div style="font-size: 24px; margin-bottom: 10px;">💡</div>
                                <p style="margin: 0; color: #581c87; font-size: 15px; line-height: 1.6; font-weight: 500;">
                                    ${balance > 0
                ? "You're building a strong future! Every rupee saved is a step toward financial freedom. Keep up the momentum!"
                : "Tracking your expenses is the first step to wealth. Let's try to focus on 'Needs' over 'Wants' tomorrow."}
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <strong>Money Manager Pro</strong><br>
                            This is an automated financial report based on your activity.<br>
                            Control your money, control your life.
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        await sendEmail(emailToUse, subject, htmlContent);

    } catch (error) {
        console.error('Error in Summary Mail:', error);
    } finally {
        await mongoose.disconnect();
    }
};

const targetEmail = process.argv[2];
sendSummaryMail(targetEmail);
