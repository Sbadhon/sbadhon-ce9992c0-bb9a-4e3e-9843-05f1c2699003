import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtSession } from '@turbovets-workspace/data';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'turbovets_devsecret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtSession): Promise<JwtSession> {
    return payload;
  }
}
