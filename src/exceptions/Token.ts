export class TokensError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokensError';
  }
}
