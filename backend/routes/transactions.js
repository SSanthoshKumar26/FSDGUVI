const router = require('express').Router();
const { addTransaction, getTransactions, deleteTransaction, updateTransaction } = require('../controllers/transaction');

router.post('/add-transaction', addTransaction);
router.get('/get-transactions', getTransactions);
router.delete('/delete-transaction/:id', deleteTransaction);
router.put('/update-transaction/:id', updateTransaction);

module.exports = router;
