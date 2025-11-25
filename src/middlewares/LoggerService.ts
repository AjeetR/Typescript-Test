import { createLogger, format, transports, Logger } from 'winston';

class LoggerService {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: 'error.log', level: 'error' }),
                new transports.File({ filename: 'combined.log' })
            ],
        });
    }

    logInfo(message: string): void {
        this.logger.info(message);
    }

    logError(message: string): void {
        this.logger.error(message);
    }

    logWarning(message: string): void {
        this.logger.warn(message);
    }

    logDebug(message: string): void {
        this.logger.debug(message);
    }
}

export default new LoggerService();