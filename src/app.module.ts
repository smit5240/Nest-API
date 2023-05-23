import { Module } from '@nestjs/common';
import { Usermodule } from './User/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { boysModule } from './Star/star.module';
require('dotenv').config();

@Module({
  imports: [MongooseModule.forRoot(process.env.API), Usermodule, boysModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('------   App Module   ------');
  }
}
