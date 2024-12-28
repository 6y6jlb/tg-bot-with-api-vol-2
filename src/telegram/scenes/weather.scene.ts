import { Injectable } from '@nestjs/common';
import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { SCENES } from '../telegram.const';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
@Scene(SCENES.WEATHER)
export class WeatherScene {
  constructor(private readonly weatherService: WeatherService) {}

  @SceneEnter()
  async weatherEnter(@Ctx() ctx: SceneContext) {
    await ctx.replyWithHTML(
      'Для получени погоды введите город на русском или английском языке.',
      Markup.inlineKeyboard([Markup.button.callback('вернуться', 'reset')]),
    );
  }

  @Action('reset')
  async reset(@Ctx() ctx: SceneContext) {
    await ctx.replyWithHTML('Параметры приложения были сброшены.');
    await ctx.scene.leave();
  }

  @On('text')
  async onCityInput(@Ctx() ctx: any) {
    const city = ctx.message.text ?? '';
    if (!city) {
      await ctx.replyWithHTML(
        'Пожалуйста, введите корректное название города.',
      );
      return;
    }

    try {
      const weather = await this.weatherService.getWeather({ city: city });
      await ctx.replyWithHTML(`Погода в городе <b>${city}</b>:\n${weather}`);
      await ctx.scene.leave();
    } catch (error: any) {
      await ctx.replyWithHTML(
        `Не удалось получить данные о погоде для города <b>${city}</b>. Пожалуйста, проверьте название города и попробуйте снова. :::${error.message}`,
      );
    }
  }

  private async getWeatherForCity(city: string): Promise<string> {
    return `${city}::: Температура: 25°C, Солнечно`;
  }
}
