const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult'); // Import TestResult model

// Add a test result
router.post('/', async (req, res) => {
    const testResult = new TestResult(req.body);
    try {
        await testResult.save();
        res.status(201).send({ message: 'Test result saved' });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get a user's test results
router.get('/', async (req, res) => {
    try {
        const testResults = await TestResult.find({ userId: req.query.userId });
        res.send(testResults);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try{
        await TestResult.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Test result deleted' });
    } catch (err){
        res.status(400).send(err);
    }
});

module.exports = router;
