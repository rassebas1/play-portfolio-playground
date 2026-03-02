export interface PortfolioQA {
  keywords: string[];
  context?: string;
  response?: string;
}

export const portfolioContext: PortfolioQA[] = [
  {
    keywords: ['name', 'who', 'developer', 'developer', 'yourself', 'about'],
    context: 'The developer is a passionate software engineer with experience in web development, specializing in React, TypeScript, and modern JavaScript frameworks.',
  },
  {
    keywords: ['skills', 'technologies', 'tech', 'stack', 'know', 'experience with'],
    context: 'Skills include React, TypeScript, Node.js, Python, Tailwind CSS, Framer Motion, Supabase, PostgreSQL, Git, and AWS.',
  },
  {
    keywords: ['projects', 'work', 'portfolio', 'built', 'created', 'made'],
    context: 'Portfolio includes multiple games (Tic-Tac-Toe with AI, Snake, 2048, Flappy Bird, Brick Breaker, Memory Game), an AI-powered chatbot, and a modern portfolio website.',
  },
  {
    keywords: ['games', 'play', 'tic-tac-toe', 'snake', '2048', 'flappy bird', 'brick breaker', 'memory'],
    context: 'Available games: Tic-Tac-Toe (with 5 AI difficulty levels), Snake, 2048, Flappy Bird, Brick Breaker, and Memory Game. Most games feature local high score tracking and leaderboards.',
  },
  {
    keywords: ['ai', 'chatbot', 'assistant', 'gpt', 'model', 'machine learning', 'ml'],
    context: 'The chatbot uses GPT-2 running locally in the browser via Transformers.js. It can answer questions about the portfolio using a keyword-based retrieval system.',
  },
  {
    keywords: ['contact', 'email', 'reach', 'linkedin', 'github', 'social'],
    context: 'You can find the developer on GitHub and LinkedIn. Check the footer of the website for links to social profiles.',
  },
  {
    keywords: ['education', 'degree', 'university', 'study', 'learn'],
    context: 'The developer has a background in computer science and continuously learns new technologies through personal projects and professional experience.',
  },
  {
    keywords: ['experience', 'job', 'work', 'career', 'employment'],
    context: 'Professional experience includes software development work, building web applications, and creating interactive games.',
  },
  {
    keywords: ['location', 'where', 'country', 'city', 'live'],
    context: 'The portfolio showcases work from a passionate developer based in Spain.',
  },
  {
    keywords: ['language', 'english', 'spanish', 'french', 'italian', 'speak'],
    context: 'The portfolio supports multiple languages: English, Spanish, French, and Italian.',
  },
];

export const ruleBasedResponses: PortfolioQA[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'hola', 'greetings'],
    response: 'Hey there! 👋 How can I help you today? Feel free to ask me about the developer, their projects, or the games available!',
  },
  {
    keywords: ['help', 'what can you', 'commands', 'do'],
    response: 'I can help you learn about:\n• The developer and their background\n• Skills and technologies\n• Portfolio projects\n• Available games to play\n• How to get in touch\n\nJust ask me anything!',
  },
  {
    keywords: ['thanks', 'thank you', 'gracias', 'merci'],
    response: "You're welcome! 😊 Happy to help. Let me know if you have any more questions!",
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'adios'],
    response: 'Goodbye! 👋 Thanks for visiting the portfolio. Come back soon to play some games!',
  },
  {
    keywords: ['game', 'play', 'snake', '2048', 'tic tac toe', 'flappy', 'brick', 'memory'],
    response: 'There are several games to play! Check the Games section in the navigation. Available games: Snake, 2048, Tic-Tac-Toe (with AI!), Flappy Bird, Brick Breaker, and Memory Game. Most have leaderboards and high score tracking!',
  },
];

export function findRelevantContext(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // First check rule-based responses
  for (const qa of ruleBasedResponses) {
    for (const keyword of qa.keywords) {
      if (lowerMessage.includes(keyword)) {
        return qa.response || qa.context;
      }
    }
  }
  
  // Then check portfolio context
  for (const qa of portfolioContext) {
    for (const keyword of qa.keywords) {
      if (lowerMessage.includes(keyword)) {
        return qa.context;
      }
    }
  }
  
  // Default context if no match
  return 'Feel free to ask me about the developer, their skills, projects, games, or how to get in touch!';
}
