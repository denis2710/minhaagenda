import User from "../../models/User";
import {sign} from "jsonwebtoken";


export const generateUserToken = (user: User): string => {
  
  return sign({}, process.env.JWT_KEY, {
    subject: user.id,
    expiresIn: '1d',
  })
}
