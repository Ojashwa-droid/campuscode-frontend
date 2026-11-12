export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'github';
  githubHandle?: string;
  createdAt: string;
}

export type AuthMode = 'signin' | 'signup';
