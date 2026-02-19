import { faker } from '@faker-js/faker';
import CryptoJS from 'crypto-js';
import { Profile, Tweet } from '@/types';
import { PERSONA_ARCHETYPES, PersonaType, PersonaArchetype } from './personaProfiles';
import { generateRealisticProfile as genRealisticProfile } from './realisticTweetSystem';
import { generatePersona } from './personaFactory';
import { generateArchetypeTweets } from './archetypeTweets';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GeneratedProfile {
  profile: Profile;
  tweets: Tweet[];
  password: string;
  passwordHash: string;
  clues: string[];
  difficulty: Difficulty;
}

// Global counter to ensure unique seeds even when called rapidly
let profileCounter = 0;

// Reset counter periodically to avoid overflow (very unlikely but good practice)
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (profileCounter > 10000) profileCounter = 0;
  }, 60000);
}

interface ProfileData {
  // Core identity
  firstName: string;
  lastName: string;
  username: string;
  displayName: string;
  city: string;

  // Password components
  petName: string;
  petType: string;
  petAdoptionYear: number;
  birthYear: number;
  joinedYear: number;

  // Persona-specific fields (vary by type)
  [key: string]: any;
}

/**
 * Generate a unique image URL using Lorem Picsum
 * No API key needed, unlimited requests, always loads
 */
function generateImageUrl(seed: number, width: number, height: number): string {
  return `https://picsum.photos/${width}/${height}?random=${seed}`;
}

/**
 * Generate a unique avatar URL using DiceBear
 * Creates persona-appropriate avatars
 */
function generateAvatarUrl(personaType: PersonaType, seed: number): string {
  // Choose avatar style based on persona
  const styleMap: Record<PersonaType, string> = {
    tech_professional: 'bottts',        // Robot/tech style
    artist_creative: 'avataaars',       // Cartoon style
    entrepreneur: 'personas',           // Professional style
    fitness_coach: 'adventurer',        // Athletic style
    student: 'lorelei',                 // Young/casual style
    small_business: 'micah',            // Friendly style
    journalist: 'personas',             // Professional style
    gamer: 'pixel-art',                 // Gaming style
    photographer: 'adventurer-neutral', // Creative style
    academic: 'bottts-neutral',         // Professional/nerdy style
  };

  const style = styleMap[personaType];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
}

/**
 * Generate password based on profile data and difficulty
 */
function generatePassword(data: ProfileData, difficulty: Difficulty): string {
  const patterns = {
    easy: [
      () => `${data.petName.toLowerCase()}${data.petAdoptionYear}`,
      () => `${data.city.toLowerCase()}${data.birthYear}`,
      () => `${data.firstName.toLowerCase()}${data.petAdoptionYear}`,
    ],
    medium: [
      () => `${data.petName.toLowerCase()}${data.city.toLowerCase()}`,
      () => `${data.lastName.toLowerCase()}${data.petAdoptionYear}`,
      () => `${data.firstName.toLowerCase()}${data.petName.toLowerCase()}`,
    ],
    hard: [
      () => `${data.petName.toLowerCase()}${String(data.petAdoptionYear).split('').reverse().join('')}`,
      () => `${data.petName.replace(/a/gi, '4').replace(/e/gi, '3').replace(/i/gi, '1').replace(/o/gi, '0').toLowerCase()}${data.petAdoptionYear}`,
      () => `${data.city.toLowerCase()}_${data.petName.toLowerCase()}`,
    ],
  };

  const patternList = patterns[difficulty];
  const selectedPattern = patternList[Math.floor(Math.random() * patternList.length)];
  return selectedPattern();
}

/**
 * Generate clues based on password components
 */
function generateClues(data: ProfileData, password: string): string[] {
  const allClues = [
    `Pet: ${data.petName} (${data.petType})`,
    `Pet adoption year: ${data.petAdoptionYear}`,
    `Birth year: ${data.birthYear}`,
    `City: ${data.city}`,
    `First name: ${data.firstName}`,
    `Last name: ${data.lastName}`,
  ];

  return allClues.filter(clue => {
    const clueValue = clue.split(': ')[1].toLowerCase();
    return password.includes(clueValue);
  });
}

/**
 * Generate persona-specific profile data
 */
