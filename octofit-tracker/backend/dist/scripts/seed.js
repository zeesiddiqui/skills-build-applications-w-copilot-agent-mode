import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models/fitness.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            User.deleteMany({}),
            Team.deleteMany({}),
            Activity.deleteMany({}),
            Workout.deleteMany({}),
        ]);
        const users = await User.insertMany([
            { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', points: 920 },
            { name: 'Marcus Lee', email: 'marcus@example.com', role: 'member', points: 760 },
            { name: 'Priya Patel', email: 'priya@example.com', role: 'member', points: 845 },
            { name: 'Jordan Smith', email: 'jordan@example.com', role: 'coach', points: 680 },
        ]);
        const teams = await Team.insertMany([
            { name: 'Blue Falcons', color: '#2d6cdf', captainId: users[0]._id },
            { name: 'Green Hawks', color: '#18a957', captainId: users[2]._id },
        ]);
        await User.updateMany({ _id: { $in: users.map((user) => user._id) } }, {
            $set: {
                teamId: teams[0]._id,
            },
        });
        await Activity.insertMany([
            {
                userId: users[0]._id,
                type: 'run',
                durationMinutes: 35,
                calories: 310,
                date: new Date('2026-09-27'),
            },
            {
                userId: users[1]._id,
                type: 'strength',
                durationMinutes: 42,
                calories: 280,
                date: new Date('2026-09-26'),
            },
            {
                userId: users[2]._id,
                type: 'walk',
                durationMinutes: 50,
                calories: 220,
                date: new Date('2026-09-25'),
            },
        ]);
        await Workout.insertMany([
            {
                title: 'Cardio Blast',
                focus: 'Endurance',
                durationMinutes: 20,
                difficulty: 'beginner',
                description: 'A brisk interval circuit to build stamina.',
            },
            {
                title: 'Strength Circuit',
                focus: 'Muscle Tone',
                durationMinutes: 30,
                difficulty: 'intermediate',
                description: 'Full-body bodyweight training with short rests.',
            },
        ]);
        console.log('Database seeding complete');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
