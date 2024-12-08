import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  processText(text: string): string {
    // Custom logic to process text
    return `You said: "${text}"`;
  }
}
