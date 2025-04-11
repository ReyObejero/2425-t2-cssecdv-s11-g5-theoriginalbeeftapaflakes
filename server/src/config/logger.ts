import winston from 'winston';
import { DatabaseTransport } from '@/utils';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp, ip, context }) => {
    return `${timestamp} ${level}: ${message} ${ip ? `[IP: ${ip}]` : ''} ${context ? `[Context: ${context}]` : ''}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), logFormat),
    defaultMeta: {},
    transports: [
        new winston.transports.Console({
            format: combine(winston.format.colorize(), timestamp(), logFormat),
        }),
        new DatabaseTransport({ context: 'app' }),
    ],
});

export { logger };
