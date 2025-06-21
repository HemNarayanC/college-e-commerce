
import jwt from 'jsonwebtoken';

const createToken = (data) => {
   const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 1500})
   return token;
}

export { createToken };