export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  isStreaming?: boolean;
  timestamp: number;
  attachments?: Attachment[];
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64
  name?: string;
}

export interface Suggestion {
  title: string;
  subtitle: string;
  prompt: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: number;
}
