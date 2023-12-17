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
        default: false
    },
    role: {
        type: String,
        required: false,
        enum: ['admin', 'specialist'],
        default: 'specialist'
    },
    events : [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    asignedPatients : [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
},
    { timestamps: true }
);

const User = models.User || mongoose.model('User', userSchema);

export default User;