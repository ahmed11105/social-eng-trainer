/**
 * Persona Factory - Generates deeply detailed fictional personas
 * Each persona is unique enough that tweets derived from it will be unique
 * Uses archetype-based generation for maximum realism and diversity
 */

import { faker } from '@faker-js/faker';

export type Archetype =
  | 'corporate_professional'
  | 'casual_adult'
  | 'internet_native'
  | 'hobby_enthusiast'
  | 'parent_family'
  | 'student_young_adult'
  | 'creative_artist'
  | 'tech_engineering'
  | 'healthcare_worker'
  | 'local_community'
  | 'opinionated_commentator'
  | 'quiet_low_activity';

export interface RichPersona {
  // Core identity
  archetype: Archetype;
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
  bio: string; // Generated bio based on archetype

  // Living situation
  housing: string;
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
    name: string;
    relationship: string;
    interactionStyle: string;
  }>;
  socialEnergy: 'introvert' | 'extrovert' | 'ambivert';

  // Voice characteristics
  voice: {
    punctuation: 'minimal' | 'normal' | 'excessive';
    capitalization: 'lowercase' | 'normal' | 'mixed';
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
 * Generate age appropriate for archetype
 */
function generateAgeForArchetype(archetype: Archetype): number {
  switch (archetype) {
    case 'student_young_adult':
      return faker.number.int({ min: 19, max: 25 });
    case 'internet_native':
      return faker.number.int({ min: 20, max: 27 });
    case 'parent_family':
      return faker.number.int({ min: 28, max: 45 });
    case 'corporate_professional':
      return faker.number.int({ min: 27, max: 42 });
    default:
      return faker.number.int({ min: 24, max: 40 });
  }
}

/**
 * Generate occupation based on archetype
 */
function generateOccupationForArchetype(archetype: Archetype) {
  const occupationsByArchetype: Record<Archetype, any[]> = {
    corporate_professional: [
      { title: 'Account Manager', workplace: faker.company.name(), interests: ['client relationships', 'sales targets', 'networking'], frustrations: ['long meetings', 'competing priorities', 'email overload'] },
      { title: 'Sr. Consultant', workplace: faker.company.name() + ' Consulting', interests: ['strategy work', 'presentations', 'travel perks'], frustrations: ['constant travel', 'tight deadlines', 'scope changes'] },
      { title: 'Marketing Director', workplace: faker.company.name(), interests: ['campaign planning', 'data analysis', 'brand building'], frustrations: ['budget constraints', 'stakeholder management', 'last-minute changes'] },
      { title: 'Product Manager', workplace: faker.company.name(), interests: ['roadmap planning', 'user feedback', 'launches'], frustrations: ['conflicting priorities', 'technical debt', 'stakeholder alignment'] },
    ],
    casual_adult: [
      { title: 'Office Administrator', workplace: faker.company.name(), interests: ['organization', 'coffee breaks', 'helping coworkers'], frustrations: ['printer jams', 'scheduling conflicts', 'budget cuts'] },
      { title: 'Retail Manager', workplace: faker.company.name(), interests: ['inventory organization', 'employee development', 'sales goals'], frustrations: ['difficult customers', 'staffing issues', 'weekend shifts'] },
      { title: 'Customer Service Rep', workplace: faker.company.name(), interests: ['problem solving', 'helping people', 'quiet days'], frustrations: ['angry customers', 'metrics', 'repetitive questions'] },
      { title: 'Administrative Assistant', workplace: faker.company.name(), interests: ['staying organized', 'office culture', 'efficient workflows'], frustrations: ['last-minute requests', 'unclear instructions', 'being undervalued'] },
    ],
    internet_native: [
      { title: 'Video Editor', workplace: 'freelance', interests: ['editing software', 'creative projects', 'online communities'], frustrations: ['client revisions', 'render times', 'unclear briefs'] },
      { title: 'Social Media Coordinator', workplace: faker.company.name(), interests: ['content creation', 'engagement metrics', 'trends'], frustrations: ['algorithm changes', 'comment moderation', 'unrealistic expectations'] },
      { title: 'Content Creator', workplace: 'self-employed', interests: ['video editing', 'community building', 'creative freedom'], frustrations: ['burnout', 'algorithm changes', 'inconsistent income'] },
      { title: 'Freelance Designer', workplace: 'freelance', interests: ['creative work', 'flexible schedule', 'side projects'], frustrations: ['difficult clients', 'unpredictable income', 'self-promotion'] },
    ],
    hobby_enthusiast: [
      { title: 'Software Developer', workplace: faker.company.name(), interests: ['side projects', 'learning new tech', 'conferences'], frustrations: ['legacy code', 'meetings', 'unclear requirements'] },
      { title: 'Accountant', workplace: faker.company.name(), interests: ['number accuracy', 'organization', 'tax season completion'], frustrations: ['tax season stress', 'client disorganization', 'regulation changes'] },
      { title: 'Librarian', workplace: faker.location.city() + ' Public Library', interests: ['book recommendations', 'helping patrons', 'quiet reading time'], frustrations: ['budget cuts', 'system outages', 'loud patrons'] },
    ],
    parent_family: [
      { title: 'Elementary Teacher', workplace: faker.location.city() + ' Elementary', interests: ['student progress', 'lesson planning', 'summer break'], frustrations: ['parent emails', 'admin work', 'lack of supplies'] },
      { title: 'HR Specialist', workplace: faker.company.name(), interests: ['employee relations', 'work-life balance', 'company culture'], frustrations: ['difficult conversations', 'compliance paperwork', 'being the bad guy'] },
      { title: 'Real Estate Agent', workplace: faker.company.name() + ' Realty', interests: ['helping families', 'closing deals', 'flexible schedule'], frustrations: ['weekend showings', 'demanding clients', 'market fluctuations'] },
    ],
    student_young_adult: [
      { title: 'College Student', workplace: faker.location.city() + ' University', interests: ['learning', 'campus life', 'avoiding assignments'], frustrations: ['exams', 'group projects', 'broke student life'] },
      { title: 'Grad Student', workplace: faker.location.city() + ' University', interests: ['research', 'teaching', 'academic community'], frustrations: ['advisor meetings', 'funding stress', 'imposter syndrome'] },
      { title: 'Barista', workplace: faker.company.name() + ' Coffee', interests: ['latte art', 'regular customers', 'free coffee'], frustrations: ['early mornings', 'entitled customers', 'minimum wage'] },
      { title: 'Retail Associate', workplace: faker.company.name(), interests: ['employee discount', 'coworker friendships', 'easy shifts'], frustrations: ['rude customers', 'standing all day', 'unpredictable schedule'] },
    ],
    creative_artist: [
      { title: 'Graphic Designer', workplace: 'freelance', interests: ['typography', 'color theory', 'creative freedom'], frustrations: ['client feedback', 'scope creep', 'deadlines'] },
      { title: 'Illustrator', workplace: 'self-employed', interests: ['drawing', 'commission work', 'art community'], frustrations: ['art block', 'underpricing', 'exposure requests'] },
      { title: 'Photographer', workplace: 'freelance', interests: ['composition', 'editing', 'creative projects'], frustrations: ['difficult clients', 'equipment costs', 'inconsistent work'] },
      { title: 'Writer', workplace: 'freelance', interests: ['storytelling', 'research', 'editing'], frustrations: ['writer\'s block', 'rejection', 'low pay'] },
    ],
    tech_engineering: [
      { title: 'Software Engineer', workplace: faker.company.name(), interests: ['coding', 'system design', 'new technologies'], frustrations: ['legacy code', 'unclear requirements', 'too many meetings'] },
      { title: 'DevOps Engineer', workplace: faker.company.name(), interests: ['automation', 'infrastructure', 'optimization'], frustrations: ['on-call rotations', 'production incidents', 'tech debt'] },
      { title: 'Data Analyst', workplace: faker.company.name(), interests: ['finding insights', 'visualization', 'clean data'], frustrations: ['messy data', 'unclear questions', 'data quality issues'] },
      { title: 'IT Support Specialist', workplace: faker.company.name(), interests: ['problem solving', 'helping users', 'learning systems'], frustrations: ['user error', 'ticket volume', 'being blamed'] },
    ],
    healthcare_worker: [
      { title: 'Registered Nurse', workplace: faker.location.city() + ' Hospital', interests: ['patient care', 'coworker support', 'learning'], frustrations: ['understaffing', 'long shifts', 'difficult patients'] },
      { title: 'Physical Therapist', workplace: faker.company.name() + ' Clinic', interests: ['helping recovery', 'patient progress', 'movement science'], frustrations: ['insurance paperwork', 'no-shows', 'documentation burden'] },
      { title: 'Medical Assistant', workplace: faker.company.name() + ' Medical', interests: ['patient interaction', 'routine', 'helping people'], frustrations: ['long hours', 'difficult patients', 'administrative work'] },
    ],
    local_community: [
      { title: 'Small Business Owner', workplace: 'self-employed', interests: ['serving community', 'independence', 'regular customers'], frustrations: ['unpredictable revenue', 'long hours', 'competition'] },
      { title: 'Elementary Teacher', workplace: faker.location.city() + ' Elementary', interests: ['teaching kids', 'community impact', 'summers off'], frustrations: ['pay', 'parent complaints', 'admin work'] },
      { title: 'Postal Worker', workplace: 'USPS', interests: ['routine', 'being outside', 'knowing neighbors'], frustrations: ['weather', 'dogs', 'package volume'] },
    ],
    opinionated_commentator: [
      { title: 'Journalist', workplace: faker.company.name() + ' News', interests: ['reporting', 'investigation', 'public discourse'], frustrations: ['deadlines', 'editorial constraints', 'public backlash'] },
      { title: 'Policy Analyst', workplace: faker.company.name() + ' Institute', interests: ['research', 'writing reports', 'public policy'], frustrations: ['political gridlock', 'funding', 'being misquoted'] },
      { title: 'Teacher', workplace: faker.location.city() + ' High School', interests: ['education', 'student growth', 'curriculum'], frustrations: ['standardized testing', 'politics in education', 'lack of resources'] },
    ],
    quiet_low_activity: [
      { title: 'Data Entry Clerk', workplace: faker.company.name(), interests: ['routine work', 'accuracy', 'quiet time'], frustrations: ['repetitive tasks', 'eye strain', 'tight deadlines'] },
      { title: 'Lab Technician', workplace: faker.company.name() + ' Labs', interests: ['precision work', 'research', 'quiet environment'], frustrations: ['equipment failures', 'contamination', 'long processes'] },
      { title: 'Archivist', workplace: faker.location.city() + ' Museum', interests: ['preservation', 'organization', 'historical research'], frustrations: ['limited budget', 'physical demands', 'climate control issues'] },
    ],
  };

  return faker.helpers.arrayElement(occupationsByArchetype[archetype]);
}

/**
 * Generate voice characteristics based on archetype
 */
function generateVoiceForArchetype(archetype: Archetype) {
  const voiceProfiles: Record<Archetype, any> = {
    corporate_professional: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: faker.helpers.arrayElement(['never', 'rare'] as const),
      slangLevel: 'none',
      typoTendency: 'careful',
      sentenceLength: faker.helpers.arrayElement(['mixed', 'rambling'] as const),
      recurringPhrases: faker.helpers.arrayElements(['Congrats', 'Looking forward', 'Great to see', 'Thanks for'], faker.number.int({ min: 1, max: 2 })),
    },
    casual_adult: {
      punctuation: faker.helpers.arrayElement(['minimal', 'normal'] as const),
      capitalization: faker.helpers.arrayElement(['normal', 'mixed'] as const),
      emojiFrequency: faker.helpers.arrayElement(['rare', 'occasional'] as const),
      slangLevel: faker.helpers.arrayElement(['none', 'some'] as const),
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: faker.helpers.arrayElements(['lol', 'honestly', 'literally', 'omg'], faker.number.int({ min: 1, max: 3 })),
    },
    internet_native: {
      punctuation: 'minimal',
      capitalization: 'lowercase',
      emojiFrequency: faker.helpers.arrayElement(['occasional', 'frequent'] as const),
      slangLevel: 'heavy',
      typoTendency: faker.helpers.arrayElement(['occasional', 'frequent'] as const),
      sentenceLength: 'short',
      recurringPhrases: faker.helpers.arrayElements(['ngl', 'fr', 'lmao', 'tbh', 'rn', 'omg', 'literally'], faker.number.int({ min: 3, max: 5 })),
    },
    hobby_enthusiast: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: faker.helpers.arrayElement(['rare', 'occasional'] as const),
      slangLevel: 'some',
      typoTendency: 'occasional',
      sentenceLength: faker.helpers.arrayElement(['mixed', 'rambling'] as const),
      recurringPhrases: faker.helpers.arrayElements(['honestly', 'finally', 'love this'], faker.number.int({ min: 1, max: 2 })),
    },
    parent_family: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: 'occasional',
      slangLevel: 'none',
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: faker.helpers.arrayElements(['Exhausted', 'So proud', 'Can\'t believe', 'Anyone else'], faker.number.int({ min: 1, max: 2 })),
    },
    student_young_adult: {
      punctuation: faker.helpers.arrayElement(['minimal', 'normal'] as const),
      capitalization: faker.helpers.arrayElement(['lowercase', 'normal', 'mixed'] as const),
      emojiFrequency: faker.helpers.arrayElement(['occasional', 'frequent'] as const),
      slangLevel: faker.helpers.arrayElement(['some', 'heavy'] as const),
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: faker.helpers.arrayElements(['lol', 'omg', 'literally', 'tbh', 'ngl'], faker.number.int({ min: 2, max: 4 })),
    },
    creative_artist: {
      punctuation: faker.helpers.arrayElement(['minimal', 'normal', 'excessive'] as const),
      capitalization: faker.helpers.arrayElement(['normal', 'mixed'] as const),
      emojiFrequency: faker.helpers.arrayElement(['occasional', 'frequent'] as const),
      slangLevel: 'some',
      typoTendency: 'occasional',
      sentenceLength: faker.helpers.arrayElement(['mixed', 'rambling'] as const),
      recurringPhrases: faker.helpers.arrayElements(['ugh', 'love this', 'honestly', 'so tired'], faker.number.int({ min: 1, max: 3 })),
    },
    tech_engineering: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: faker.helpers.arrayElement(['never', 'rare'] as const),
      slangLevel: 'some',
      typoTendency: 'careful',
      sentenceLength: 'mixed',
      recurringPhrases: faker.helpers.arrayElements(['finally', 'honestly', 'lol'], faker.number.int({ min: 1, max: 2 })),
    },
    healthcare_worker: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: 'rare',
      slangLevel: 'some',
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: faker.helpers.arrayElements(['Exhausted', 'Long shift', 'Finally home'], faker.number.int({ min: 1, max: 2 })),
    },
    local_community: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: 'occasional',
      slangLevel: 'none',
      typoTendency: 'careful',
      sentenceLength: 'mixed',
      recurringPhrases: faker.helpers.arrayElements(['Love seeing', 'Great to', 'Thanks to', 'Proud of'], faker.number.int({ min: 1, max: 2 })),
    },
    opinionated_commentator: {
      punctuation: faker.helpers.arrayElement(['normal', 'excessive'] as const),
      capitalization: 'normal',
      emojiFrequency: 'never',
      slangLevel: 'none',
      typoTendency: 'careful',
      sentenceLength: 'rambling',
      recurringPhrases: faker.helpers.arrayElements(['Honestly', 'The fact that', 'It\'s absurd that', 'We need to'], faker.number.int({ min: 1, max: 3 })),
    },
    quiet_low_activity: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: 'never',
      slangLevel: 'none',
      typoTendency: 'careful',
      sentenceLength: 'short',
      recurringPhrases: [],
    },
  };

  return voiceProfiles[archetype];
}

