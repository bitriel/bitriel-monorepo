import jwt, { SignOptions } from "jsonwebtoken";

export interface JWTPayload {
    userId: string;
}

export const generateToken = (payload: JWTPayload, secret: string, expiresIn: SignOptions['expiresIn']): string => {
    return jwt.sign(payload, secret, {
        expiresIn,
    });
};

export const verifyToken = (token: string, secret: string): JWTPayload => {
    try {
        const decoded = jwt.verify(token, secret) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