function generatePersonaData(personaType: PersonaType, seed: number): ProfileData {
  // Note: faker is already seeded in generateProfile(), don't seed again here
  // as it would reset the RNG state and produce identical results

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const city = faker.location.city();
  const petType = faker.helpers.arrayElement(['dog', 'cat', 'dog']);
  const petName = faker.person.firstName();

  const currentYear = new Date().getFullYear();
  const birthYear = faker.number.int({ min: currentYear - 50, max: currentYear - 22 });
  const joinedYear = faker.number.int({ min: 2010, max: 2020 });
  const petAdoptionYear = faker.number.int({ min: 2010, max: currentYear - 1 });

  // Base data common to all personas
  const baseData: ProfileData = {
    firstName,
    lastName,
    username: faker.internet.username({ firstName, lastName }).toLowerCase(),
    displayName: `${firstName} ${lastName}`,
    city,
    petName,
    petType,
    petAdoptionYear,
    birthYear,
    joinedYear,
  };

  // Add persona-specific fields
  switch (personaType) {
    case 'tech_professional':
      return {
        ...baseData,
        profession: faker.helpers.arrayElement([
          'Software Engineer',
          'Frontend Developer',
          'Full-Stack Developer',
          'DevOps Engineer',
          'Product Manager',
        ]),
        company: faker.company.name(),
        specialty: faker.helpers.arrayElement([
          'React/TypeScript',
          'Python/ML',
          'Node.js',
          'Kubernetes',
          'System Design',
        ]),
        yearsExperience: faker.number.int({ min: 2, max: 15 }),
      };

    case 'artist_creative':
      return {
        ...baseData,
        artForm: faker.helpers.arrayElement([
          'Digital art',
          'Illustration',
          'Character design',
          'Concept art',
          '3D modeling',
        ]),
      };

    case 'entrepreneur':
      return {
        ...baseData,
        company: faker.company.name(),
        industry: faker.helpers.arrayElement([
          'SaaS',
          'E-commerce',
          'EdTech',
          'FinTech',
          'Creator tools',
        ]),
        yearsInBusiness: faker.number.int({ min: 1, max: 10 }),
      };

    case 'fitness_coach':
      return {
        ...baseData,
        certification: faker.helpers.arrayElement([
          'NASM-CPT',
          'ACE Certified',
          'ISSA',
          'Certified PT',
        ]),
        specialty: faker.helpers.arrayElement([
          'Strength training',
          'HIIT',
          'Bodybuilding',
          'Functional fitness',
          'CrossFit',
        ]),
      };

    case 'student':
      return {
        ...baseData,
        major: faker.helpers.arrayElement([
          'Computer Science',
          'Business',
          'Engineering',
          'Psychology',
          'Biology',
        ]),
        university: faker.helpers.arrayElement([
          'State University',
          'Tech Institute',
          'City College',
        ]),
        interest: faker.helpers.arrayElement([
          'machine learning',
          'web development',
          'data science',
          'entrepreneurship',
        ]),
      };

    case 'small_business':
      return {
        ...baseData,
        businessType: faker.helpers.arrayElement([
          'Coffee shop',
          'Plant shop',
          'Bakery',
          'Bookstore',
          'Craft store',
        ]),
        specialty: faker.helpers.arrayElement([
          'Organic',
          'Locally sourced',
          'Handmade',
          'Artisanal',
        ]),
        hours: 'Mon-Sat 8am-6pm',
        foundedYear: faker.number.int({ min: 2015, max: 2022 }),
      };

    case 'journalist':
      return {
        ...baseData,
        beat: faker.helpers.arrayElement([
          'Tech',
          'Politics',
          'Local news',
          'Business',
          'Climate',
        ]),
        publication: faker.helpers.arrayElement([
          'The Daily',
          'City Times',
          'The Chronicle',
          'Tech News',
        ]),
        yearsExperience: faker.number.int({ min: 3, max: 15 }),
      };

    case 'gamer':
      return {
        ...baseData,
        platform: faker.helpers.arrayElement(['Twitch', 'YouTube Gaming', 'Kick']),
        favoriteGames: faker.helpers.arrayElement([
          'Valorant',
          'League of Legends',
          'Apex Legends',
          'CS2',
          'Fortnite',
        ]),
      };

    case 'photographer':
      return {
        ...baseData,
        photoStyle: faker.helpers.arrayElement([
          'Landscape',
          'Street',
          'Portrait',
          'Travel',
          'Wildlife',
        ]),
      };

    case 'academic':
      return {
        ...baseData,
        title: faker.helpers.arrayElement(['Dr.', 'Prof.', 'Researcher']),
        field: faker.helpers.arrayElement([
          'Biology',
          'Chemistry',
          'Physics',
          'Computer Science',
          'Psychology',
        ]),
        institution: faker.helpers.arrayElement([
          'State University',
          'Tech Institute',
          'Research Center',
        ]),
        specialty: faker.helpers.arrayElement([
          'machine learning',
          'neuroscience',
          'quantum computing',
          'genetics',
        ]),
      };

    default:
      return baseData;
  }
}