/**
 * Generate bio based on archetype and persona details
 */
function generateBio(archetype: Archetype, occupation: any, location: string, pet: any): string {
  const bioTemplates: Record<Archetype, string[]> = {
    corporate_professional: [
      `${occupation.title} @ ${occupation.workplace} | ${location} | Views are my own`,
      `${occupation.title} | ${location} based | ${pet.type} dad/mom`,
      `Sr. ${occupation.title} | ${location} | ${pet.name}'s human`,
      `${occupation.title} @ ${occupation.workplace} | MBA | ${location}`,
    ],
    casual_adult: [
      `${occupation.title}. ${location} based. ${pet.type} mom to ${pet.name}`,
      `${occupation.title}. Coffee dependent. ${location}.`,
      `${location} | ${occupation.title} | ${pet.type} parent 🐾`,
      `Just trying to survive. ${occupation.title}. ${location}.`,
    ],
    internet_native: [
      `${faker.number.int({ min: 20, max: 27 })} | ${occupation.title.toLowerCase()} | ${location.toLowerCase()} | void screaming`,
      `${occupation.title.toLowerCase()} | chronically online | ${pet.name.toLowerCase()}'s human`,
      `${location.toLowerCase()} based | ${occupation.title.toLowerCase()} | professional mess`,
      `${occupation.title.toLowerCase()} | ${faker.number.int({ min: 20, max: 27 })} | ${location.toLowerCase()} | chaotic energy`,
    ],
    hobby_enthusiast: [
      `${occupation.title} | ${location} | Passionate about ${faker.helpers.arrayElement(['hiking', 'photography', 'cooking', 'reading'])}`,
      `${occupation.title}. ${location}. Weekend ${faker.helpers.arrayElement(['hiker', 'photographer', 'gamer', 'cook'])}.`,
      `${location} based ${occupation.title}. ${pet.type} lover. Hobby collector.`,
    ],
    parent_family: [
      `${occupation.title} | Parent to ${faker.number.int({ min: 1, max: 3 })} | ${location}`,
      `Mom/Dad | ${occupation.title} | ${location} | Coffee powered`,
      `${occupation.title}. Parent. ${location}. Tired always.`,
    ],
    student_young_adult: [
      `${occupation.title} @ ${occupation.workplace} | ${faker.number.int({ min: 19, max: 25 })} | ${location}`,
      `college student | ${location} | perpetually tired`,
      `${occupation.workplace} | ${location} | broke but vibing`,
    ],
    creative_artist: [
      `${occupation.title} | ${location} | commissions ${faker.helpers.arrayElement(['open', 'closed', 'DM for info'])}`,
      `freelance ${occupation.title.toLowerCase()} | ${location} based | coffee dependent`,
      `${occupation.title}. ${location}. Making things.`,
    ],
    tech_engineering: [
      `${occupation.title} @ ${occupation.workplace} | ${location} | ${pet.name}'s human`,
      `Software engineer. ${location}. Debugger of code and life.`,
      `${occupation.title} | ${location} based | mechanical keyboard enthusiast`,
    ],
    healthcare_worker: [
      `${occupation.title} | ${location} | ${occupation.workplace}`,
      `${occupation.title}. ${location}. Saving lives and sanity.`,
      `RN @ ${occupation.workplace} | ${location} | ${pet.type} mom/dad`,
    ],
    local_community: [
      `${occupation.title} | Proud ${location} resident | Community advocate`,
      `${location} local | ${occupation.title} | Supporting our community`,
      `Born and raised ${location} | ${occupation.title}`,
    ],
    opinionated_commentator: [
      `${occupation.title} | ${location} | Opinions my own and often strong`,
      `${occupation.title}. ${location}. Thoughts on politics, policy, life.`,
      `${occupation.title} | ${location} | Speaking truth to power`,
    ],
    quiet_low_activity: [
      `${occupation.title} | ${location}`,
      `${location} based ${occupation.title}`,
      `${occupation.title}. ${location}.`,
    ],
  };

  return faker.helpers.arrayElement(bioTemplates[archetype])
    .replace('dad/mom', faker.helpers.arrayElement(['dad', 'mom']))
    .replace('Mom/Dad', faker.helpers.arrayElement(['Mom', 'Dad']))
    .replace('mom/dad', faker.helpers.arrayElement(['mom', 'dad']));
}

