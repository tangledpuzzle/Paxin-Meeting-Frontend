export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Choice[];
  usage: Usage;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

interface Message {
  role: string;
  content: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
