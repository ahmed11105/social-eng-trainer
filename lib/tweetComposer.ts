/**
 * Tweet Composer - Writes tweets AS the persona
 * Uses specific persona details to create authentic, unique tweets
 */

import { RichPersona } from './personaFactory';

class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  boolean(prob: number = 0.5): boolean {
    return this.next() < prob;
  }
}

/**
 * Compose a tweet based on persona's actual life details
 */
export function composeTweet(persona: RichPersona, type: string, seed: number): string {
  const rng = new SeededRandom(seed);
  const voice = persona.voice;

  let tweet = '';

  switch (type) {
    case 'pet_clue':
      tweet = composePetClueTweet(persona, rng);
      break;
    case 'location_clue':
      tweet = composeLocationTweet(persona, rng);
      break;
    case 'work_frustration':
      tweet = composeWorkTweet(persona, rng);
      break;
    case 'hobby':
      tweet = composeHobbyTweet(persona, rng);
      break;
    case 'mundane':
      tweet = composeMundaneTweet(persona, rng);
      break;
    case 'social':
      tweet = composeSocialTweet(persona, rng);
      break;
    case 'emotional':
      tweet = composeEmotionalTweet(persona, rng);
      break;
    case 'recent_event':
      tweet = composeRecentEventTweet(persona, rng);
      break;
    default:
      tweet = composeMundaneTweet(persona, rng);
  }

  // Apply voice characteristics
  tweet = applyVoice(tweet, voice, rng);

  return tweet;
}

function composePetClueTweet(persona: RichPersona, rng: SeededRandom): string {
  const currentYear = new Date().getFullYear();
  const years = currentYear - persona.pet.adoptionYear;
  const petName = persona.pet.name;
  const petType = persona.pet.type;

  // Write naturally based on persona's voice
  const structures = [
    `cant believe its been ${years} years since i got ${petName}`,
    `${years} years with ${petName} today`,
    `my ${petType} ${petName} is ${years} years old now`,
    `${petName} has been in my life for ${years} years`,
    `adopted ${petName} ${years} years ago and best decision ever`,
  ];

  let text = rng.pick(structures);

  // Add ending based on persona
  if (rng.boolean(0.6)) {
    const endings = [
      `. best ${petType} ever`,
      `! love this ${petType} so much`,
      `. couldnt imagine life without them`,
      `! ${persona.pet.personality} and perfect`,
    ];
    text += rng.pick(endings);
  }

  // Add emoji if persona uses them
  if (persona.voice.emojiFrequency !== 'never' && rng.boolean(0.7)) {
    text += ' ' + rng.pick(['🐾💙', '💙', '🥺', '🐾']);
  }

  return text;
}

function composeLocationTweet(persona: RichPersona, rng: SeededRandom): string {
  const location = persona.location;

  const feelings = ['love', 'miss', 'hate', 'appreciate'];
  const aspects = ['rn', 'today', 'vibes', 'energy', 'weather'];

  let text = `${rng.pick(feelings)} ${location} ${rng.pick(aspects)}`;

  if (persona.voice.emojiFrequency === 'frequent') {
    text += ' ' + rng.pick(['💙', '✨', '🌆', '']);
  }

  return text.trim();
}

function composeWorkTweet(persona: RichPersona, rng: SeededRandom): string {
  const frustration = rng.pick(persona.occupation.frustrations);
  const enjoys = rng.pick(persona.occupation.enjoys);

  if (rng.boolean()) {
    // Frustration tweet
    const formats = [
      `${frustration} ${rng.pick(['is killing me', 'all day', 'for hours'])}`,
      `spent my whole day ${rng.pick(['dealing with', 'on'])} ${frustration}`,
      `why is ${frustration} ${rng.pick(['always', 'the worst part'])}`,
    ];
    return rng.pick(formats);
  } else {
    // Enjoyment tweet
    return `${enjoys} ${rng.pick(['today and it was good', 'is the best part', 'hits different'])}`;
  }
}

function composeHobbyTweet(persona: RichPersona, rng: SeededRandom): string {
  const interest = rng.pick(persona.interests);

  const formats = [
    `been ${rng.pick(['obsessed with', 'into', 'doing'])} ${interest.name} ${rng.pick(['lately', 'all week', 'nonstop'])}`,
    `spent ${rng.int(2, 6)} hours on ${interest.name} ${rng.pick(['today', 'and worth it', ''])}`.trim(),
    `${interest.name} ${rng.pick(['is consuming my life', 'taking over', 'hits different'])}`,
  ];

  return rng.pick(formats);
}

function composeMundaneTweet(persona: RichPersona, rng: SeededRandom): string {
  // Use persona's actual daily life details
  const topics = [
    () => `${persona.wakeTime !== 'whenever' ? 'woke up at ' + persona.wakeTime : 'woke up'} ${rng.pick(['naturally', 'for no reason', 'way too early'])}`,
    () => {
      const beverage = persona.coffeeHabit === 'tea person actually' ? 'tea' :
                      persona.coffeeHabit.includes('coffee') ? 'coffee' :
                      persona.coffeeHabit.includes('energy') ? 'energy drink' : 'coffee';
      return `${beverage} ${rng.pick(['is life', `#${rng.int(3, 6)} today`, 'keeping me alive'])}`;
    },
    () => `${persona.mealPatterns}. ${rng.pick(['tired of it', 'works for now', 'same routine honestly'])}`,
    () => `my ${rng.pick(['phone', 'laptop', 'headphones'])} ${rng.pick(['died', 'is dying', 'at 1%'])} ${rng.pick(['again', 'of course', ''])}`.trim(),
    () => `${rng.int(20, 200)} ${rng.pick(['unread', 'unopened'])} ${rng.pick(['emails', 'messages'])}. ${rng.pick(['ignoring all of them', 'not looking', 'will deal with later'])}`,
  ];

  return rng.pick(topics)();
}

