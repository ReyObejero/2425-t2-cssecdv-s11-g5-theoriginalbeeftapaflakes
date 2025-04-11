import Transport from 'winston-transport';
import { logService } from '@/services';

interface DBLogOptions extends Transport.TransportStreamOptions {
    context?: string;
}

export class DatabaseTransport extends Transport {
    private context: string;

    constructor(opts: DBLogOptions) {
        super(opts);
        this.context = opts.context || 'general';
    }

    async log(info: any, callback: () => void) {
        setImmediate(() => this.emit('logged', info));

        const { level, message, ip, context } = info;

        const dbLevel = level.toUpperCase() as 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';

        try {
            await logService.log(dbLevel, message, context);

            if (ip) {
                await logService.log(dbLevel, `${message} [IP: ${ip}]`, context);
            }
        } catch (err) {
            console.error('Database log failed:', err);
        }

        callback();
    }
}
