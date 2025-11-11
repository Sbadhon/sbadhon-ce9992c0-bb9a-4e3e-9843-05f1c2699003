import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import type { Role, JwtSession } from '@turbovets-workspace/data';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService
  ) {}

  async validateAndLogin(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const role = user.role as Role;
    const payload: JwtSession = {
      sub: user.id,
      email: user.email,
      orgId: user.orgId,
      role,
    };

    const expires =
      process.env.JWT_EXPIRES_IN && !Number.isNaN(Number(process.env.JWT_EXPIRES_IN))
        ? Number(process.env.JWT_EXPIRES_IN)
        : 1800;

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET ?? 'turbovets_devsecret',
      expiresIn: expires,
    });

    return {
      accessToken,
      user: { id: user.id, email: user.email },
      orgId: user.orgId,
      role,
    };
  }
}
