import { Injectable } from '@nestjs/common';
import { DogClient } from './clients/dog.client';
import { CatClient } from './clients/cat.client';
import { FoxClient } from './clients/fox.client';

@Injectable()
export class RandomService {
  private readonly maxRetries = 5; // Максимальное количество попыток

  constructor(
    private readonly dogClient: DogClient,
    private readonly catClient: CatClient,
    private readonly foxClient: FoxClient,
  ) {}

  async getImage(): Promise<string> {
    const clients = [
      this.dogClient.getImage.bind(this.dogClient),
      this.catClient.getImage.bind(this.catClient),
      this.foxClient.getImage.bind(this.foxClient),
    ];

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const randomClient =
          clients[Math.floor(Math.random() * clients.length)];
        const imageUrl = await randomClient();

        if (imageUrl) {
          console.info('Image url: ' + imageUrl);
          return imageUrl;
        }

        console.warn(`Attempt ${i + 1}: Empty image URL received.`);
      } catch (error) {
        console.warn(
          `Attempt ${i + 1}: Error fetching image - ${error.message}`,
        );
      }
    }

    throw new Error('Unable to fetch image after maximum retries.');
  }
}
