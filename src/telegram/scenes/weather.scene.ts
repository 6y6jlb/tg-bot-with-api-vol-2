import { Injectable } from '@nestjs/common';
import { Action, Ctx, Next, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { SCENES } from '../telegram.const';

@Injectable()
@Scene(SCENES.WEATHER)
export class WeatherScene {
  @SceneEnter()
  async weatherEnter(@Ctx() ctx: SceneContext) {
    await ctx.replyWithHTML(
      'Для получени погоды введите город на русском или английском языке.',
      Markup.inlineKeyboard([Markup.button.callback('вернуться', 'reset')]),
    );
  }

  @Action('reset')
  async reset(
    @Ctx() ctx: SceneContext,
    @Next() next: () => ParameterDecorator,
  ) {
    await ctx.replyWithHTML('Параметры приложения были сброшенны');
    next();
  }
}
