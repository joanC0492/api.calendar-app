import { formatRelativeWithOptions } from "date-fns/fp";
import { Request, Response } from "express";
import EventModel from "../models/event.model";

const getEvents = async (req: Request, res: Response) => {
  // Retorna un array con los eventos
  // Como tenemos el usuario por referencia, para mostrar sus datos completos usamos "populate"
  // El _id siempre viene
  // Si queremos solo el nombre lo pasamos por parametro
  // Si quisieramos mas de uno seria asi: "name password"
  const events = await EventModel.find().populate("user", "name");

  console.log("getEvents");
  res.json({
    ok: true,
    events: events,
  });
};

const createEvent = async (req: Request, res: Response) => {
  const { uid, name, ...body } = req.body;
  const event = new EventModel(body);
  try {
    event.user = uid;
    const savedEvent = await event.save();
    res.json({
      ok: true,
      event: savedEvent,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateEvent = async (req: Request, res: Response) => {
  const { uid, name, ...body } = req.body;
  const eventId = req.params.id;
  console.log("eventId", eventId);
  try {
    const event = await EventModel.findById(eventId);
    // Validamos si el codigo existe
    // Cuando un elemento no existe se retorna 404
    if (!event)
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });

    // Validamos si tiene permisos
    // Cuando no esta autorizado se retorna 401
    if (event.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para editar este evento",
      });

    // Ahora que validamos que el codigo existe y tiene permisos
    // Actualizaremos la coleccion con dicho ID
    const newEvent = {
      ...body,
      user: uid,
    };
    // El tercer argumento es para que muestre en la respuesta los datos actualizados
    // {new: true}
    const eventUpdated = await EventModel.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    return res.json({
      ok: true,
      event: eventUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: formatRelativeWithOptions,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  const { uid, name, ...body } = req.body;
  const eventId = req.params.id;
  try {
    const event = await EventModel.findById(eventId);

    if (!event)
      return res.status(404).json({
        ok: false,
        msg: "No se encuentra el id ingresado",
      });

    if (event.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para eliminar este evento",
      });

    await EventModel.findByIdAndDelete(eventId);
    return res.json({ ok: true });    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,      
      msg: "Hable con el administrador",
    });
  }

  // res.json({
  //   ok: true,
  //   msg: "deleteEvent",
  // });
};

export { getEvents, createEvent, updateEvent, deleteEvent };
