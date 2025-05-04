import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export class MailTrap {
  constructor(email) {
    this.email = email;
  }

  async sendMail(token) {
    await transporter.sendMail({
      from: "ayush@gmail.com",
      to: this.email,
      subject: "Virify your email address",
      text: `${token}`,
      html: `<b>${token}</b>`,
    });
  }
}
