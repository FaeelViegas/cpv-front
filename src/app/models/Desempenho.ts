import { Cliente } from "./Cliente";
import { Flag } from "./Flag";
import { Tier } from "./Tier";

export class DesempenhoMensal {
    id: number;
    clienteId: number;
    status: number;
    data: Date;
    tierId: number;
    flagId: number;
    honorario: number;
    investidoEsteMes: number;
    vendasMetaAds: number;
    vendasGoogleAds: number;
    valorDeVendas: number;
    custoTotal: number;
    roas: number;
    roi: number;
    cpa: number;
    margemLucro: number;
    ticketMedio: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
    cliente: Cliente;
    tier: Tier;
    flag: Flag;
}