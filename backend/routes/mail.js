
const router = require('express').Router();
const { sendMotivationMailTrigger, sendSummaryMailTrigger } = require('../controllers/mail');

router.post('/trigger-motivation', sendMotivationMailTrigger);
router.post('/trigger-summary', sendSummaryMailTrigger);

module.exports = router;
