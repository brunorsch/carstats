import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../support/exceptions/app.exception';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorCode: string | undefined = undefined;

        if (exception instanceof AppException) {
            status = exception.status;
            message = exception.message;
            errorCode = exception.errorCode;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null) {
                message = (res as any).message ?? message;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(status).json({
            status,
            errorCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
