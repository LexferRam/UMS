import mongoose, { Schema, models } from 'mongoose'

var eventSchema = new Schema({
  _creator: {
    type: String,
    ref: 'User'
  },
  _asignTo: { type: String },
  title: {
    type: String,
    required: true
  },
  eventStatus: {
    type: Boolean
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  patient: {
    type: String,
    required: true
  },
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report'
  }],
});

const Event = models.Event || mongoose.model('Event', eventSchema);

export default Event;