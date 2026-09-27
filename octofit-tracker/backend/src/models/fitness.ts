import mongoose, { Schema, model, Model, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['admin', 'member', 'coach'],
      default: 'member',
    },
    points: { type: Number, default: 0 },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  },
  { timestamps: true },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: '#19a974' },
    captainId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['run', 'walk', 'strength', 'cycling', 'yoga'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    calories: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true },
    focus: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    description: { type: String, default: '' },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export type TeamDocument = InferSchemaType<typeof teamSchema>;
export type ActivityDocument = InferSchemaType<typeof activitySchema>;
export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;

export const User: Model<UserDocument> = mongoose.models.User || model('User', userSchema);
export const Team: Model<TeamDocument> = mongoose.models.Team || model('Team', teamSchema);
export const Activity: Model<ActivityDocument> = mongoose.models.Activity || model('Activity', activitySchema);
export const Workout: Model<WorkoutDocument> = mongoose.models.Workout || model('Workout', workoutSchema);
