import { Schema, model } from "mongoose";
import { IEvent } from "../domain";

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

// Vamos a cambiar la manera en que se muestra el _id por id
EventSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// "nombre_de_la_coleccion"
const EventModel = model("events", EventSchema);
export default EventModel;

