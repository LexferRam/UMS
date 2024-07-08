import mongoose, { Schema, models } from 'mongoose'

const reportSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    associatedEvent: {
        type: Schema.Types.ObjectId,
        ref: 'Event', required: true
    },
    createdAt: { type: Date, default: Date.now },
    isForEventCancel: { 
        type: Boolean, 
        required: false
    },
    // indica que el reporte pertenece a una cita que fue cancelada y por defecto aplica una recuperacion
    hasRecovery: { 
        type: Boolean, 
        required: false
    },
    recoveredEvents:{
        type: Array,
        require: false
    }
},
    { timestamps: true }
);

const Report = models.Report || mongoose.model('Report', reportSchema);

export default Report;