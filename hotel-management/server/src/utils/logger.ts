import fs from 'fs';
import path from 'path';

const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLog(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  private writeLog(level: LogLevel, message: string, data?: any): void {
    const logMessage = this.formatLog(level, message, data);
    console.log(logMessage);

    // Write to file
    const logFile = path.join(logsDir, `${process.env.LOG_FILE || 'app.log'}`);
    fs.appendFileSync(logFile, logMessage + '\n');
  }

  error(message: string, error?: any): void {
    this.writeLog(LogLevel.ERROR, message, error);
  }

  warn(message: string, data?: any): void {
    this.writeLog(LogLevel.WARN, message, data);
  }

  info(message: string, data?: any): void {
    this.writeLog(LogLevel.INFO, message, data);
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.writeLog(LogLevel.DEBUG, message, data);
    }
  }
}

export const logger = new Logger();
