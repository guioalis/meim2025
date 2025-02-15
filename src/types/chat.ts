export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}
