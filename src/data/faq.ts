import { FAQ } from '../types';

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'Como funciona o processo de reserva?',
    answer: 'O processo é simples: selecione o apartamento, escolha as datas, preencha o formulário e efetue o pagamento. Você receberá a confirmação por email.',
    category: 'Reservas'
  },
  {
    id: '2',
    question: 'Posso cancelar minha reserva?',
    answer: 'Sim, você pode cancelar sua reserva até 48 horas antes da data de check-in sem custos adicionais.',
    category: 'Reservas'
  },
  {
    id: '3',
    question: 'Os apartamentos são mobiliados?',
    answer: 'Sim, todos os nossos apartamentos são completamente mobiliados e equipados com tudo que você precisa.',
    category: 'Apartamentos'
  },
  {
    id: '4',
    question: 'Qual é a política de check-in e check-out?',
    answer: 'Check-in: 14h às 20h | Check-out: até 12h. Para horários diferentes, consulte disponibilidade.',
    category: 'Políticas'
  },
  {
    id: '5',
    question: 'Aceita pets?',
    answer: 'Alguns apartamentos aceitam pets mediante taxa adicional. Consulte na descrição do apartamento.',
    category: 'Políticas'
  }
];