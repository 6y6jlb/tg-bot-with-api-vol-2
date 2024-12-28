import { Command, Ctx, Help, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { SCENES } from './telegram.const';
import { TelegramService } from './telegram.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

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

  @Command('weather')
  async registerUserScene(@Ctx() ctx: SceneContext): Promise<any> {
    try {
      console.log('weather scene');
      console.log(ctx);
      await ctx.scene.enter(SCENES.WEATHER, {
        // additionalParams
      });
    } catch (error) {
      console.warn('ERROR registerUserScene enter :::', error.message);
    }
  }
}
