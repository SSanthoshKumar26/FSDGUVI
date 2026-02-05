const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
    const { title, amount, category, description, date, type, division, paymentMethod } = req.body;

    const transaction = Transaction({
        title,
        amount,
        category,
        description,
        date,
        type,
        division,
        paymentMethod
    });

    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }
        await transaction.save();
        res.status(200).json({ message: 'Transaction Added' });
    } catch (error) {
        console.error("Add Transaction Error Payload:", req.body);
        console.error("Add Transaction Error:", error);
        res.status(500).json({ message: error.message });
    }
}

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    Transaction.findByIdAndDelete(id)
        .then((result) => {
            res.status(200).json({ message: 'Transaction Deleted' });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Server Error' });
        })
}

exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        // Check 12-hour restriction
        const createdTime = new Date(transaction.createdAt).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - createdTime) / (1000 * 60 * 60);

        if (hoursDiff > 12) {
            return res.status(403).json({ message: "Editing is restricted after 12 hours." });
        }

        Object.assign(transaction, updates);
        await transaction.save();
        res.status(200).json({ message: "Transaction updated", transaction });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
