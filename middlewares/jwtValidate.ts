import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface Ipayload {
  uid: string;
  name: string;
  iat: number;
  exp: number;
}
export const jwtValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // x-token en HEADERS
  // Estamos atrapando lo que viene por cabecera con el nombre x-token
  const token = req.header("x-token");
  console.log("token", token);
  // No mandaron token
  if (!token) {
    // 401 no esta autenticado
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED!) as Ipayload;
    req.body.uid = payload.uid;
    req.body.name = payload.name;
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "token no valido",
    });
  }
  next();
};

