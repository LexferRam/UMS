import mongoose, { Schema, models } from 'mongoose'

var eventSchema = new Schema({
  _creator: {
    type: String,
    ref: 'User'
  },
  _asignTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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
    type: Schema.Types.ObjectId,
    ref: 'Patient'
  },
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report'
  }],
  eventType:{
    type: String,
    required: true   
  },
  freq: {
    type: String,
    required: true
  },
  byweekday: {
    type: Array,
    required: true
  },
});

const Event = models.Event || mongoose.model('Event', eventSchema);

export default Event;