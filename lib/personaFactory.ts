/**
 * Persona Factory - Generates deeply detailed fictional personas
 * Each persona is unique enough that tweets derived from it will be unique
 * Uses archetype-based generation for maximum realism and diversity
 */

import { faker } from '@faker-js/faker';

/**
 * Seeded random number generator for deterministic but varied results
 */
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
  picks<T>(arr: T[], count: number): T[] {
    const result: T[] = [];
    const copy = [...arr];
    for (let i = 0; i < Math.min(count, copy.length); i++) {
      const index = Math.floor(this.next() * copy.length);
      result.push(copy[index]);
      copy.splice(index, 1);
    }
    return result;
  }
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

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
  displayName: string; // The name shown on profile (can be styled/emoji/alias)
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
function generateOccupationForArchetype(archetype: Archetype, rng: SeededRandom) {
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

  return rng.pick(occupationsByArchetype[archetype]);
}

/**
 * Generate voice characteristics based on archetype
 */
function generateVoiceForArchetype(archetype: Archetype, rng: SeededRandom) {
  const voiceProfiles: Record<Archetype, any> = {
    corporate_professional: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: rng.pick(['never', 'rare'] as const),
      slangLevel: 'none',
      typoTendency: 'careful',
      sentenceLength: rng.pick(['mixed', 'rambling'] as const),
      recurringPhrases: rng.picks(['Congrats', 'Looking forward', 'Great to see', 'Thanks for'], rng.int(1, 2)),
    },
    casual_adult: {
      punctuation: rng.pick(['minimal', 'normal'] as const),
      capitalization: rng.pick(['normal', 'mixed'] as const),
      emojiFrequency: rng.pick(['rare', 'occasional'] as const),
      slangLevel: rng.pick(['none', 'some'] as const),
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: rng.picks(['lol', 'honestly', 'literally', 'omg'], rng.int(1, 3)),
    },
    internet_native: {
      punctuation: 'minimal',
      capitalization: 'lowercase',
      emojiFrequency: rng.pick(['occasional', 'frequent'] as const),
      slangLevel: 'heavy',
      typoTendency: rng.pick(['occasional', 'frequent'] as const),
      sentenceLength: 'short',
      recurringPhrases: rng.picks(['ngl', 'fr', 'lmao', 'tbh', 'rn', 'omg', 'literally'], rng.int(3, 5)),
    },
    hobby_enthusiast: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: rng.pick(['rare', 'occasional'] as const),
      slangLevel: 'some',
      typoTendency: 'occasional',
      sentenceLength: rng.pick(['mixed', 'rambling'] as const),
      recurringPhrases: rng.picks(['honestly', 'finally', 'love this'], rng.int(1, 2)),
    },
    parent_family: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: 'occasional',
      slangLevel: 'none',
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: rng.picks(['Exhausted', 'So proud', 'Can\'t believe', 'Anyone else'], rng.int(1, 2)),
    },
    student_young_adult: {
      punctuation: rng.pick(['minimal', 'normal'] as const),
      capitalization: rng.pick(['lowercase', 'normal', 'mixed'] as const),
      emojiFrequency: rng.pick(['occasional', 'frequent'] as const),
      slangLevel: rng.pick(['some', 'heavy'] as const),
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: rng.picks(['lol', 'omg', 'literally', 'tbh', 'ngl'], rng.int(2, 4)),
    },
    creative_artist: {
      punctuation: rng.pick(['minimal', 'normal', 'excessive'] as const),
      capitalization: rng.pick(['normal', 'mixed'] as const),
      emojiFrequency: rng.pick(['occasional', 'frequent'] as const),
      slangLevel: 'some',
      typoTendency: 'occasional',
      sentenceLength: rng.pick(['mixed', 'rambling'] as const),
      recurringPhrases: rng.picks(['ugh', 'love this', 'honestly', 'so tired'], rng.int(1, 3)),
    },
    tech_engineering: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: rng.pick(['never', 'rare'] as const),
      slangLevel: 'some',
      typoTendency: 'careful',
      sentenceLength: 'mixed',
      recurringPhrases: rng.picks(['finally', 'honestly', 'lol'], rng.int(1, 2)),
    },
    healthcare_worker: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: 'rare',
      slangLevel: 'some',
      typoTendency: 'occasional',
      sentenceLength: 'mixed',
      recurringPhrases: rng.picks(['Exhausted', 'Long shift', 'Finally home'], rng.int(1, 2)),
    },
    local_community: {
      punctuation: 'normal',
      capitalization: 'normal',
      emojiFrequency: 'occasional',
      slangLevel: 'none',
      typoTendency: 'careful',
      sentenceLength: 'mixed',
      recurringPhrases: rng.picks(['Love seeing', 'Great to', 'Thanks to', 'Proud of'], rng.int(1, 2)),
    },
    opinionated_commentator: {
      punctuation: rng.pick(['normal', 'excessive'] as const),
      capitalization: 'normal',
      emojiFrequency: 'never',
      slangLevel: 'none',
      typoTendency: 'careful',
      sentenceLength: 'rambling',
      recurringPhrases: rng.picks(['Honestly', 'The fact that', 'It\'s absurd that', 'We need to'], rng.int(1, 3)),
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
function generateBio(archetype: Archetype, occupation: any, location: string, pet: any, rng: SeededRandom): string {
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
      `${rng.int(20, 27)} | ${occupation.title.toLowerCase()} | ${location.toLowerCase()} | void screaming`,
      `${occupation.title.toLowerCase()} | chronically online | ${pet.name.toLowerCase()}'s human`,
      `${location.toLowerCase()} based | ${occupation.title.toLowerCase()} | professional mess`,
      `${occupation.title.toLowerCase()} | ${rng.int(20, 27)} | ${location.toLowerCase()} | chaotic energy`,
    ],
    hobby_enthusiast: [
      `${occupation.title} | ${location} | Passionate about ${rng.pick(['hiking', 'photography', 'cooking', 'reading'])}`,
      `${occupation.title}. ${location}. Weekend ${rng.pick(['hiker', 'photographer', 'gamer', 'cook'])}.`,
      `${location} based ${occupation.title}. ${pet.type} lover. Hobby collector.`,
    ],
    parent_family: [
      `${occupation.title} | Parent to ${rng.int(1, 3)} | ${location}`,
      `Mom/Dad | ${occupation.title} | ${location} | Coffee powered`,
      `${occupation.title}. Parent. ${location}. Tired always.`,
    ],
    student_young_adult: [
      `${occupation.title} @ ${occupation.workplace} | ${rng.int(19, 25)} | ${location}`,
      `college student | ${location} | perpetually tired`,
      `${occupation.workplace} | ${location} | broke but vibing`,
    ],
    creative_artist: [
      `${occupation.title} | ${location} | commissions ${rng.pick(['open', 'closed', 'DM for info'])}`,
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

  return rng.pick(bioTemplates[archetype])
    .replace('dad/mom', rng.pick(['dad', 'mom']))
    .replace('Mom/Dad', rng.pick(['Mom', 'Dad']))
    .replace('mom/dad', rng.pick(['mom', 'dad']));
}

/**
 * Generate archetype-appropriate display name
 * Uses fancy text, emojis, symbols, or online aliases based on personality
 */
function generateDisplayName(firstName: string, archetype: Archetype, rng: SeededRandom): string {
  const lastName = faker.person.lastName();

  switch (archetype) {
    case 'corporate_professional':
    case 'healthcare_worker':
    case 'local_community':
      // Professional: Full real names
      return rng.pick([
        `${firstName} ${lastName}`,
        `${firstName} ${lastName.charAt(0)}.`,
        firstName,
      ]);

    case 'internet_native':
      // Internet native: Fancy text, symbols, online aliases, emojis
      return rng.pick([
        // Fancy Unicode text
        `${toFancyText(firstName.toLowerCase())}`,
        // Symbol decorations
        `✨${firstName.toLowerCase()}✨`,
        `${firstName.toLowerCase()} ⭐`,
        `★ ${firstName.toLowerCase()} ★`,
        `~ ${firstName.toLowerCase()} ~`,
        // Gamer/online aliases
        `xX_${firstName.toLowerCase()}_Xx`,
        `${firstName.toLowerCase()}${rng.int(100, 9999)}`,
        `${firstName.toLowerCase()}.${faker.word.noun().toLowerCase()}`,
        // Emoji heavy
        `${firstName.toLowerCase()} ${rng.pick(['💫', '🌙', '✨', '🦋', '🌸', '💎'])}`,
        // All lowercase aesthetic
        `${firstName.toLowerCase()}`,
        `${firstName.toLowerCase()}${rng.pick(['', '.', '..', '...'])}`,
      ]);

    case 'creative_artist':
      // Creative: Artistic symbols, aesthetic
      return rng.pick([
        `★ ${firstName} ★`,
        `♡ ${firstName.toLowerCase()} ♡`,
        `${firstName} ${rng.pick(['🎨', '✨', '🌙', '☆'])}`,
        `${firstName.toLowerCase()} | ${rng.pick(['artist', 'creative', 'designer'])}`,
        `${toFancyText(firstName)}`,
        firstName,
      ]);

    case 'tech_engineering':
      // Tech: Underscores, tech references, lowercase
      return rng.pick([
        `${firstName.toLowerCase()}_${rng.pick(['dev', 'codes', 'builds'])}`,
        `${firstName.toLowerCase()}${rng.int(10, 99)}`,
        `${firstName} | ${rng.pick(['Developer', 'Engineer', 'Tech'])}`,
        firstName,
        `${firstName.toLowerCase()}`,
      ]);

    case 'student_young_adult':
      // Students: Casual, emojis, simple variations
      return rng.pick([
        `${firstName} ${rng.pick(['🎓', '📚', '✌️', '💙', '✨', ''])}`,
        `${firstName.toLowerCase()}`,
        `${firstName}.`,
        firstName,
        `${firstName.toLowerCase()}${rng.int(0, 9)}`,
      ]);

    case 'parent_family':
      // Parents: Real names, family indicators
      return rng.pick([
        `${firstName} ${lastName}`,
        `${firstName} | ${rng.pick(['Mom', 'Dad', 'Parent'])}`,
        `${rng.pick(['Mom', 'Dad'])} of ${rng.int(1, 4)}`,
        firstName,
      ]);

    case 'casual_adult':
      // Casual: Real names, maybe simple emoji
      return rng.pick([
        `${firstName} ${lastName}`,
        `${firstName} ${rng.pick(['💙', '❤️', '✨', ''])}`,
        firstName,
        `${firstName} ${lastName.charAt(0)}.`,
      ]);

    case 'hobby_enthusiast':
      // Hobby enthusiast: Name with hobby reference
      const hobbies = ['📷', '🎮', '🎨', '🏃', '🎸', '📖', '🌱', '🍳'];
      return rng.pick([
        `${firstName} ${rng.pick(hobbies)}`,
        `${firstName} | ${rng.pick(['Photography', 'Gamer', 'Artist', 'Runner'])}`,
        firstName,
        `${firstName} ${lastName}`,
      ]);

    case 'opinionated_commentator':
      // Opinionated: Bold names, all caps options, real names
      return rng.pick([
        `${firstName.toUpperCase()}`,
        `THE ${firstName.toUpperCase()}`,
        `Real Talk ${firstName}`,
        `${firstName} ${lastName}`,
        firstName,
        `${firstName} | ${rng.pick(['Truth Seeker', 'Unfiltered', 'Real One'])}`,
      ]);

    case 'quiet_low_activity':
      // Quiet: Simple, lowercase, minimal
      return rng.pick([
        firstName.toLowerCase(),
        firstName,
        `${firstName.toLowerCase()}`,
      ]);

    default:
      return firstName;
  }
}

/**
 * Convert text to fancy Unicode characters (mathematical alphanumeric symbols)
 */
function toFancyText(text: string): string {
  // Using Mathematical Bold Italic Small Letters (U+1D4EA to U+1D503)
  const fancyChars: Record<string, string> = {
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇',
    'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍',
    'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓',
    's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙',
    'y': '𝒚', 'z': '𝒛',
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => fancyChars[char] || char)
    .join('');
}

/**
 * Generate a complete, realistic persona based on archetype
 */
export function generatePersona(seed: number): RichPersona {
  faker.seed(seed);
  const rng = new SeededRandom(seed + 1000); // Offset seed for variety

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

  const archetype = rng.pick(archetypes);

  // Step 2: Generate age appropriate for archetype
  const age = generateAgeForArchetype(archetype);

  const firstName = faker.person.firstName();

  // Step 3: Generate occupation based on archetype
  const occupation = generateOccupationForArchetype(archetype, rng);

  // Generate interests with depth
  const hobbies = ['reading', 'gaming', 'cooking', 'hiking', 'photography', 'writing', 'drawing', 'music', 'gardening', 'crafts'];
  const interests = rng.picks(hobbies, rng.int(2, 4)).map(hobby => ({
    name: hobby,
    level: rng.pick(['casual', 'serious', 'obsessed'] as const),
    since: rng.pick(['childhood', 'college', 'recently', 'few years ago']),
  }));

  // Pet details
  const petNames = [faker.person.firstName(), faker.person.firstName()];
  const petType = rng.pick(['dog', 'cat'] as const);
  const currentYear = new Date().getFullYear();
  const petAdoptionYear = faker.number.int({ min: 2010, max: currentYear - 1 });

  const pet = {
    name: rng.pick(petNames),
    type: petType,
    adoptionYear: petAdoptionYear,
    personality: rng.pick(['energetic', 'lazy', 'anxious', 'chill', 'needy', 'independent']),
    funFact: rng.pick([
      'hates the mailman',
      'steals socks',
      'loves pizza',
      'scared of plastic bags',
      'sleeps in weird positions',
    ]),
  };

  // Voice characteristics based on archetype
  const voice = generateVoiceForArchetype(archetype, rng);

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
    const template = rng.pick(eventTemplates);
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
      relationship: rng.pick(['college friend', 'high school friend', 'friend from work', 'old roommate']),
      interactionStyle: 'frequent banter',
    },
    {
      handle: '@' + faker.internet.username().toLowerCase(),
      name: faker.person.firstName(),
      relationship: rng.pick(['coworker', 'work friend', 'colleague']),
      interactionStyle: 'occasional tags',
    },
    {
      handle: '@' + faker.internet.username().toLowerCase(),
      name: faker.person.firstName(),
      relationship: rng.pick(['gym buddy', 'neighbor', 'friend', 'mutual']),
      interactionStyle: 'occasional interaction',
    },
  ];

  // Generate bio
  const bio = generateBio(archetype, occupation, faker.location.city(), pet, rng);

  // Generate archetype-appropriate display name
  const displayName = generateDisplayName(firstName, archetype, rng);

  return {
    archetype,
    name: firstName,
    displayName,
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

    housing: rng.pick([
      'apartment alone',
      'apartment with roommate',
      'house with partner',
      'parents house',
    ]),
    neighborhood: rng.pick(['quiet', 'busy', 'suburban', 'downtown']),
    commute: rng.pick(['walk', '15min drive', 'bus', 'work from home']),

    wakeTime: rng.pick(['6am', '7am', '8am', '9am', 'whenever']),
    sleepTime: rng.pick(['10pm', '11pm', 'midnight', '1am', '2am']),
    coffeeHabit: rng.pick([
      'multiple cups daily',
      'one good cup',
      'tea person actually',
      'energy drinks',
    ]),
    mealPatterns: rng.pick([
      'meal prep sundays',
      'takeout most days',
      'cook when motivated',
      'skip breakfast always',
    ]),

    traits: rng.picks([
      'anxious', 'chill', 'ambitious', 'lazy', 'overthinker', 'spontaneous', 'organized', 'messy',
    ], 3),

    interests,

    petPeeves: rng.picks([
      'slow walkers',
      'loud chewing',
      'people who dont signal',
      'being late',
      'small talk',
      'phone calls',
    ], 3),

    quirks: rng.picks([
      'always cold',
      'night owl',
      'talks to self',
      'collects weird things',
      'never answers texts',
    ], 2),

    relationshipStatus: rng.pick([
      'single',
      'in a relationship',
      'its complicated',
      'not looking',
    ]),

    friendCircle,
    socialEnergy: rng.pick(['introvert', 'extrovert', 'ambivert'] as const),

    voice,

    recentEvents: recentEvents.sort((a, b) => a.daysAgo - b.daysAgo),

    currentStruggles: rng.picks([
      'sleep schedule is messed up',
      'procrastinating on important thing',
      'spending too much money',
      'not exercising enough',
      'phone addiction',
    ], 2),

    currentJoys: rng.picks([
      'new hobby',
      'good friend group',
      'finally feeling rested',
      'nice weather lately',
    ], 1),

    pet,
  };
}