/**
 * Generate persona-appropriate tweets
 * Takes archetype directly to avoid any lookup issues
 */
function generateTweets(archetype: PersonaArchetype, data: ProfileData, seed: number): Tweet[] {
  const tweets: Tweet[] = [];
  const currentYear = new Date().getFullYear();

  // Always include a pet tweet (contains password clue)
  const yearsSincePet = currentYear - data.petAdoptionYear;
  tweets.push({
    id: 1,
    text: `Can't believe it's been ${yearsSincePet} years since I got ${data.petName}! Best ${data.petType} ever 🐾💙`,
    date: `${currentYear}-${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}-${faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0')}`,
    likes: faker.number.int({ min: 50, max: 500 }),
    retweets: faker.number.int({ min: 5, max: 50 }),
    replies: faker.number.int({ min: 2, max: 30 }),
    media: seed % 3 === 0 ? generateImageUrl(seed + 100, 800, 600) : undefined,
  });

  // Add location tweet (another password clue)
  tweets.push({
    id: 2,
    text: `${faker.helpers.arrayElement(['Love', 'Missing', 'Beautiful day in'])} ${data.city} ${faker.helpers.arrayElement(['today', 'right now', 'vibes'])} ${faker.helpers.arrayElement(archetype.emojiPool)}`,
    date: `${currentYear}-${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}-${faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0')}`,
    likes: faker.number.int({ min: 30, max: 300 }),
    retweets: faker.number.int({ min: 2, max: 20 }),
    replies: faker.number.int({ min: 1, max: 15 }),
    media: seed % 4 === 0 ? generateImageUrl(seed + 200, 800, 600) : undefined,
  });

  // Generate persona-specific tweets
  for (let i = 0; i < 5; i++) {
    // Pass unique seed for each tweet to ensure variety
    const tweetText = archetype.tweetGenerator(data, seed + i);

    tweets.push({
      id: i + 3,
      text: tweetText,
      date: `${currentYear - faker.number.int({ min: 0, max: 1 })}-${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}-${faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0')}`,
      likes: faker.number.int({ min: 20, max: 1000 }),
      retweets: faker.number.int({ min: 1, max: 100 }),
      replies: faker.number.int({ min: 0, max: 50 }),
      media: (seed + i) % 3 === 0 ? generateImageUrl(seed + i + 300, 800, 600) : undefined,
    });
  }

  // Sort by date descending (most recent first)
  return tweets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Generate a complete profile using the new realistic system
 */
export function generateRealisticProfileWrapper(difficulty: Difficulty = 'easy', seed?: number): GeneratedProfile {
  const useSeed = seed ?? (Date.now() + profileCounter++ + Math.floor(Math.random() * 1000000));

  // Seed faker for consistent generation
  faker.seed(useSeed);

  // Use the new archetype-based tweet generation system
  const richPersona = generatePersona(useSeed);
  const tweetTexts = generateArchetypeTweets(richPersona, useSeed);

  // Convert to old format for compatibility
  const currentYear = new Date().getFullYear();
  const tweets: Tweet[] = tweetTexts.map((text, i) => ({
    id: i + 1,
    text,
    date: `${currentYear}-${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}-${faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0')}`,
    likes: faker.number.int({ min: 10, max: 500 }),
    retweets: faker.number.int({ min: 1, max: 50 }),
    replies: faker.number.int({ min: 0, max: 30 }),
    media: (useSeed + i) % 3 === 0 ? generateImageUrl(useSeed + i + 300, 800, 600) : undefined,
  }));

  // Generate password
  const password = `${richPersona.pet.name.toLowerCase()}${richPersona.pet.adoptionYear}`;
  const passwordHash = CryptoJS.MD5(password).toString();

  // Generate realistic username based on archetype
  const generateUsername = () => {
    switch (richPersona.archetype) {
      case 'corporate_professional':
      case 'healthcare_worker':
        // Professional handles: firstname_lastname or firstnamelastname
        return faker.helpers.arrayElement([
          `${richPersona.name.toLowerCase()}${faker.person.lastName().toLowerCase()}`,
          `${richPersona.name.toLowerCase()}_${faker.person.lastName().toLowerCase()}`,
          `${richPersona.name.toLowerCase()}${faker.number.int({ min: 1, max: 99 })}`,
        ]);
      case 'internet_native':
      case 'student_young_adult':
        // Casual/creative handles
        return faker.helpers.arrayElement([
          `${richPersona.name.toLowerCase()}${faker.word.adjective()}`,
          `${faker.word.adjective()}${richPersona.name.toLowerCase()}`,
          `${richPersona.name.toLowerCase()}${faker.word.noun()}`,
          faker.internet.username().toLowerCase(),
        ]);
      case 'creative_artist':
        // Creative/aesthetic handles
        return faker.helpers.arrayElement([
          `${richPersona.name.toLowerCase()}creates`,
          `${richPersona.name.toLowerCase()}art`,
          `${faker.word.adjective()}${richPersona.name.toLowerCase()}`,
          faker.internet.username().toLowerCase(),
        ]);
      default:
        // Normal handles for everyone else
        return faker.helpers.arrayElement([
          faker.internet.username({ firstName: richPersona.name }).toLowerCase(),
          `${richPersona.name.toLowerCase()}${faker.number.int({ min: 1, max: 999 })}`,
          `${richPersona.name.toLowerCase()}_${faker.word.noun()}`,
        ]);
    }
  };

  const profile: Profile = {
    username: generateUsername(),
    displayName: richPersona.name,
    bio: richPersona.bio, // USE THE GENERATED BIO!
    location: richPersona.location,
    website: faker.internet.url(),
    joinedDate: `Joined ${faker.date.past({ years: 5 }).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    following: faker.number.int({ min: 100, max: 800 }),
    followers: faker.number.int({ min: 50, max: 1000 }),
    avatarUrl: generateAvatarUrl('tech_professional', useSeed),
    coverUrl: generateImageUrl(useSeed + 1, 1500, 500),
  };

  const clues = [
    `Pet: ${richPersona.pet.name} (${richPersona.pet.type})`,
    `Pet adoption year: ${richPersona.pet.adoptionYear}`,
    `Location: ${richPersona.location}`,
  ];

  return {
    profile,
    tweets,
    password,
    passwordHash,
    clues: clues.filter(clue => password.includes(clue.split(': ')[1].toLowerCase())),
    difficulty,
  };
}

/**
 * Generate a complete profile with persona-based content (OLD SYSTEM)
 */
export function generateProfile(difficulty: Difficulty = 'easy', seed?: number): GeneratedProfile {
  // Use new realistic system
  return generateRealisticProfileWrapper(difficulty, seed);

  // Old code below (keeping for reference):
  /*
  // Ensure unique seed by combining timestamp, counter, and random component
  const useSeed = seed ?? (Date.now() + profileCounter++ + Math.floor(Math.random() * 1000000));
  faker.seed(useSeed);

  // Randomly select a persona
  const personaTypes = Object.keys(PERSONA_ARCHETYPES) as PersonaType[];
  const personaType = personaTypes[useSeed % personaTypes.length];
  const archetype = PERSONA_ARCHETYPES[personaType];

  // Generate persona-specific data
  const data = generatePersonaData(personaType, useSeed);

  // Generate bio
  const bio = archetype.bioPattern(data);

  // Calculate follower/following based on persona
  const [minRatio, maxRatio] = archetype.followerRatio;
  const following = faker.number.int({ min: 100, max: 800 });
  const ratio = faker.number.float({ min: minRatio, max: maxRatio });
  const followers = Math.floor(following * ratio);

  // Generate unique images
  const avatarUrl = generateAvatarUrl(personaType, useSeed);
  const coverUrl = generateImageUrl(useSeed + 1, 1500, 500);

  // Build profile
  const profile: Profile = {
    username: data.username,
    displayName: data.displayName,
    bio,
    location: `${data.city}`,
    website: faker.internet.url(),
    joinedDate: `Joined ${new Date(data.joinedYear, faker.number.int({ min: 0, max: 11 })).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    following,
    followers,
    avatarUrl,
    coverUrl,
  };

  // Generate password and tweets
  const password = generatePassword(data, difficulty);
  const passwordHash = CryptoJS.MD5(password).toString();
  const clues = generateClues(data, password);
  const tweets = generateTweets(archetype, data, useSeed);

  return {
    profile,
    tweets,
    password,
    passwordHash,
    clues,
    difficulty,
  };
  */
}
