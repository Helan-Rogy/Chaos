const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Path to the python script (assuming backend is inside ChaosZen folder)
const SCRIPT_PATH = path.join(__dirname, '..', 'engine', 'optimization_engine.py');
const PYTHON_CMD = process.platform === 'win32' ? 'python' : 'python3';

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Optimization Simulation Endpoint
app.post('/api/optimize', (req, res) => {
    const { budget = 50000000, alpha = 0.6 } = req.body;

    console.log(`Running simulation -> Budget: ₹${budget}, Alpha: ${alpha}`);

    // Spawn the python process with the correct arguments to output JSON
    const pythonProcess = spawn(PYTHON_CMD, [
        SCRIPT_PATH,
        '--budget', budget.toString(),
        '--alpha', alpha.toString(),
        '--json-out'
    ], {
        // Set cwd to the parent directory where the CSVs live
        cwd: path.join(__dirname, '..')
    });

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error(errorString);
            return res.status(500).json({ error: 'Simulation failed', details: errorString });
        }

        try {
            // Find the JSON block if there are leftover print statements
            // The python script should now output cleanly because of --json-out
            const startIndex = dataString.indexOf('{');
            const jsonStr = dataString.substring(startIndex);
            const result = JSON.parse(jsonStr);
            res.json(result);
        } catch (e) {
            console.error("Failed to parse JSON from Python output.");
            console.error("Output was:", dataString);
            res.status(500).json({ error: 'Failed to parse simulation results', output: dataString });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
