import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertModule } from './modules/alert/alert.module';
import { AlertEntity } from './modules/alert/entities/alert.entity';

@Module({
  imports: [
    // npm i @nestjs/config
    ConfigModule.forRoot({ isGlobal: true }),
    // npm i @nestjs/typeorm typeorm mysql2
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: configService.getOrThrow<number>('DATABASE_PORT'),
        username: configService.getOrThrow<string>('DATABASE_USERNAME'),
        password: configService.getOrThrow<string>('DATABAE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        entities: [AlertEntity],
        autoLoadEntities: false,
        synchronize: true,
      }),
    }),
    AlertModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
