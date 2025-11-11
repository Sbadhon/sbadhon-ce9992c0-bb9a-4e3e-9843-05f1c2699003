import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import type { Role } from '@turbovets-workspace/data';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async createUserInOrg(
    requestorRole: Role,
    orgId: string,
    email: string,
    password: string,
    role: Role
  ) {
    if (requestorRole !== 'OWNER')
      throw new ForbiddenException('Only OWNER can add users');

    const existing = await this.users.findOne({ where: { email } });
    if (existing) {
      if (existing.orgId !== orgId) {
        throw new ConflictException('User exists in a different organization');
      }
      existing.role = role;
      await this.users.save(existing);
      return { id: existing.id, email: existing.email, orgId, role: existing.role };
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await this.users.save(
      this.users.create({
        email,
        passwordHash: hash,
        orgId,
        role,
      })
    );
    return { id: user.id, email: user.email, orgId: user.orgId, role: user.role as Role };
  }
}
