import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async sendOtp(phone: string) {
    const message = `Your OTP code is ${this.generateOtp()}`;

    const payload = {
      api_key: process.env.SMS_API_KEY,
      to: phone,
      message: message,
      sender_id: 'YourApp',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post('https://api.sendsmsgate.com/send', payload),
      );

      return response.data;
    } catch (error) {
      throw new Error('Failed to send SMS');
    }
  }

  generateOtp(length = 6): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
