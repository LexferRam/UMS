import mongoose, { Schema, models } from 'mongoose'

const reportSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    associatedEvent: {
        type: Schema.Types.ObjectId,
        ref: 'Event', required: true
    },
},
    { timestamps: true }
);

const Report = models.Report || mongoose.model('Report', reportSchema);

export default Report;