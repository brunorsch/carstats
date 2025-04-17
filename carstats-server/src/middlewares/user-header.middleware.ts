import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const idUsuario = req.headers['x-user-id'];

    if (!idUsuario) {
      throw new UnauthorizedException('Header X-User-ID é obrigatório');
    }

    const idUsuarioNum = parseInt(idUsuario as string, 10);

    if (isNaN(idUsuarioNum)) {
      throw new UnauthorizedException(
        'Header X-User-ID deve ser um número válido',
      );
    }

    req.usuario = {
      id: idUsuarioNum,
    };

    next();
  }
}
