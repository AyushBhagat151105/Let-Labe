import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendMailer {
  constructor(email) {
    this.email = email;
  }

  async sendMail({ subject, html }) {
    try {
      const response = await resend.emails.send({
        from: "Leet Lab <admin@email.ayushbhagat.live>",
        to: [this.email],
        subject: subject,
        html: html,
      });

      console.log("Email sent successfully:", response);

      return response;
    } catch (error) {
      console.error("Error sending email with Resend:", error);
    }
  }
}
