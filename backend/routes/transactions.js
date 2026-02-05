const router = require('express').Router();
const { addTransaction, getTransactions, deleteTransaction, updateTransaction } = require('../controllers/transaction');

router.post('/add-transaction', addTransaction)
    .get('/get-transactions', getTransactions)
    .delete('/delete-transaction/:id', deleteTransaction)
    .put('/update-transaction/:id', updateTransaction); // Added update route

module.exports = router;
