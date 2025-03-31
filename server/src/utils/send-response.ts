import { type Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, payload: unknown): void => {
    res.status(statusCode).json(payload);
};
