import { type UserRole } from '@prisma/client';

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        userId: number;
        role: UserRole;
    }
}
