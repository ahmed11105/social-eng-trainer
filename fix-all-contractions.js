const fs = require('fs');

const contractions = [
  "Can't", "can't", "Won't", "won't", "Don't", "don't",
  "Didn't", "didn't", "Doesn't", "doesn't", "Isn't", "isn't",
  "Wasn't", "wasn't", "Weren't", "weren't", "Haven't", "haven't",
  "Hasn't", "hasn't", "Hadn't", "hadn't", "Couldn't", "couldn't",
  "Shouldn't", "shouldn't", "Wouldn't", "wouldn't", "I'm", "You're",
  "you're", "We're", "we're", "They're", "they're", "It's", "it's",
  "That's", "that's", "What's", "what's", "Who's", "who's",
  "He's", "he's", "She's", "she's", "There's", "there's",
  "I've", "I'll", "We've", "we've", "You'll", "you'll",
  "They'll", "they'll", "Writer's", "writer's", "Joe's",
  "Maria's", "Let's", "let's", "You'll", "that's"
];

let content = fs.readFileSync('./lib/archetypeTweets.ts', 'utf8');

// Replace each contraction with escaped version
contractions.forEach(word => {
  const escaped = word.replace("'", "\\'");
  const regex = new RegExp(word.replace("'", "'"), 'g');
  content = content.replace(regex, escaped);
});

fs.writeFileSync('./lib/archetypeTweets.ts', content, 'utf8');
console.log('Fixed all contractions!');
