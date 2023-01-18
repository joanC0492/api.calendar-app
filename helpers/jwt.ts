import jwt from "jsonwebtoken";

export const generateJWT = (uid: string, name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name };
    // Permite saber al backend si el token es el que yo genere o no
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED!,
      {
        // El token expira en 2horas
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }
        resolve(token!);
      }
    );
  });
};
