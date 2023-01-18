/*
  Rutas de eventos
  host + api/events
*/
import { Router } from "express";
import { check } from "express-validator";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../controllers";
import { isDate } from "../helpers";
import { fieldsValidate, jwtValidate } from "../middlewares";

const router: Router = Router();

// Todas tienen que tener validacion del JWT
// Con el "use" nos evitamos agregar a cada ruta
// Si quisieramos alguna ruta publica debera ir por encima del router.use
router.use(jwtValidate);

router.get("/", getEvents);

router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es incorrecta").custom(isDate),
    check("end", "La fecha de finalizacion es incorrecta").custom(isDate),
    fieldsValidate,
  ],
  createEvent
);

router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es incorrecta").custom(isDate),
    check("end", "Fecha de finalización es incorrecta").custom(isDate),
    fieldsValidate,
  ],
  updateEvent
);

router.delete("/:id", deleteEvent);

export default router;