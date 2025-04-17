import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Abastecimento } from '../entities/abastecimento.entity';
import { Manutencao } from '../entities/manutencao.entity';
import { Veiculo } from '../entities/veiculo.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'carstats',
  password: process.env.DB_PASSWORD || 'carstats',
  database: process.env.DB_DATABASE || 'carstats',
  entities: [Veiculo, Abastecimento, Manutencao],
  synchronize: true, // Não usar em produção
  logging: true,
  connectTimeout: 60000,
  extra: {
    connectionLimit: 10,
  },
};