function composeSocialTweet(persona: RichPersona, rng: SeededRandom): string {
  const socialEnergy = persona.socialEnergy;

  if (socialEnergy === 'introvert') {
    const introvertThoughts = [
      `${rng.pick(['people', 'going out', 'socializing'])} ${rng.pick(['is exhausting', 'takes so much energy', 'why'])}`,
      `${rng.pick(['canceled plans', 'stayed in'])} and ${rng.pick(['no regrets', 'feel so good', 'best decision'])}`,
      `${rng.pick(['does anyone else', 'is it just me or does'])} ${rng.pick(['need alone time', 'recharge by being alone', 'hate small talk'])}`,
    ];
    return rng.pick(introvertThoughts);
  } else {
    const extrovertThoughts = [
      `${rng.pick(['miss', 'need'])} ${rng.pick(['people', 'going out', 'social interaction'])} ${rng.pick(['rn', 'so bad', 'badly'])}`,
      `${rng.pick(['finally', 'got to'])} ${rng.pick(['see friends', 'go out', 'be social'])} ${rng.pick(['today', 'and it was great', '']).trim()}`,
    ];
    return rng.pick(extrovertThoughts);
  }
}

function composeEmotionalTweet(persona: RichPersona, rng: SeededRandom): string {
  const trait = rng.pick(persona.traits);

  const emotionalFormats = [
    `feeling ${rng.pick(['so', 'really', 'honestly'])} ${trait} ${rng.pick(['rn', 'today', 'lately'])}`,
    `${rng.pick(['been', 'feeling'])} ${trait} ${rng.pick(['all day', 'for no reason', 'and idk why'])}`,
    `my ${trait} ${rng.pick(['self', 'energy', 'vibes'])} ${rng.pick(['is showing', 'today', 'rn'])}`,
  ];

  return rng.pick(emotionalFormats);
}

function composeRecentEventTweet(persona: RichPersona, rng: SeededRandom): string {
  const event = rng.pick(persona.recentEvents);

  if (event.stillAffecting) {
    return `still ${rng.pick(['thinking about', 'dealing with', 'processing'])} ${event.event}`;
  } else {
    return `${event.event} ${rng.pick(['last week', 'recently', 'the other day'])} and ${rng.pick(['it was', 'feeling'])} ${event.emotion}`;
  }
}

/**
 * Apply voice characteristics to transform the tweet
 */
function applyVoice(text: string, voice: RichPersona['voice'], rng: SeededRandom): string {
  let result = text;

  // Capitalization
  if (voice.capitalization === 'lowercase') {
    result = result.toLowerCase();
  }

  // Add typo occasionally
  if (voice.typoTendency !== 'careful' && rng.boolean(0.12)) {
    result = introduceRandomTypo(result);
  }

  // Punctuation - apply BEFORE adding phrases
  if (voice.punctuation === 'minimal') {
    result = result.replace(/\./g, '').replace(/!$/, '');
  } else if (voice.punctuation === 'excessive') {
    result = result.replace(/\.$/, '...');
    result = result.replace(/!$/, '!!!');
  }

  // Add recurring phrase occasionally - integrate more naturally
  if (rng.boolean(0.25) && voice.recurringPhrases.length > 0) {
    const phrase = rng.pick(voice.recurringPhrases);
    if (!result.includes(phrase)) {
      // Remove existing period/exclamation before adding phrase
      result = result.replace(/[.!]+$/, '');
      // Add phrase naturally
      if (phrase === 'lol' || phrase === 'lmao' || phrase === 'fr') {
        result += ' ' + phrase;
      } else if (phrase === 'ngl' || phrase === 'tbh' || phrase === 'honestly') {
        // Sometimes add at start, sometimes at end
        if (rng.boolean()) {
          result = phrase + ' ' + result;
        } else {
          result += ' ' + phrase;
        }
      } else {
        result += ' ' + phrase;
      }
    }
  }

  return result.trim();
}

function introduceRandomTypo(text: string): string {
  const typos: Record<string, string> = {
    'believe': 'beleive',
    'realized': 'ralized',
    'definitely': 'defintely',
    'literally': 'literaly',
    'weird': 'wierd',
    'the': 'teh',
    'and': 'adn',
  };

  for (const [correct, typo] of Object.entries(typos)) {
    if (text.includes(correct) && Math.random() < 0.3) {
      return text.replace(correct, typo);
    }
  }

  return text;
}

/**
 * Generate a full set of tweets for a persona
 */
export function composeTweetSet(persona: RichPersona, seed: number): string[] {
  const tweets: string[] = [];
  const rng = new SeededRandom(seed);

  // MUST include: Pet clue
  tweets.push(composeTweet(persona, 'pet_clue', seed + 1));

  // MUST include: Location mention
  tweets.push(composeTweet(persona, 'location_clue', seed + 2));

  // Mix of other tweets based on persona
  const tweetTypes = [
    'work_frustration',
    'hobby',
    'mundane',
    'mundane',
    'social',
    'emotional',
    'recent_event',
  ];

  for (let i = 0; i < tweetTypes.length; i++) {
    tweets.push(composeTweet(persona, tweetTypes[i], seed + i + 3));
  }

  // Shuffle (but keep clue tweets findable)
  return shuffleTweets(tweets, rng);
}

function shuffleTweets(tweets: string[], rng: SeededRandom): string[] {
  const result = [...tweets];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
