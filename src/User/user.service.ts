import { Inject, Injectable } from '@nestjs/common';
import { User } from './data/user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from './model/User.schema';
import { Response } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
@Injectable()
export class Userservice {
  constructor(
    @InjectModel(Users.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async adduser(user: User, res: Response) {
    try {
      const { name, email, password } = user;
      let check = await this.UserModel.findOne({ email: email });
      if (check) {
        return res.status(403).send({
          message: 'email is allready used',
          type: 'error',
        });
      }
      const currentpassword = await bcrypt.hash(password, 10);
      const newUser = await new this.UserModel({
        name,
        email,
        password: currentpassword,
      });
      newUser.save();
      return res.status(201).send({
        message: 'sucess message',
        type: 'success',
        newUser,
      });
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
      });
    }
  }

  async getuser(res: Response) {
    try {
      const data = await this.UserModel.find().exec();
      return res.status(200).send({
        message: 'Success to find all user',
        type: 'success',
        data: data,
      });
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
      });
    }
  }

  async updateuser(id: any, User: User, res: Response) {
    try {
      await this.UserModel.findByIdAndUpdate(id, User).exec();
      return res.status(200).send({
        message: 'User is Updated',
        type: 'success',
      });
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
      });
    }
  }

  async deleteuser(id: any, res: Response) {
    try {
      const user = await this.UserModel.findByIdAndDelete(id).exec();
      if (user) {
        return res.status(200).send({
          message: 'User is Deleted',
          type: 'success',
          R_User: user,
        });
      } else {
        return res.status(403).send({
          message: 'Something went wrong',
          type: 'error',
        });
      }
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
      });
    }
  }

  async loginuser(data: any, res: Response) {
    try {
      const { name, email, password } = data;
      let check = await this.UserModel.findOne({ email: email });
      if (check) {
        let verify = await bcrypt.compare(password, check.password);
        if (verify) {
          const token = await jwt.sign(check.id, process.env.KEY);
          return res.status(200).send({
            message: 'Successfull login',
            type: 'success',
            Token: token,
          });
        } else {
          return res.status(403).send({
            message: 'Invalid Creadientials',
            type: 'error',
          });
        }
      }
      return res.status(403).send({
        message: 'Invalid Creadientials',
        type: 'error',
      });
    } catch (error) {
      console.log(error);

      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
        error,
      });
    }
  }

  async demouser(res: Response) {
    const Userid = res.locals.id;
    const data = await this.UserModel.find({ _id: Userid });
    res.send({
      message: 'check middleware',
      type: 'success',
      User: data,
    });
  }
}
