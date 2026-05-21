import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialModule } from './common/modules/credential/credential.module';
import { CryptographyModule } from './common/modules/cryptography/cryptography.module';
import { AlertModule } from './modules/alert/alert.module';
import { AlertEntity } from './modules/alert/entities/alert.entity';
import { AuthModule } from './modules/auth/auth.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { UserEntity } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: configService.getOrThrow<number>('DATABASE_PORT'),
        username: configService.getOrThrow<string>('DATABASE_USERNAME'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        entities: [AlertEntity, UserEntity],
        autoLoadEntities: false,
        synchronize: false,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
        },
      }),
    }),
    CredentialModule,
    CryptographyModule,
    AlertModule,
    UserModule,
    AuthModule,
    MonitoringModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
