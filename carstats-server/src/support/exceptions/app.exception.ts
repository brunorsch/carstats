import { HttpStatus } from '@nestjs/common';

export class AppException extends Error {
    constructor(
        public readonly errorCode: string,
        public readonly message: string,
        public readonly status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    ) {
        super(message);
    }
}
