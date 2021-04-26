import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, JwtStrategyFromQueryParameter } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, JwtStrategyFromQueryParameter],
  exports: [PassportModule],
})
export class AuthModule {}
