import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { EXchangeError } from 'src/exceptions/Exchange';
import { ExchangeClient } from './exchange.client';
import {
  IOpeneXChangeRatesCurrencies,
  IOpeneXChangeRatesLatest,
  IOpeneXChangeRatesLatestGetRate,
} from './exchange.types';

@Injectable()
export class ExchangeService {
  constructor(private exhangeClient: ExchangeClient) {}

  async getRate(data: IOpeneXChangeRatesLatestGetRate): Promise<number> {
    let result: IOpeneXChangeRatesLatest;

    try {
      result = await this.readFile('exchangeRate.json');
      if (dayjs().diff(dayjs.unix(result.timestamp), 'hours') >= 4) {
        result = await this.getFromClientAndWriteToStorage();
      }
    } catch {
      result = await this.getFromClientAndWriteToStorage();
    }

    const usdRateCurrent = data.current
      ? result.rates[data.current.toUpperCase()]
      : 1;
    const usdRateTarget = data.target
      ? result.rates[data.target.toUpperCase()]
      : 1;

    if (!usdRateCurrent || !usdRateTarget) {
      throw new EXchangeError(
        `Get rate error: current: ${data.current}, target: ${data.target}`,
      );
    }

    const relation = (usdRateCurrent / usdRateTarget) * data.count;
    return +(relation < 0.2 ? relation.toFixed(3) : relation.toFixed(2));
  }

  async getCurrency(): Promise<IOpeneXChangeRatesCurrencies> {
    let result: IOpeneXChangeRatesCurrencies;

    try {
      result = await this.readFile('currencies.json');
    } catch {
      result = await this.exhangeClient.getCurrencies();
      await this.saveFile('currencies.json', result.data);
    }

    return result;
  }

  private async getFromClientAndWriteToStorage(base?: string) {
    const result = await this.exhangeClient.get(base);
    await this.saveFile('exchangeRate.json', result);
    return result;
  }

  private async saveFile(filename: string, data: any): Promise<void> {
    const filePath = path.join('storage', filename);

    try {
      await fs.writeFile(filePath, JSON.stringify(data));
      console.log(`File ${filename} written successfully`);
    } catch (error) {
      console.warn(`Failed to write file ${filename}: ${error.message}`);
    }
  }

  private async readFile(filename: string): Promise<any> {
    const filePath = path.join('storage', filename);

    await this.touchFile(filePath, filename);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Failed to read file ${filename}: ${error.message}`);
      throw error;
    }
  }

  private async touchFile(filePath: string, filename: string) {
    try {
      await fs.access(filePath);
    } catch {
      console.warn(`File ${filename} not found, creating new file.`);
      await this.saveFile(filename, {});
    }
  }
}
