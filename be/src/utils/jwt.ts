import jwt, {SignOptions} from "jsonwebtoken";
import { env } from "process";

export interface TokenPayload {
  id: number;
  username: string;
  email: string;
}

const JWT_SECRET: string = env.JWT_SECRET || "your-secret-key-here";
const JWT_EXPIRY = env.JWT_EXPIRES_IN || "7d";


export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY as string,
  } as SignOptions);
};


export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
