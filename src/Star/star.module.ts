import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Boy, Boyschema } from './model/boys.schema';
import { boyscontroller } from './boys.controller';
import { Boyservice } from './boys.service';
require('dotenv').config();

@Module({
  imports: [MongooseModule.forFeature([{ name: Boy.name, schema: Boyschema }])],
  controllers: [boyscontroller],
  providers: [Boyservice],
})
export class boysModule {
  constructor() {
    console.log('------   Boys Module   ------');
  }
}
