import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '@/config';

export interface TokenPayload {
  id: string;
  role: string;
  identifier: string;
  email?: string | null;
  phone?: string | null;
}

/**
 * Generate access token (short-lived, sent in JSON response)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpires as SignOptions['expiresIn'],
  });
};

/**
 * Generate refresh token (long-lived, sent in httpOnly cookie)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpires as SignOptions['expiresIn'],
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

