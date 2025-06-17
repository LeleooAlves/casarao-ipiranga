import React, { useState, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FAQS = [
  'Quais documentos preciso para alugar um apartamento?',
  'O que está incluso no valor do aluguel?',
  'Posso alugar por temporada? Quais as condições?',
  'Como funciona o pagamento do aluguel?',
  'O apartamento é mobiliado?',
  'Quais são as regras para pets?',
  'Como é a segurança do prédio?',
  'Quais mercados, padarias e farmácias estão próximos?',
  'Quais pontos turísticos e transportes estão próximos?',
  'Como faço para agendar uma visita?'
];

const LOCATION_CONTEXT = `Considere sempre que você está respondendo como um assistente virtual que "mora" na Rua Tabor 255, São Paulo - SP - Ipiranga - CEP: 04202-020 - Brasil. Ao responder perguntas sobre localização, cite pontos turísticos, pontos de ônibus, metrô, mercados, padarias, farmácias e outros serviços próximos a esse endereço.`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('casarao_chatbot_history');
    if (saved) return JSON.parse(saved).map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
    return [
      {
        id: '1',
        text: 'Olá! Sou o assistente virtual do Casarão Ipiranga e estou disposto a responder suas dúvidas. Como posso ajudá-lo hoje?',
        isBot: true,
        timestamp: new Date(),
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFaq, setShowFaq] = useState(true);

  useEffect(() => {
    localStorage.setItem('casarao_chatbot_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Show notification after 2 seconds
    const timer = setTimeout(() => {
      setShowNotification(true);
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (msg?: string) => {
    const content = msg || inputMessage;
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: content,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setShowFaq(false);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${LOCATION_CONTEXT}\nUsuário: ${content}` }]
          }]
        })
      });
      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui entender. Poderia reformular sua pergunta?';
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        text: 'Desculpe, houve um erro ao conectar com a inteligência artificial.',
        isBot: true,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
    setIsOpen(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowFaq(messages.length <= 1);
  };

  return (
    <>
      {/* Notification */}
      {showNotification && !isOpen && (
        <div 
          onClick={handleNotificationClick}
          className="fixed bottom-24 left-6 max-w-xs bg-white rounded-lg shadow-xl border border-gray-200 p-4 cursor-pointer transform animate-bounce z-40"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800 font-medium">Assistente Virtual</p>
              <p className="text-xs text-gray-600 mt-1">
                Sou o assistente virtual do Casarão e estou disposto a responder suas dúvidas!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 left-6 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50"
        aria-label="Abrir assistente virtual"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 h-[32rem] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">Assistente Virtual</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* FAQ Suggestions */}
          {showFaq && (
            <div className="p-2 flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50">
              {FAQS.slice(0, 3).map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(faq)}
                  className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {faq}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-primary text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-800 opacity-70 animate-pulse">
                  Digitando...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;