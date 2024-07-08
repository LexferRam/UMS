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
    type: Boolean,
    require: false
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
  // associatedCancelledEventId:{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Event',
  //   require: false
  // },
  // indicador booleano que dice si un evento es de recuperacion
  recoverEvent:{
    type: Boolean,
    require: false
  },
  // ID de un reporte de un evento cancelado
  reportOfCancelEventID: {
    type: Schema.Types.ObjectId,
    ref: 'Report',
    require: false
  }
});

const Event = models.Event || mongoose.model('Event', eventSchema);

export default Event;