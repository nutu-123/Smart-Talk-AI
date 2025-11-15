export const formatDate = (dateString) => {
  const chatDate = new Date(dateString);
  const today = new Date();
  
  const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffMs = todayDay - chatDay;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  const options = { month: 'short', day: 'numeric' };
  if (chatDate.getFullYear() !== today.getFullYear()) {
    options.year = 'numeric';
  }
  return chatDate.toLocaleDateString('en-US', options);
};

export const exportChatToFile = (messages) => {
  const content = messages.map(m => 
    `[${new Date(m.timestamp).toLocaleString()}] ${m.role}: ${m.content}`
  ).join('\n\n');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-talk-ai-${new Date().toISOString()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};