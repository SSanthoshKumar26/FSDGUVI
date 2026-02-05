const Transaction = require('../models/Transaction');
const axios = require('axios');

exports.addTransaction = async (req, res) => {
    console.log("🔹 /add-transaction Hit");
    console.log("🔹 Request Body:", req.body);

    const { title, amount, category, description, date, type, division, paymentMethod, email, userId } = req.body;

    if (!title || !category || !description || !date || !amount || !type) {
        console.warn("⚠️ Validation Failed. Missing fields.");
        return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    try {
        // Create and save transaction
        const transaction = new Transaction({
            title, amount, category, description, date, type,
            division, paymentMethod, userId: userId || 'anonymous',
            status: 'pending'
        });

        const savedTransaction = await transaction.save();
        console.log("✅ Transaction Saved:", savedTransaction._id);

        // Send email if provided
        if (email) {
            console.log("📨 Email provided. Sending via EmailJS...");
            const emailData = {
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    to_email: email,
                    user_id: userId || 'User',
                    transaction_id: savedTransaction._id,
                    amount,
                    title,
                    date: new Date(date).toLocaleDateString()
                }
            };

            try {
                const emailResponse = await axios.post(
                    'https://api.emailjs.com/api/v1.0/email/send',
                    emailData,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                console.log("📧 EmailJS Response:", emailResponse.data, emailResponse.status);

                savedTransaction.status = 'success';
                await savedTransaction.save();

            } catch (emailErr) {
                console.error("❌ EmailJS Error:", emailErr.response?.data || emailErr.message);
                return res.status(500).json({
                    success: false,
                    message: "Transaction saved but email sending failed.",
                    error: emailErr.response?.data || emailErr.message
                });
            }
        } else {
            // No email provided, just mark success
            savedTransaction.status = 'success';
            await savedTransaction.save();
        }

        return res.status(200).json({
            success: true,
            message: "Transaction added successfully!",
            data: savedTransaction
        });

    } catch (err) {
        console.error("❌ Transaction Failed:", err.message);
        return res.status(500).json({ success: false, message: err.message || "Server Error" });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ message: "Transaction Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Transaction Updated", data: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
