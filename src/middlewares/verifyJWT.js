import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;

export const verifyJWT = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "Token não encontrado" });
  token = token?.replace("Bearer ", "");

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Token inválido" });
    req.userId = decoded;
    next();
  });
};
