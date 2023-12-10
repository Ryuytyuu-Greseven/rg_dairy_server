import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return `<p style="background:black;color:wheat">Hello World!</p>`;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async sendMailToUser(user_email: string, otp: string) {
    try {
      console.log(user_email, otp);
      let transporter: any = {};
      try {
        // create reusable transporter object using the default SMTP transport
        transporter = nodeMailer.createTransport({
          // name: 'mail.ryuytyuuspace.in',
          host: 'smpt.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          service: 'gmail',
          auth: {
            user: this.configService.get('EMAIL'), // generated ethereal user
            pass: this.configService.get('EMAIL_KEY'), // generated ethereal password
          },
          // tls: {
          //   rejectUnauthorized: false,
          // },
        });
        console.log('Its Done');
      } catch (error) {
        console.log('\n Deals', error);
      }

      try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: `"RG Dairy 🐿️" <${this.configService.get('EMAIL')}>`, // sender address
          to: `${user_email}`, // "bar@example.com, baz@example.com" list of receivers
          subject: 'OTP Verification from RG Dairy', // Subject line
          text: `OTP Verification from RG Dairy`, // plain text body
          html: `<h2><b>RG Dairy</b></h2>
          <br>I got to know your trying to signup/login into RG Dairy.\nIf not please ignore this mail.
          <br>Here you go with OTP : <i>${otp}</i>`, // html body
        });
        console.log('Message sent: %s', info.messageId);
      } catch (error) {
        console.log('in inner error', error);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
