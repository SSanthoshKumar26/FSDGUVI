const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: String, default: 'anonymous' },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    paymentMethod: { type: String, default: 'Cash' },
    division: { type: String, default: 'Personal' },
    emotion: { type: String, default: 'neutral' },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
