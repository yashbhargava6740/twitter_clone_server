import { User } from "@prisma/client";
import JWT from 'jsonwebtoken';
import { JWTUser } from "../interfaces";
const JWT_SECRET='YASH';
class JWTService { 
    public static generateWebToken(user: User) {
        const payload : JWTUser = {
            id: user?.id,
            email: user?.email,
        }
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }

    public static decodeToken(token: string) {
        // console.log(token,JWT.verify(token, JWT_SECRET));
        return JWT.verify(token,JWT_SECRET) as JWTUser;
    }
}
export default JWTService;