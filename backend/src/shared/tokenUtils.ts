import jwt from 'jsonwebtoken'

export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign(
    { sub: userId, role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '15m' }
  )
}

export function generateRefreshToken(userId: string, role: string): string {
  return jwt.sign(
    { sub: userId, role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  )
}