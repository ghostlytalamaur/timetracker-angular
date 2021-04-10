import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.TIMETRACKER_SERVER_AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.TIMETRACKER_SERVER_AUTH0_AUDIENCE,
      issuer: process.env.TIMETRACKER_SERVER_AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}

@Injectable()
export class JwtStrategyFromQueryParameter extends PassportStrategy(Strategy, 'jwt-query-param') {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.TIMETRACKER_SERVER_AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('access_token'),
      audience: process.env.TIMETRACKER_SERVER_AUTH0_AUDIENCE,
      issuer: process.env.TIMETRACKER_SERVER_AUTH0_ISSUER_URL,
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}
