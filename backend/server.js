const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

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

// GET synthetic data
app.get('/api/data', (req, res) => {
    const msmeResults = [];
    const schemesResults = [];
    const msmePath = path.join(__dirname, '..', 'data', 'msme_data.csv');
    const schemesPath = path.join(__dirname, '..', 'data', 'schemes_data.csv');

    if (!fs.existsSync(msmePath) || !fs.existsSync(schemesPath)) {
        return res.status(404).json({ error: "Data files not found." });
    }

    fs.createReadStream(msmePath)
        .pipe(csv())
        .on('data', (data) => {
            if (msmeResults.length < 50) msmeResults.push(data); // Limit to 50 for UI
        })
        .on('end', () => {
            fs.createReadStream(schemesPath)
                .pipe(csv())
                .on('data', (data) => schemesResults.push(data))
                .on('end', () => {
                    res.json({ msme: msmeResults, schemes: schemesResults });
                });
        });
});

// GET model evaluation metrics
app.get('/api/metrics', (req, res) => {
    const reportPath = path.join(__dirname, '..', 'reports', 'phase2_evaluation.txt');
    if (fs.existsSync(reportPath)) {
        const content = fs.readFileSync(reportPath, 'utf8');
        res.json({ content });
    } else {
        res.status(404).json({ error: "Report not found" });
    }
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

// GET /api/search?q=<query>
app.get('/api/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    const results = [];
    const predictionsPath = path.join(__dirname, '..', 'data', 'msme_predictions.csv');

    if (!fs.existsSync(predictionsPath)) {
        return res.status(404).json({ error: "Predictions data not found. Run growth_model.py first." });
    }

    fs.createReadStream(predictionsPath)
        .pipe(csv())
        .on('data', (data) => {
            const match = !query || query === '*' ||
                data.MSME_ID.toLowerCase().includes(query) ||
                data.Sector.toLowerCase().includes(query) ||
                data.Location_Type.toLowerCase().includes(query) ||
                data.Predicted_Growth_Category.toLowerCase().includes(query);

            if (match && results.length < 30) {
                results.push(data);
            }
        })
        .on('end', () => {
            res.json(results);
        });
});

// GET /api/msme/:id/schemes
app.get('/api/msme/:id/schemes', (req, res) => {
    const msmeId = req.params.id;
    const results = [];
    const eligibilityPath = path.join(__dirname, '..', 'data', 'scheme_eligibility_results.csv');

    if (!fs.existsSync(eligibilityPath)) {
        return res.status(404).json({ error: "Eligibility data not found. Run scheme_eligibility.py first." });
    }

    fs.createReadStream(eligibilityPath)
        .pipe(csv())
        .on('data', (data) => {
            if (data.MSME_ID === msmeId && data.Simulation_Type === 'Single_Scheme') {
                results.push(data);
            }
        })
        .on('end', () => {
            if (results.length === 0) {
                return res.json([]);
            }

            // Flag the recommended one (highest Revenue_Increase_Pct)
            let maxRevIdx = 0;
            for (let i = 1; i < results.length; i++) {
                if (parseFloat(results[i].Revenue_Increase_Pct) > parseFloat(results[maxRevIdx].Revenue_Increase_Pct)) {
                    maxRevIdx = i;
                }
            }

            const processed = results.map((r, i) => ({
                ...r,
                is_recommended: i === maxRevIdx
            }));

            res.json(processed);
        });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
