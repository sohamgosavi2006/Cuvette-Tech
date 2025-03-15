const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const path = require("path");

const app = express();
const PORT = 1000;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/docs')));

// PostgreSQL Connection
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 3000, // SET YOUR DATABASE PORT
    password: "2255", // SET YOUR DATABASE PASSWORD
    database: "cuvette_tech" // SET YOUR DATABASE NAME
});

client.connect()
    .then(() => console.log("Connected to PostgreSQL Database"))
    .catch(err => {
        console.error("Database connection failed:", err.stack);
        process.exit(1); // Exit if connection fails
    });

// API Endpoint to Fetch Full-Time Jobs (tech_jobs table)
app.get("/api/jobs", async (req, res) => {
    try {
        // Ensure the client is connected before querying
        if (!client._connected) {
            throw new Error("Database connection is not active");
        }
        const result = await client.query("SELECT * FROM tech_jobs");
        res.json(result.rows);
    } catch (error) {
        console.error(" Error fetching full-time jobs:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API Endpoint to Fetch Other Jobs (other_jobs table)
app.get("/api/other-jobs", async (req, res) => {
    try {
        // Ensure the client is connected before querying
        if (!client._connected) {
            throw new Error("Database connection is not active");
        }
        const result = await client.query("SELECT * FROM other_jobs");
        res.json(result.rows);
    } catch (error) {
        console.error(" Error fetching other jobs:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
