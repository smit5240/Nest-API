import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Boy, BoyDocument } from './model/boys.schema';
import { Model } from 'mongoose';
import { Response } from 'express';
import { Boys } from './data/boys.dto';
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const client = require('twilio')(process.env.accountSid, process.env.authToken);
let OTP;
@Injectable()
export class Boyservice {
  constructor(
    @InjectModel(Boy.name) private readonly UserModel: Model<BoyDocument>,
  ) {}
  async adduser(data: Boys, res: Response) {
    try {
      const { email, mobile, otp } = data;
      if ((!!email && !mobile) || (!email && !!mobile)) {
        if (data?.email) {
          let checkemail = await this.UserModel.findOne({ email: email });
          if (checkemail) {
            return res.status(403).send({
              message: 'Email is allready used',
              type: 'error',
            });
          }
          const newUser = await new this.UserModel({
            email,
            mobile,
          });
          newUser.save();
          return res.status(201).send({
            message: 'sucess message',
            type: 'success',
            newUser,
          });
        }
        if (data?.mobile) {
          let checkmobile = await this.UserModel.findOne({ mobile: mobile });
          if (checkmobile) {
            return res.status(403).send({
              message: 'mobile number is allready used',
              type: 'error',
            });
          }
          const newUser = await new this.UserModel({
            email,
            mobile,
            otp,
          });
          newUser.save();
          return res.status(201).send({
            message: 'sucess message',
            type: 'success',
            newUser,
          });
        }
      } else {
        return res.status(403).send({
          message: ' please enter email address or mobile No',
          type: 'error',
        });
      }
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
        error,
      });
    }
  }

  async loginwithmobile(data: Boys, res: Response) {
    try {
      const verify = await this.UserModel.findOne({ mobile: data.mobile });
      if (!verify) {
        return res.status(403).send({
          message: 'Something went wrong',
          type: 'error',
        });
      }
      let digites = '0123456789';
      OTP = '';
      for (let i = 0; i < 4; i++) {
        OTP += digites[Math.floor(Math.random() * 10)];
      }
      client.messages
        .create({
          from: process.env.from,
          to: verify.mobile,
          body: `TWILIO CHECK OTP  ${OTP}`,
        })
        .then(async (message) => {
          const user = {
            email: verify.email,
            mobile: verify.mobile,
            otp: OTP,
          };
          const addotp = await this.UserModel.findByIdAndUpdate(
            verify.id,
            user,
          );
          res.send({ Message: message, msg: 'Message Sent', addotp });
        })
        .catch((error) => {
          return res.send({ error: error });
        });
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
      });
    }
  }

  async verifyOtp(data: Boys, res: Response) {
    try {
      const checkOtp = await this.UserModel.findOne({ otp: data.otp });
      if (!checkOtp) {
        return res.status(403).send({
          message: 'Something went wrong',
          type: 'error',
        });
      }
      const token = await jwt.sign(checkOtp.id, process.env.KEY);
      res.send({
        message: 'Login successfull ',
        status: 'success',
        token: token,
      });
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
      });
    }
  }

  async loginwithEmail(data: Boys, res: Response) {
    try {
      const { email } = data;
      const verify = await this.UserModel.findOne({ email });
      if (!verify) {
        return res
          .status(404)
          .send({ message: 'invalide creaditional', status: 'error' });
      }
      let digites = '0123456789';
      OTP = '';
      for (let i = 0; i < 4; i++) {
        OTP += digites[Math.floor(Math.random() * 10)];
      }
      let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gelanismit0@gmail.com',
          pass: 'bxmapwwwmdkvnigy',
        },
      });
      let mailDetails = {
        from: 'Notification',
        to: verify.email,
        subject: 'authication ',
        text: `Check this OTP and verify ${OTP} `,
      };
      mailTransporter.sendMail(mailDetails, function (err: any, data: any) {
        if (err) {
          return res.status(403).send({ status: 'error', message: err });
        }
      });
      const newuserdata = {
        email: verify.email,
        mobile: verify.mobile,
        otp: OTP,
      };
      const update = await this.UserModel.findByIdAndUpdate(
        verify.id,
        newuserdata,
      );
      return res
        .status(200)
        .send({
          status: 'success',
          message: 'Message Sent Successfully',
          update,
        });
    } catch (error) {
      return res.status(error.code || 403).send({
        message: error.message || 'Something went wrong',
        type: 'error',
      });
    }
  }
}
