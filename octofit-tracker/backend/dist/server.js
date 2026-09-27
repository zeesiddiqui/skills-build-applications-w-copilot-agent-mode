import express from 'express';
import dotenv from 'dotenv';
import './config/database.js';
import { Activity, Team, User, Workout } from './models/fitness.js';
dotenv.config();
const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin === '*' ? '*' : origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json());
app.get('/api/users', async (_req, res) => {
    try {
        const users = await User.find().sort({ points: -1, name: 1 }).lean();
        res.json({ success: true, baseUrl: apiBaseUrl, data: users });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});
app.get('/api/activities', async (_req, res) => {
    try {
        const activities = await Activity.find().sort({ date: -1 }).populate('userId', 'name email').lean();
        res.json({ success: true, baseUrl: apiBaseUrl, data: activities });
    }
    catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch activities' });
    }
});
app.get('/api/teams', async (_req, res) => {
    try {
        const teams = await Team.find().populate('captainId', 'name email').lean();
        res.json({ success: true, baseUrl: apiBaseUrl, data: teams });
    }
    catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch teams' });
    }
});
app.get('/api/leaderboard', async (_req, res) => {
    try {
        const leaderboard = await User.find().sort({ points: -1 }).select('name email points role').lean();
        res.json({ success: true, baseUrl: apiBaseUrl, data: leaderboard });
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
    }
});
app.get('/api/workouts', async (_req, res) => {
    try {
        const workouts = await Workout.find().sort({ createdAt: 1 }).lean();
        res.json({ success: true, baseUrl: apiBaseUrl, data: workouts });
    }
    catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch workouts' });
    }
});
app.listen(port, () => {
    console.log(`OctoFit API listening on ${apiBaseUrl}`);
});
