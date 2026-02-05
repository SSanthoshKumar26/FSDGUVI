
const { exec } = require('child_process');
const path = require('path');

exports.sendMotivationMailTrigger = (req, res) => {
    const scriptPath = path.join(__dirname, '../scripts/motivationMail.js');
    exec(`node ${scriptPath}`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error triggering motivation mail:', err);
            return res.status(500).json({ message: 'Failed to send motivation email', error: err.message });
        }
        res.status(200).json({ message: 'Motivation email triggered successfully', output: stdout });
    });
};

exports.sendSummaryMailTrigger = (req, res) => {
    const { email } = req.body;
    const scriptPath = path.join(__dirname, '../scripts/summaryMail.js');

    // Construct command, passing email as argument if provided
    const command = email ? `node ${scriptPath} "${email}"` : `node ${scriptPath}`;

    exec(command, (err, stdout, stderr) => {
        if (stdout) console.log('📝 Mail Script Output:', stdout);
        if (stderr) console.error('⚠️ Mail Script Error Output:', stderr);

        if (err) {
            console.error('Error triggering summary mail:', err);
            return res.status(500).json({ message: 'Failed to send summary email', error: err.message, output: stdout });
        }
        res.status(200).json({ message: 'Summary email triggered successfully', output: stdout });
    });
};
