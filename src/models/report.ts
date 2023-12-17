import mongoose, { Schema, models } from 'mongoose'

const reportSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_bt: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

const Report = models.Report || mongoose.model('Report', reportSchema);

export default Report;