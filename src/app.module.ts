import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        username: configService.get('DB_USERNAME'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: configService.get('DB_PASSWORD'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
