import { User } from "@prisma/client";
import JWT from 'jsonwebtoken';
const JWT_SECRET='@$%13565@$%';
class JWTService { 
    public static async generateWebToken(user: User) {
        const payload = {
            id: user?.id,
            email: user?.email,
        }
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }
}
export default JWTService;