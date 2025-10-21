import { FAQ } from '../types';

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'Qual a diferença entre moradia fixa e temporada?',
    answer: `Locação para Moradia fixa é ideal para quem procura um lugar para morar de forma fixa.

Locação para Temporada – Ideal para quem precisa de estadias curtas (diárias – semanas ou poucos meses).
Seja qual for a sua necessidade, temos um ambiente tranquilo e seguro especialmente preparado para você!`,
    category: 'Tipos de Moradia'
  },
  {
    id: '2',
    question: 'Quais documentos preciso para alugar um apartamento para moradia fixa?',
    answer: `Você precisa de RG, CPF, comprovante de renda ou holerite e preencher ficha para análise para aprovação, podendo também ser necessário outros documentos. *consulte nosso departamento de locação.`,
    category: 'Documentação'
  },
  {
    id: '3',
    question: 'Como funciona o pagamento do aluguel?',
    answer: `Para moradia fixa, o pagamento deverá ser feito por boleto e o vencimento será todo dia 08.
Para locação de temporada, o pagamento para temporada deverá ser feito de forma antecipada e negociada em contrato.`,
    category: 'Pagamento'
  },
  {
    id: '4',
    question: 'Os apartamentos são mobiliados?',
    answer: `Somente nossos apartamentos para temporada são mobiliados
Incluem móveis, eletrodomésticos, utensílios de cozinha, roupas de cama, banho, internet wi-fi coletivo.
Para moradia fixa, não temos apartamentos mobiliados – consulte disponibilidade de semi-mobiliados - nesta modalidade algumas unidades incluem cama, fogão, geladeira e gabinete de cozinha.`,
    category: 'Apartamentos'
  },
  {
    id: '5',
    question: 'Posso visitar os apartamentos antes de alugar?',
    answer: `Sim, oferecemos visitas agendadas para todos os apartamentos. Entre em contato conosco para agendar a visita`,
    category: 'Visitas'
  },
  {
    id: '6',
    question: 'Como funciona a multa rescisória de contrato de moradia fixa?',
    answer: `Para moradia fixa, após aprovação, temos um contrato padrão previsto na lei do inquilinato.
Nossos contratos são no total de 30 (trinta meses), porém, fica estipulado em contrato que caso o morador queira finalizar e o contrato de locação e devolver a unidade locada antes de completar 12 (doze) estipulamos uma multa de 3 (três) aluguéis que serão calculados de forma proporcional ao tempo que falta para completar os 30 (trinta) meses.
O cálculo é feito da seguinte forma:
• Some 3 (três) aluguéis = "x" valor
• "x" dividido por 30 = "y"
• Número de meses completos e alugados – (menos) número de meses faltantes para completar os 30 (trinta meses) = "Z" meses
"z" multiplicado por "y", o resultado será = valor da multa a ser paga pelo inquilino.

Para quem desejar entregar a unidade locada após completar 12 (doze) meses, isentamos da referida multa contratual.`,
    category: 'Contrato'
  }
];