/**
 * Generate a complete, realistic persona based on archetype
 */
export function generatePersona(seed: number): RichPersona {
  faker.seed(seed);

  // Step 1: Select archetype
  const archetypes: Archetype[] = [
    'corporate_professional',
    'casual_adult',
    'internet_native',
    'hobby_enthusiast',
    'parent_family',
    'student_young_adult',
    'creative_artist',
    'tech_engineering',
    'healthcare_worker',
    'local_community',
    'opinionated_commentator',
    'quiet_low_activity',
  ];

  const archetype = faker.helpers.arrayElement(archetypes);

  // Step 2: Generate age appropriate for archetype
  const age = generateAgeForArchetype(archetype);

  const firstName = faker.person.firstName();

  // Step 3: Generate occupation based on archetype
  const occupation = generateOccupationForArchetype(archetype);

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

  // Voice characteristics based on archetype
  const voice = generateVoiceForArchetype(archetype);

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
      name: faker.person.firstName(),
      relationship: faker.helpers.arrayElement(['college friend', 'high school friend', 'friend from work', 'old roommate']),
      interactionStyle: 'frequent banter',
    },
    {
      handle: '@' + faker.internet.username().toLowerCase(),
      name: faker.person.firstName(),
      relationship: faker.helpers.arrayElement(['coworker', 'work friend', 'colleague']),
      interactionStyle: 'occasional tags',
    },
    {
      handle: '@' + faker.internet.username().toLowerCase(),
      name: faker.person.firstName(),
      relationship: faker.helpers.arrayElement(['gym buddy', 'neighbor', 'friend', 'mutual']),
      interactionStyle: 'occasional interaction',
    },
  ];

  // Generate bio
  const bio = generateBio(archetype, occupation, faker.location.city(), pet);

  return {
    archetype,
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
    bio,

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
