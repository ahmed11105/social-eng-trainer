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
  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
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
    case 'reply_to_friend':
      tweet = composeReplyTweet(persona, rng);
      break;
    case 'reaction':
      tweet = composeReactionTweet(persona, rng);
      break;
    case 'boring_observation':
      tweet = composeBoringTweet(persona, rng);
      break;
    case 'niche_interest':
      tweet = composeNicheTweet(persona, rng);
      break;
    case 'imperfect_moment':
      tweet = composeImperfectTweet(persona, rng);
      break;
    case 'continuity_reference':
      tweet = composeContinuityTweet(persona, rng);
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

  // Write naturally based on persona's voice - ALWAYS include adoption year for password clue
  const structures = [
    `${rng.pick(['cant believe', 'crazy that'])} its been ${years} years since i ${rng.pick(['got', 'adopted'])} ${petName} in ${persona.pet.adoptionYear}`,
    `${years} years with ${petName} ${rng.pick(['today', 'now'])}. ${rng.pick(['got', 'adopted'])} ${rng.pick(['them', 'him', 'her'])} in ${persona.pet.adoptionYear}`,
    `my ${petType} ${petName} is ${years} now. ${rng.pick(['adopted', 'got', 'brought home'])} ${persona.pet.adoptionYear}`,
    `adopted ${petName} ${rng.pick(['back in', 'in'])} ${persona.pet.adoptionYear} ${rng.pick(['and best decision ever', 'best decision', `and its been ${years} years`])}`,
    `${petName}'s ${rng.pick(['adoption', 'gotcha'])} ${rng.pick(['day', 'anniversary'])} was in ${persona.pet.adoptionYear}. ${years} years ${rng.pick(['already', 'now', 'and counting'])}`,
    `been ${years} years since ${petName} ${rng.pick(['came into my life', 'joined the family'])} in ${persona.pet.adoptionYear}`,
  ];

  let text = rng.pick(structures);

  // Add ending based on persona (less frequently)
  if (rng.boolean(0.4)) {
    const endings = [
      `. best ${petType} ever`,
      `! love this ${petType} so much`,
      `. ${rng.pick(['couldnt', 'cant'])} imagine life without ${rng.pick(['them', petName])}`,
      `. ${persona.pet.personality} and perfect`,
      `. ${rng.pick(['still', 'always'])} ${persona.pet.personality}`,
    ];
    text += rng.pick(endings);
  }

  // Add emoji if persona uses them
  if (persona.voice.emojiFrequency !== 'never' && rng.boolean(0.5)) {
    text += ' ' + rng.pick(['🐾', '💙', '🥺', '❤️', '🐕', '🐈']);
  }

  return text;
}

function composeLocationTweet(persona: RichPersona, rng: SeededRandom): string {
  const location = persona.location;

  const formats = [
    `${rng.pick(['love', 'miss', 'hate', 'appreciate'])} ${location} ${rng.pick(['rn', 'today', 'vibes', 'energy', 'weather', 'so much'])}`,
    `${location} ${rng.pick(['weather', 'traffic', 'vibes'])} ${rng.pick(['is', 'today is', 'right now is'])} ${rng.pick(['incredible', 'terrible', 'perfect', 'awful', 'unpredictable'])}`,
    `${rng.pick(['another', 'typical', 'beautiful', 'rough'])} day in ${location}`,
    `${rng.pick(['never leaving', 'stuck in', 'grateful for', 'tired of'])} ${location}`,
    `${location} ${rng.pick(['people', 'drivers', 'folks'])} ${rng.pick(['are something else', 'know what I mean', 'hit different'])}`,
    `${rng.pick(['the', 'this'])} ${location} ${rng.pick(['traffic', 'weather', 'vibe', 'scene'])} ${rng.pick(['is unmatched', 'never gets old', 'is exhausting'])}`,
  ];

  let text = rng.pick(formats);

  if (persona.voice.emojiFrequency === 'frequent' && rng.boolean(0.5)) {
    text += ' ' + rng.pick(['💙', '✨', '🌆', '☀️', '🌧️']);
  }

  return text.trim();
}

