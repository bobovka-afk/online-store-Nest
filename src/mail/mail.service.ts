import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      throw new Error('Необходимо указать EMAIL_USER и EMAIL_PASS в .env');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    if (!email || !token) {
      throw new Error('Email и token обязательны для отправки письма');
    }

    const resetUrl = `http://localhost:8000/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: `Служба поддержки <${process.env.EMAIL_USER}>`, // Отправитель уже указан в конструкторе
      to: email,
      subject: 'Сброс пароля',
      text: `Перейдите по ссылке для сброса пароля: ${resetUrl}`,
      html: this.getResetPasswordHtmlTemplate(resetUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch {
      throw new Error('Не удалось отправить письмо для сброса пароля');
    }
  }

  async sendOrderConfirmationEmail(email: string, orderId: number): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Подтверждение заказа',
      text: `Ваш заказ №${orderId} успешно оформлен.`,
      html: this.getOrderConfirmationHtmlTemplate(orderId),
    };
    console.log(`Отправка письма на ${email}`);
    try {
      await this.transporter.sendMail(mailOptions);
    } catch {
      throw new Error('Не удалось отправить письмо с подтверждением заказа');
    }
  }

  private getResetPasswordHtmlTemplate(resetUrl: string): string {
    return `
      <p>Для сброса пароля нажмите <a href="${resetUrl}">сюда</a>.</p>
      <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
    `;
  }

  private getOrderConfirmationHtmlTemplate(orderId: number): string {
    return `
    <p>Здравствуйте!</p>
    <p>Ваш заказ <strong>№${orderId}</strong> успешно оформлен.</p>
    <p>Спасибо за покупку!</p>
  `;
  }
}
