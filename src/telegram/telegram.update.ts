import { Command, Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
// import { TelegrafContext } from './common/interfaces/telegraf-context.interface.ts';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async onStart(@Ctx() ctx: any) {
    await ctx.reply('Welcome to the Telegram Bot!');
  }

  @Help()
  async onHelp(@Ctx() ctx: any) {
    await ctx.reply(
      'This bot can respond to your commands. Try /start or /help!',
    );
  }

  @Command('echo')
  async onEcho(@Ctx() ctx: any) {
    const text =
      ctx.message?.text?.split(' ').slice(1).join(' ') || 'No text provided!';
    await ctx.reply(`Echo: ${text}`);
  }

  @On('text')
  async onText(@Ctx() ctx: any) {
    const response = this.telegramService.processText(ctx.message.text);
    await ctx.reply(response);
  }
}
