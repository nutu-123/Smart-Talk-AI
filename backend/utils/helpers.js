function generateTitle(message) {
  const words = message.split(' ').slice(0, 6).join(' ');
  return words.length < message.length ? words + '...' : words;
}

module.exports = { generateTitle };