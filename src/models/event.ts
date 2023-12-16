import mongoose, { Schema, models } from 'mongoose'

var eventSchema = new Schema({
  _creator: { type: String, ref: 'User' },
  _asignTo: { type: String},
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const Event = models.Event || mongoose.model('Event', eventSchema);

export default Event;