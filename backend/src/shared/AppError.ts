export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details: any = null
  ) {
    super(message)
    this.name = 'AppError'
  }
}