function composeWorkTweet(persona: RichPersona, rng: SeededRandom): string {
  const frustration = rng.pick(persona.occupation.frustrations);
  const enjoys = rng.pick(persona.occupation.enjoys);

  if (rng.boolean(0.6)) {
    // Frustration tweet (more common)
    const formats = [
      `${frustration} ${rng.pick(['is killing me', 'all day', 'for hours', 'again', 'why'])}`,
      `spent my ${rng.pick(['whole', 'entire'])} day ${rng.pick(['dealing with', 'on', 'fixing'])} ${frustration}`,
      `${rng.pick(['why is', 'when will', 'how is'])} ${frustration} ${rng.pick(['always like this', 'the worst part', 'still a problem', 'never ending'])}`,
      `${frustration} ${rng.pick(['for the', 'on the'])} ${rng.int(3, 5)}${rng.pick(['rd', 'th', 'nd'])} time ${rng.pick(['this week', 'today', 'this month'])}`,
      `${rng.pick(['another day of', 'back to', 'more'])} ${frustration} ${rng.pick(['unfortunately', 'apparently', ''])}`.trim(),
    ];
    return rng.pick(formats);
  } else {
    // Enjoyment or mundane work tweet
    const formats = [
      `${enjoys} ${rng.pick(['today and it was good', 'is the best part', 'hits different', 'actually went well'])}`,
      `${rng.pick(['finally', 'actually', 'managed to'])} ${rng.pick(['finished', 'completed', 'wrapped up'])} ${rng.pick(['that project', 'this task', 'what I was working on'])}`,
      `${rng.pick(['productive', 'decent', 'long', 'exhausting'])} day at ${rng.pick(['work', 'the office', persona.occupation.workplace])}`,
    ];
    return rng.pick(formats);
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
    () => `${persona.wakeTime !== 'whenever' ? 'woke up at ' + persona.wakeTime : 'woke up'} ${rng.pick(['naturally', 'for no reason', 'way too early', 'and already tired', 'somehow'])}`,
    () => {
      const beverage = persona.coffeeHabit === 'tea person actually' ? 'tea' :
                      persona.coffeeHabit.includes('coffee') ? 'coffee' :
                      persona.coffeeHabit.includes('energy') ? 'energy drink' : 'coffee';
      return `${beverage} ${rng.pick(['is life', `#${rng.int(3, 6)} today`, 'keeping me alive', 'run', 'is necessary'])}`;
    },
    () => `${persona.mealPatterns} ${rng.pick(['and tired of it', 'works for now', 'same routine', 'apparently', ''])}`.trim(),
    () => `my ${rng.pick(['phone', 'laptop', 'headphones', 'charger', 'battery'])} ${rng.pick(['died', 'is dying', 'at 1%', 'broke', 'stopped working'])} ${rng.pick(['again', 'of course', 'naturally', ''])}`.trim(),
    () => `${rng.int(20, 200)} ${rng.pick(['unread', 'unopened', 'pending'])} ${rng.pick(['emails', 'messages', 'notifications'])}${rng.pick(['. ignoring all of them', '. not dealing with that', '. will get to them eventually', ' and counting'])}`,
    () => `${rng.pick(['traffic', 'commute', 'drive'])} ${rng.pick(['was terrible', 'took forever', 'was awful', 'sucked'])} ${rng.pick(['today', 'this morning', 'as usual'])}`,
    () => `${rng.pick(['the line at', 'wait at', 'how long'])} ${rng.pick(['this coffee shop', 'the store', 'this place'])} ${rng.pick(['is insane', 'is ridiculous', 'why'])}`,
    () => `${rng.pick(['forgot', 'left', 'can\'t find'])} my ${rng.pick(['keys', 'wallet', 'phone', 'water bottle'])} ${rng.pick(['again', 'somewhere', 'and now late'])}`,
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

function composeReplyTweet(persona: RichPersona, rng: SeededRandom): string {
  const friend = rng.pick(persona.friendCircle);

  const replyFormats = [
    `${friend.handle} ${rng.pick(['omg yes', 'wait what', 'lmao same', 'for real', 'I know right', 'exactly', 'this is so true'])}`,
    `${friend.handle} ${rng.pick(['are you serious', 'no way', 'stop it', 'you\'re kidding', 'wait really'])}`,
    `${friend.handle} ${rng.pick(['send me the link', 'I need to see this', 'show me', 'tell me more'])}`,
    `${friend.handle} ${rng.pick(['yeah I\'m down', 'sounds good', 'let\'s do it', 'I\'m in', 'count me in'])}`,
    `${friend.handle} ${rng.pick(['miss you', 'we need to catch up', 'let\'s hang soon', 'coffee soon?'])}`,
    `${friend.handle} ${rng.pick(['congrats', 'so happy for you', 'proud of you', 'amazing news'])}`,
  ];

  return rng.pick(replyFormats);
}

function composeReactionTweet(persona: RichPersona, rng: SeededRandom): string {
  const reactions = [
    `${rng.pick(['just watched', 'finished watching', 'saw'])} ${rng.pick(['that episode', 'the finale', 'the new episode'])} and ${rng.pick(['wow', 'I have thoughts', 'I\'m not okay', 'what just happened', 'need to process'])}`,
    `${rng.pick(['the timeline', 'everyone', 'people'])} ${rng.pick(['is being so weird', 'needs to calm down', 'is wilding', 'today is unhinged'])}`,
    `${rng.pick(['why', 'how', 'when'])} did ${rng.pick(['this become acceptable', 'we normalize this', 'this become a thing', 'people start doing this'])}`,
    `${rng.pick(['woke up to', 'just saw', 'opened the app to'])} ${rng.pick(['chaos', 'drama', 'discourse', 'the worst takes'])}`,
  ];

  return rng.pick(reactions);
}

function composeBoringTweet(persona: RichPersona, rng: SeededRandom): string {
  const boringObservations = [
    `${rng.pick(['need to', 'should probably', 'really need to'])} ${rng.pick(['do laundry', 'clean my room', 'grocery shop', 'organize my desk', 'charge my phone'])}`,
    `${rng.pick(['forgot to', 'need to remember to', 'just remembered I need to'])} ${rng.pick(['pay a bill', 'call back', 'respond to that email', 'return that thing'])}`,
    `${rng.pick(['the', 'my'])} ${rng.pick(['wifi', 'internet', 'power'])} ${rng.pick(['went out', 'is down', 'keeps dropping'])} ${rng.pick(['again', 'for some reason', ''])}`.trim(),
    `${rng.pick(['ran out of', 'out of', 'need to buy'])} ${rng.pick(['milk', 'coffee', 'bread', 'shampoo', 'toothpaste'])}`,
    `${rng.pick(['finally', 'just', 'about to'])} ${rng.pick(['fold', 'put away', 'deal with'])} ${rng.pick(['laundry', 'dishes', 'that pile of stuff'])} ${rng.pick(['from last week', 'that\'s been sitting there', ''])}`.trim(),
  ];

  return rng.pick(boringObservations);
}

function composeNicheTweet(persona: RichPersona, rng: SeededRandom): string {
  const interest = rng.pick(persona.interests);

  const nicheFormats = [
    `${rng.pick(['been deep diving into', 'spent hours researching', 'can\'t stop reading about', 'fell down a rabbit hole about'])} ${interest.name} ${rng.pick(['and it\'s fascinating', 'and now I\'m obsessed', 'for no reason', ''])}`.trim(),
    `${rng.pick(['the', 'that'])} ${interest.name} ${rng.pick(['community', 'scene', 'discourse', 'drama'])} is ${rng.pick(['wild', 'unmatched', 'something else', 'fascinating'])}`,
    `${rng.pick(['finally', 'just', 'managed to'])} ${rng.pick(['finished', 'completed', 'figured out'])} ${rng.pick(['that thing', 'the project', 'what I was working on'])} ${rng.pick(['for', 'in'])} ${interest.name}`,
    `${interest.name} ${rng.pick(['people', 'fans', 'enthusiasts'])} ${rng.pick(['will understand', 'know what I mean', 'get it'])}`,
  ];

  return rng.pick(nicheFormats);
}

function composeImperfectTweet(persona: RichPersona, rng: SeededRandom): string {
  const imperfectMoments = [
    `${rng.pick(['just spilled', 'dropped', 'knocked over'])} ${rng.pick(['my coffee', 'my drink', 'water'])} ${rng.pick(['all over', 'on'])} ${rng.pick(['my desk', 'my laptop', 'myself', 'the floor'])}`,
    `${rng.pick(['forgot', 'can\'t remember', 'lost'])} ${rng.pick(['what I was', 'where I put', 'why I'])} ${rng.pick(['going to say', 'my keys', 'walked in here', 'came upstairs'])}`,
    `${rng.pick(['sent', 'almost sent', 'accidentally sent'])} ${rng.pick(['that', 'a message', 'an email'])} to ${rng.pick(['the wrong person', 'the wrong chat', 'my boss instead'])}`,
    `${rng.pick(['been', 'spent'])} ${rng.int(10, 45)} minutes ${rng.pick(['looking for', 'searching for', 'trying to find'])} ${rng.pick(['my phone', 'my keys', 'my wallet', 'something'])} ${rng.pick(['and it was in my hand', 'and it was right there', 'and it was in my pocket'])}`,
    `${rng.pick(['wore', 'put on', 'realized I\'m wearing'])} ${rng.pick(['mismatched socks', 'my shirt inside out', 'two different shoes', 'this backwards'])} ${rng.pick(['all day', 'and nobody told me', 'to work', ''])}`.trim(),
  ];

  return rng.pick(imperfectMoments);
}

function composeContinuityTweet(persona: RichPersona, rng: SeededRandom): string {
  const continuityFormats = [
    `update: ${rng.pick(['did not', 'still haven\'t', 'forgot to', 'never'])} ${rng.pick(['do that thing', 'fix this', 'deal with that', 'follow through'])}`,
    `${rng.pick(['remember when', 'remember that time', 'thinking about when'])} I ${rng.pick(['said', 'posted about', 'mentioned'])} ${rng.pick(['that thing', 'doing this', 'changing that'])}? ${rng.pick(['yeah that didn\'t happen', 'still haven\'t', 'gave up on that', 'nevermind'])}`,
    `${rng.pick(['day', 'week', 'month'])} ${rng.int(2, 30)} of ${rng.pick(['trying to', 'attempting to', 'working on'])} ${rng.pick(['fix my sleep schedule', 'exercise regularly', 'eat better', 'be productive'])}`,
    `${rng.pick(['still', 'currently', 'been'])} ${rng.pick(['thinking about', 'processing', 'dealing with', 'recovering from'])} ${rng.pick(['that conversation', 'what happened', 'yesterday', 'earlier today'])}`,
  ];

  return rng.pick(continuityFormats);
}

/**
 * Apply voice characteristics to transform the tweet
 */
function applyVoice(text: string, voice: RichPersona['voice'], rng: SeededRandom): string {
  let result = text;

  // Capitalization
  if (voice.capitalization === 'lowercase') {
    result = result.toLowerCase();
  } else if (voice.capitalization === 'normal') {
    // Capitalize first letter of the tweet
    result = result.charAt(0).toUpperCase() + result.slice(1);
    // Capitalize after sentence endings
    result = result.replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    // Capitalize "I"
    result = result.replace(/\bi\b/g, 'I');
  } else if (voice.capitalization === 'mixed') {
    // Mixed capitalization: sometimes capitalize, sometimes not
    if (rng.boolean(0.7)) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
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
 * Generate a full set of tweets for a persona (12-16 tweets)
 */
export function composeTweetSet(persona: RichPersona, seed: number): string[] {
  const tweets: string[] = [];
  const rng = new SeededRandom(seed);

  // MUST include: Pet clue
  tweets.push(composeTweet(persona, 'pet_clue', seed + 1));

  // MUST include: Location mention
  tweets.push(composeTweet(persona, 'location_clue', seed + 2));

  // Mix of other tweets based on persona - 10-14 additional tweets
  const tweetTypes = [
    'work_frustration',
    'hobby',
    'mundane',
    'mundane',
    'social',
    'emotional',
    'recent_event',
    'reply_to_friend',
    'reply_to_friend',
    'reaction',
    'boring_observation',
    'niche_interest',
    'imperfect_moment',
    'continuity_reference',
  ];

  // Randomly select 10-14 tweets from the types
  const selectedTypes = rng.shuffle(tweetTypes).slice(0, rng.int(10, 14));

  for (let i = 0; i < selectedTypes.length; i++) {
    tweets.push(composeTweet(persona, selectedTypes[i], seed + i + 3));
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
