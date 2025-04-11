import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url, ip } = req;
    const start = Date.now();

    logger.defaultMeta = { ip };

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;

        logger.info(`${method} ${url} ${statusCode} - ${duration}ms`);
    });

    next();
};

export { loggerMiddleware };
