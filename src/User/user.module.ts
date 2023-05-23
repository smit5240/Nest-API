import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Usercontroller } from './user.controller';
import { Userservice } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, Usershema } from './model/User.schema';
import { authotication } from './moddleware/user.authotication';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: Usershema }]),
  ],
  controllers: [Usercontroller],
  providers: [Userservice],
})
export class Usermodule {
  constructor() {
    console.log('------   User Module  ------');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authotication).forRoutes('user/demo/');
  }
}
