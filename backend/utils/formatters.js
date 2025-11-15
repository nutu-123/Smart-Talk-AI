function cleanMarkdownFormatting(text) {
  if (!text) return text;
  
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```/g, '');
  });
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  return text;
}

module.exports = { cleanMarkdownFormatting };