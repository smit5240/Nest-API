import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common/decorators';
import { Userservice } from './user.service';
import { User } from './data/user.dto';
import { Response } from 'express';
import { Headers } from '@nestjs/common';

@Controller('user')
export class Usercontroller {
  constructor(private readonly userservice: Userservice) {}

  @Post('/add')
  adduser(@Body() User: User, @Res() res: Response) {
    return this.userservice.adduser(User, res);
  }

  @Put('/update/:id')
  updateuser(
    @Param('id') id: string,
    @Body() User: User,
    @Res() res: Response,
  ) {
    return this.userservice.updateuser(id, User, res);
  }

  @Get('/get')
  getuser(@Res() res: Response) {
    return this.userservice.getuser(res);
  }

  @Delete('/delete/:id')
  deleteuser(@Param('id') id: string, @Res() res: Response) {
    return this.userservice.deleteuser(id, res);
  }

  @Post('/login')
  loginuser(@Body() data: string, @Res() res: Response) {
    return this.userservice.loginuser(data, res);
  }

  @Get('/demo')
  demouser(@Headers('token') token, @Res() res: Response) {
    return this.userservice.demouser(res);
  }
}
