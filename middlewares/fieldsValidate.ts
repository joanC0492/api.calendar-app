import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/* El next hace que recorra cada validacion del arreglo, en caso todo este 
correcto, llegara al controlador*/
export const fieldsValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Manejo de errores
  // En caso no haya errores devuelve un array vacio
  const errors = validationResult(req);
  console.log(errors);
  // Si hay errores
  // 400 - Es un error del front al mandar los datos
  if (!errors.isEmpty()) {
    return res.json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  next();
};


