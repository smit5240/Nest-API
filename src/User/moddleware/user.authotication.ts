import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class authotication implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['token'];
    const verify = jwt.verify(token, process.env.KEY);
    res.locals.id = verify;
    next();
  }
}
