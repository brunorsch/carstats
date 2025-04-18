import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AbastecimentoController } from './controllers/abastecimento.controller';
import { ManutencaoController } from './controllers/manutencao.controller';
import { VeiculoController } from './controllers/veiculo.controller';
import { Abastecimento } from './entities/abastecimento.entity';
import { Manutencao } from './entities/manutencao.entity';
import { Veiculo } from './entities/veiculo.entity';
import { UserHeaderMiddleware } from './middlewares/user-header.middleware';
import { AbastecimentoService } from './services/abastecimento.service';
import { ManutencaoService } from './services/manutencao.service';
import { VeiculoService } from './services/veiculo.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(databaseConfig),
        TypeOrmModule.forFeature([Veiculo, Abastecimento, Manutencao]),
    ],
    controllers: [VeiculoController, AbastecimentoController, ManutencaoController],
    providers: [VeiculoService, AbastecimentoService, ManutencaoService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserHeaderMiddleware).forRoutes('*');
    }
}
