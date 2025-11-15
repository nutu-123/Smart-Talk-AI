// Check if running in Docker (nginx) or development
const isProduction = window.location.hostname !== 'localhost' || window.location.port === '80';

export const API_URL = isProduction 
  ? 'http://localhost:5000/api'  // When accessed from browser
  : 'http://localhost:5000/api';  // Development

export const SUGGESTED_PROMPTS = [
  { icon: "💡", text: "Explain quantum computing", category: "Learn" },
  { icon: "✍️", text: "Write a creative story", category: "Create" },
  { icon: "🔍", text: "Help debug my code", category: "Code" },
  { icon: "🌍", text: "Latest AI trends", category: "Explore" },
  { icon: "🤖", text: "Build a chatbot using Python", category: "Code" },
  { icon: "🧠", text: "Learn neural networks in simple terms", category: "Learn" },
  { icon: "📱", text: "Design a mobile app UI", category: "Design" },
  { icon: "🗣️", text: "Practice English speaking skills", category: "Learn" },
  { icon: "🚀", text: "Generate startup ideas", category: "Business" },
{ icon: "🎬", text: "Write a short film script", category: "Create" },
{ icon: "📚", text: "Summarize this research paper", category: "Learn" },
{ icon: "💼", text: "Prepare for a job interview", category: "Career" },
{ icon: "🧮", text: "Solve a statistics problem", category: "Science" },
{ icon: "🖥️", text: "Explain cloud computing basics", category: "Learn" },
{ icon: "🎧", text: "Recommend productivity playlists", category: "Explore" },
{ icon: "💬", text: "Write LinkedIn post ideas", category: "Create" },
{ icon: "📈", text: "Predict stock market trends", category: "Business" },
{ icon: "⚙️", text: "Optimize my backend API", category: "Code" },
{ icon: "🌐", text: "Explain web development roadmap", category: "Learn" },
{ icon: "🧩", text: "Brainstorm app feature ideas", category: "Design" },
{ icon: "🕹️", text: "Design a simple game concept", category: "Create" },
{ icon: "💻", text: "Fix performance issues in React", category: "Code" },
{ icon: "🪐", text: "Discover space exploration facts", category: "Explore" },
{ icon: "🧭", text: "Plan my learning roadmap", category: "Career" }

];