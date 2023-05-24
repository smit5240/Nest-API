import { Body, Controller, Post, Res } from '@nestjs/common/decorators';
import { Boyservice } from './boys.service';
import { Boys } from './data/boys.dto';
import { Response } from 'express';

@Controller('boys')
export class boyscontroller {
  constructor(private readonly boyservice: Boyservice) {}

  @Post('/add')
  adduser(@Body() data: Boys, @Res() res: Response) {
    return this.boyservice.adduser(data, res);
  }

  @Post('/loginwithmobile')
  loginwithmobile(@Body() data: Boys, @Res() res: Response) {
    return this.boyservice.loginwithmobile(data, res);
  }

  @Post('/loginwithemail')
  loginwithEmail(@Body() data: Boys, @Res() res: Response) {
    return this.boyservice.loginwithEmail(data, res);
  }

  @Post('/verify')
  verifyOtp(@Body() data: Boys, @Res() res: Response) {
    return this.boyservice.verifyOtp(data, res);
  }
}
