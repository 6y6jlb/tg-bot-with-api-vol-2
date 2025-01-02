import { Injectable } from '@nestjs/common';
import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { SCENES } from '../telegram.const';
import { WeatherService } from 'src/weather/weather.service';
import { I18nService } from 'nestjs-i18n';
import { TEMPERATURE_SIGN, OPEN_WEATHER_UNITS } from 'src/weather/wather.const';

@Injectable()
@Scene(SCENES.WEATHER)
export class WeatherScene {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly i18n: I18nService,
  ) { }

  @SceneEnter()
  async weatherEnter(@Ctx() ctx: SceneContext) {
    await ctx.replyWithHTML(
      this.i18n.t('weather.request-hint', { lang: 'ru' }),
      Markup.inlineKeyboard([
        Markup.button.callback(
          this.i18n.t('common.action.reset', { lang: 'ru' }),
          'reset',
        ),
      ]),
    );
  }

  @Action('reset')
  async reset(@Ctx() ctx: SceneContext) {
    await ctx.replyWithHTML(
      this.i18n.t('common.notification.app-reset', { lang: 'ru' }),
    );
    await ctx.scene.leave();
  }

  @On('text')
  async onCityInput(@Ctx() ctx: any) {
    const city = ctx.message.text ?? '';

    if (!city) {
      await ctx.replyWithHTML(
        this.i18n.t('weather.exception.wrong-city', { lang: 'ru' }),
      );
      return;
    }

    try {
      const weather = await this.weatherService.getWeather({ city: city });

      const payload = {
        lang: 'ru',
        args: {
          city: weather.name,
          temp: Math.ceil(Number(weather.main.temp)),
          feel: Math.ceil(Number(weather.main.feels_like)),
          humidity: weather.main.humidity,
          sign: TEMPERATURE_SIGN[weather.units as OPEN_WEATHER_UNITS],
          windSpeed: weather.wind.speed,
          description: weather.weather[0].description,
          pressure: weather.main.pressure,
          escapeValue: false,
        },
      };

      if (weather.icon) {
        await ctx.replyWithPhoto(
          { url: weather.icon },
          { caption: this.i18n.t('weather.forecast-brief', payload) },
        );
      } else {
        await ctx.replyWithHTML(this.i18n.t('weather.forecast-brief', payload));
      }
      await ctx.scene.reenter();
    } catch (error: any) {
      console.warn(error.message);
      await ctx.replyWithHTML(
        this.i18n.t('weather.exception.wrong-city', { lang: 'ru' }),
      );
    }
  }
}
