import mongoose, { Schema, models } from 'mongoose'

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        required: false
    },
    events : [{ type: Schema.Types.ObjectId, ref: 'Event' }]
},
    { timestamps: true }
);

const User = models.User || mongoose.model('User', userSchema);

export default User;