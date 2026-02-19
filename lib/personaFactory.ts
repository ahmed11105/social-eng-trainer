/**
 * Persona Factory - Generates deeply detailed fictional personas
 * Each persona is unique enough that tweets derived from it will be unique
 */

import { faker } from '@faker-js/faker';

export interface RichPersona {
  // Core identity
  name: string;
  age: number;
  occupation: {
    title: string;
    workplace: string;
    yearsInRole: number;
    enjoys: string[];
    frustrations: string[];
  };
  location: string;

  // Living situation
  housing: string; // 'apartment alone', 'house with roommates', etc
  neighborhood: string;
  commute: string;

  // Daily rhythm
  wakeTime: string;
  sleepTime: string;
  coffeeHabit: string;
  mealPatterns: string;

  // Personality depth
  traits: string[];
  interests: Array<{
    name: string;
    level: 'casual' | 'serious' | 'obsessed';
    since: string;
  }>;
  petPeeves: string[];
  quirks: string[];

  // Social life
  relationshipStatus: string;
  friendCircle: Array<{
    handle: string;
    relationship: string;
    interactionStyle: string;
  }>;
  socialEnergy: 'introvert' | 'extrovert' | 'ambivert';

  // Voice characteristics
  voice: {
    punctuation: 'minimal' | 'normal' | 'excessive';
    capitalization: 'lowercase' | 'normal' | 'Title Case';
    emojiFrequency: 'never' | 'rare' | 'occasional' | 'frequent';
    slangLevel: 'none' | 'some' | 'heavy';
    typoTendency: 'careful' | 'occasional' | 'frequent';
    sentenceLength: 'short' | 'mixed' | 'rambling';
    recurringPhrases: string[];
  };

  // Recent life (last 60 days)
  recentEvents: Array<{
    daysAgo: number;
    event: string;
    emotion: string;
    stillAffecting: boolean;
  }>;

  // Current ongoing situations
  currentStruggles: string[];
  currentJoys: string[];

  // Pet (for password clue)
  pet: {
    name: string;
    type: 'dog' | 'cat';
    adoptionYear: number;
    personality: string;
    funFact: string;
  };
}

/**
 * Generate a complete, realistic persona
 */
