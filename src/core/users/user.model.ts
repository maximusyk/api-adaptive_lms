import { model, Model, Schema, Types } from 'mongoose';
import { IUser } from '../../types';

const UserSchema: Schema = new Schema({
    profile_name: {
        type: String,
        required: true,
    },
    profile_picture: { type: String },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: 'student',
        enum: ['student', 'instructor', 'admin'],
    },
    progress: [
        {
            course: {
                type: Types.ObjectId,
                ref: 'courses',
            },
            value: {
                type: Number,
                default: 0,
            },
        },
    ],
    class: {
        ref: 'classes',
        type: Types.ObjectId,
    },
});
UserSchema.pre('save', function (next) {
    if (!this.username || !this.username.length)
        this.set({
            username: this.profile_name.toLowerCase().replace(' ', '.'),
        });
    next();
});

export const User: Model<IUser> = model('users', UserSchema);