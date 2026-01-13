// server.js - Backend for Echo Buddy 🌱
// Beginner-friendly Node + Express + MongoDB server

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;


// Middleware
app.use(cors());         // Allows frontend to access backend
app.use(express.json()); // Parses JSON from POST requests

// ---------------------------
// MongoDB connection
// Replace USERNAME:PASSWORD with your Atlas credentials
const uri = "mongodb+srv://synthiarosenberger_db_user:BROFlFKqgTZ1S3sc@cluster0.utpgxcn.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);
let db;

// Connect to MongoDB and initialize data
async function connectDB() {
    try {
        await client.connect();
        db = client.db("EcoApp"); 
        console.log("✅ Connected to MongoDB");

        await initializeData();
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

// ---------------------------
// Pre-fill sample tasks and a user if they don't exist
async function initializeData() {
    const tasks = [
        { title: "Recycle 3 items", completedBy: [], points: 5 },
        { title: "Walk instead of commuting", completedBy: [], points: 5 },
        { title: "Reuse something before throwing away", completedBy: [], points: 5 },
        { title: "Turn off all lights in your house", completedBy: [], points: 5 }
    ];

    const user = { name: "Synthia", level: 1, happiness: 50 };

    const tasksCount = await db.collection('tasks').countDocuments();
    if (tasksCount === 0) {
        await db.collection('tasks').insertMany(tasks);
        console.log("✅ Sample tasks inserted");
    }

    const usersCount = await db.collection('users').countDocuments();
    if (usersCount === 0) {
        const result = await db.collection('users').insertOne(user);
        console.log("✅ Sample user inserted with _id:", result.insertedId);
    }
}

connectDB();

// ---------------------------
// Test route
// app.get('/', (req, res) => {
//     res.send("EcoApp backend is running 🌱");
// });
app.use(express.static( '../frontend'))
// ---------------------------
// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

// ---------------------------
// GET all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await db.collection('tasks').find().toArray();
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching tasks');
    }
});

// ---------------------------
// POST /tasks/complete - mark task as completed
app.post('/tasks/complete', async (req, res) => {
    const { taskId, userId } = req.body;

    try {
        const taskObjectId = new ObjectId(taskId);
        const userObjectId = new ObjectId(userId);

        // Add user to task's completedBy array
        await db.collection('tasks').updateOne(
            { _id: taskObjectId },
            { $addToSet: { completedBy: userId } }
        );

        // Increase user happiness by 10 points
        await db.collection('users').updateOne(
            { _id: userObjectId },
            { $inc: { happiness: 10 } }
        );

        res.send('Task completed!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error completing task');
    }
});

// ---------------------------
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

