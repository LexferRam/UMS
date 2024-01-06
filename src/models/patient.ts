import mongoose, { Schema, models } from 'mongoose'

const patientSchema = new Schema({
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
    historyDescription: {
        type: String,
        required: false
    },
    reports : [{ type: Schema.Types.ObjectId, ref: 'Report' }]
},
    { timestamps: true }
);

const Patient = models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;