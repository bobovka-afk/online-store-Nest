import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      throw new Error('Необходимо указать EMAIL_USER и EMAIL_PASS в .env');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
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
    const emailUser = process.env.EMAIL_USER;

    if (!emailUser) {
      throw new Error('Не передан EMAIL_USER в .env');
    }

    const mailOptions = {
      from: `Служба поддержки <${emailUser}>`,
      to: email,
      subject: 'Сброс пароля',
      text: `Перейдите по ссылке для сброса пароля: ${resetUrl}`,
      html: this.getResetPasswordHtmlTemplate(resetUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Письмо для сброса пароля отправлено на ${email}`);
    } catch (error) {
      // Проверяем, что ошибка является объектом Error
      if (error instanceof Error) {
        this.logger.error(
          `Ошибка при отправке письма на ${email}: ${error.message}`,
        );
      } else {
        this.logger.error(
          `Ошибка при отправке письма на ${email}: неизвестная ошибка`,
        );
      }
      throw new Error('Не удалось отправить письмо для сброса пароля');
    }
  }

  private getResetPasswordHtmlTemplate(resetUrl: string): string {
    return `
      <p>Для сброса пароля нажмите <a href="${resetUrl}">сюда</a>.</p>
      <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
    `;
  }
}
