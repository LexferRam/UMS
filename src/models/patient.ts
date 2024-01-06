import mongoose, { Schema, models } from 'mongoose'

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: false
    },
    historyDescription: {
        type: String,
        required: false
    },
    reports : [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

const Patient = models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;