import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';
import { Message, ChatResponse } from './types/chat';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Heart, Eraser } from 'lucide-react';
import { initializePersona, getPersonaPrompt } from './utils/PersonaPrompt';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const initialPrompt = initializePersona();
      if (initialPrompt) {
        sendMessage(initialPrompt);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    localStorage.removeItem('personaInitialized');
    setMessages([]);
    const initialPrompt = getPersonaPrompt();
    sendMessage(initialPrompt);
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    if (content !== getPersonaPrompt()) {
      setMessages((prev) => [...prev, userMessage]);
    }
    
    setIsLoading(true);

    try {
      // 准备完整的对话历史
      const chatHistory = content === getPersonaPrompt() 
        ? [{ role: 'user', content }]
        : [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }));

      const response = await axios.post<ChatResponse>(
        'https://miaoge2024-miaoclaudeservice.hf.space/hf/v1/chat/completions',
        {
          model: 'claude-3-5-sonnet-20241022',
          messages: chatHistory,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 123321',
          },
        }
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.choices[0].message.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-purple-600 text-white p-4 shadow-md">
        <div className="flex items-center gap-2 justify-center max-w-3xl mx-auto w-full relative">
          <Heart className="text-pink-300" />
          <h1 className="text-xl font-bold">魅喵伴侣</h1>
          <button
            onClick={clearChat}
            className="absolute right-0 p-2 hover:bg-purple-700 rounded-full transition-colors"
            title="清空对话"
          >
            <Eraser size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse text-purple-600">正在输入中...</div>
          </div>
        )}
      </main>

      <div className="max-w-3xl mx-auto w-full">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default App;
