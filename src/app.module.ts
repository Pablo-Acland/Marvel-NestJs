import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroeModule } from './heroe/heroe.module';

@Module({
  imports: [
    HeroeModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/environments/.env.development`,

    }),

    // Configuración para conexión con MongoDB a través de Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb+srv://Pablo:root@proyectospablo.ovmen.mongodb.net/marvelHeroes?retryWrites=true&w=majority',
      }),
    }),

    // Configuración para conexión con PostgreSQL a través de TypeORM
    TypeOrmModule.forRoot({
      
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'marvelHeroes',
        // entities: [],
        autoLoadEntities: true,
        synchronize: true,
        logging: process.env.SCOPE === 'production' ? false : true,
    }),
  ],
  controllers: [],
  providers: [],
}
)
export class AppModule {}
