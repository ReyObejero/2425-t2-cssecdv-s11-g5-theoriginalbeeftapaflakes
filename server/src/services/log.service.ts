import { prismaClient } from '@/database';

type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';

export const logService = {
    log: async (level: LogLevel, message: string, context?: string) => {
        await prismaClient.log.create({
            data: {
                level,
                message,
                context,
            },
        });
    },
};