export function generatePersona(seed: number): RichPersona {
  faker.seed(seed);

  const firstName = faker.person.firstName();
  const age = faker.number.int({ min: 22, max: 45 });

  // Generate occupation with depth
  const occupations = [
    { title: 'software developer', workplace: faker.company.name(), interests: ['coding late night', 'mechanical keyboards', 'coffee', 'debugging'], frustrations: ['meetings', 'legacy code', 'unclear requirements'] },
    { title: 'graphic designer', workplace: 'freelance', interests: ['typography', 'color theory', 'procrastination', 'coffee shops'], frustrations: ['client revisions', 'scope creep', 'imposter syndrome'] },
    { title: 'teacher', workplace: faker.company.name() + ' School', interests: ['lesson planning', 'student progress', 'summers off'], frustrations: ['grading', 'admin work', 'budget cuts'] },
    { title: 'barista', workplace: faker.company.name() + ' Coffee', interests: ['latte art', 'trying new beans', 'regulars'], frustrations: ['rushes', 'entitled customers', 'closing shifts'] },
    { title: 'retail worker', workplace: faker.company.name(), interests: ['organizing displays', 'employee discounts'], frustrations: ['customers', 'standing all day', 'weekends'] },
    { title: 'grad student', workplace: faker.company.name() + ' University', interests: ['research', 'conferences', 'avoiding thesis'], frustrations: ['advisor meetings', 'imposter syndrome', 'funding'] },
    { title: 'nurse', workplace: faker.company.name() + ' Hospital', interests: ['helping people', 'coworker banter'], frustrations: ['long shifts', 'difficult patients', 'paperwork'] },
    { title: 'delivery driver', workplace: faker.company.name(), interests: ['podcasts', 'good tips', 'quiet routes'], frustrations: ['traffic', 'parking', 'rude customers'] },
  ];

  const occupation = faker.helpers.arrayElement(occupations);

  // Generate interests with depth
  const hobbies = ['reading', 'gaming', 'cooking', 'hiking', 'photography', 'writing', 'drawing', 'music', 'gardening', 'crafts'];
  const interests = faker.helpers.arrayElements(hobbies, faker.number.int({ min: 2, max: 4 })).map(hobby => ({
    name: hobby,
    level: faker.helpers.arrayElement(['casual', 'serious', 'obsessed'] as const),
    since: faker.helpers.arrayElement(['childhood', 'college', 'recently', 'few years ago']),
  }));

  // Pet details
  const petNames = [faker.person.firstName(), faker.person.firstName()];
  const petType = faker.helpers.arrayElement(['dog', 'cat'] as const);
  const currentYear = new Date().getFullYear();
  const petAdoptionYear = faker.number.int({ min: 2010, max: currentYear - 1 });

  const pet = {
    name: faker.helpers.arrayElement(petNames),
    type: petType,
    adoptionYear: petAdoptionYear,
    personality: faker.helpers.arrayElement(['energetic', 'lazy', 'anxious', 'chill', 'needy', 'independent']),
    funFact: faker.helpers.arrayElement([
      'hates the mailman',
      'steals socks',
      'loves pizza',
      'scared of plastic bags',
      'sleeps in weird positions',
    ]),
  };

  // Voice characteristics
  const voice = {
    punctuation: faker.helpers.arrayElement(['minimal', 'normal', 'excessive'] as const),
    capitalization: faker.helpers.arrayElement(['lowercase', 'normal'] as const),
    emojiFrequency: faker.helpers.arrayElement(['never', 'rare', 'occasional', 'frequent'] as const),
    slangLevel: faker.helpers.arrayElement(['none', 'some', 'heavy'] as const),
    typoTendency: faker.helpers.arrayElement(['careful', 'occasional', 'frequent'] as const),
    sentenceLength: faker.helpers.arrayElement(['short', 'mixed', 'rambling'] as const),
    recurringPhrases: faker.helpers.arrayElements([
      'ngl', 'fr', 'lol', 'tbh', 'honestly', 'literally', 'rn', 'idk', 'lmao',
    ], faker.number.int({ min: 2, max: 4 })),
  };

  // Recent events that create tweet fodder
  const recentEvents = [];
  const eventTemplates = [
    { event: 'started a new project at work', emotion: 'excited but nervous', stillAffecting: true },
    { event: 'friend visited from out of town', emotion: 'happy', stillAffecting: false },
    { event: 'got sick for a week', emotion: 'frustrated', stillAffecting: false },
    { event: 'binged an entire show', emotion: 'satisfied but unproductive', stillAffecting: false },
    { event: 'had a really good meal at a new restaurant', emotion: 'content', stillAffecting: false },
    { event: 'car broke down', emotion: 'stressed', stillAffecting: true },
    { event: 'adopted a new routine', emotion: 'hopeful', stillAffecting: true },
  ];

  for (let i = 0; i < 3; i++) {
    const template = faker.helpers.arrayElement(eventTemplates);
    recentEvents.push({
      daysAgo: faker.number.int({ min: 1, max: 60 }),
      event: template.event,
      emotion: template.emotion,
      stillAffecting: template.stillAffecting,
    });
  }

  // Fictional friends for @ mentions
  const friendCircle = [
    {
      handle: '@' + faker.internet.username().toLowerCase(),
      relationship: 'college friend',
      interactionStyle: 'frequent banter',
    },
    {
      handle: '@' + faker.internet.username().toLowerCase(),
      relationship: 'coworker',
      interactionStyle: 'occasional tags',
    },
  ];

  return {
    name: firstName,
    age,
    occupation: {
      title: occupation.title,
      workplace: occupation.workplace,
      yearsInRole: faker.number.int({ min: 1, max: 10 }),
      enjoys: occupation.interests,
      frustrations: occupation.frustrations,
    },
    location: faker.location.city(),

    housing: faker.helpers.arrayElement([
      'apartment alone',
      'apartment with roommate',
      'house with partner',
      'parents house',
    ]),
    neighborhood: faker.helpers.arrayElement(['quiet', 'busy', 'suburban', 'downtown']),
    commute: faker.helpers.arrayElement(['walk', '15min drive', 'bus', 'work from home']),

    wakeTime: faker.helpers.arrayElement(['6am', '7am', '8am', '9am', 'whenever']),
    sleepTime: faker.helpers.arrayElement(['10pm', '11pm', 'midnight', '1am', '2am']),
    coffeeHabit: faker.helpers.arrayElement([
      'multiple cups daily',
      'one good cup',
      'tea person actually',
      'energy drinks',
    ]),
    mealPatterns: faker.helpers.arrayElement([
      'meal prep sundays',
      'takeout most days',
      'cook when motivated',
      'skip breakfast always',
    ]),

    traits: faker.helpers.arrayElements([
      'anxious', 'chill', 'ambitious', 'lazy', 'overthinker', 'spontaneous', 'organized', 'messy',
    ], 3),

    interests,

    petPeeves: faker.helpers.arrayElements([
      'slow walkers',
      'loud chewing',
      'people who dont signal',
      'being late',
      'small talk',
      'phone calls',
    ], 3),

    quirks: faker.helpers.arrayElements([
      'always cold',
      'night owl',
      'talks to self',
      'collects weird things',
      'never answers texts',
    ], 2),

    relationshipStatus: faker.helpers.arrayElement([
      'single',
      'in a relationship',
      'its complicated',
      'not looking',
    ]),

    friendCircle,
    socialEnergy: faker.helpers.arrayElement(['introvert', 'extrovert', 'ambivert'] as const),

    voice,

    recentEvents: recentEvents.sort((a, b) => a.daysAgo - b.daysAgo),

    currentStruggles: faker.helpers.arrayElements([
      'sleep schedule is messed up',
      'procrastinating on important thing',
      'spending too much money',
      'not exercising enough',
      'phone addiction',
    ], 2),

    currentJoys: faker.helpers.arrayElements([
      'new hobby',
      'good friend group',
      'finally feeling rested',
      'nice weather lately',
    ], 1),

    pet,
  };
}
