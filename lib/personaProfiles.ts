import { faker } from '@faker-js/faker';
import {
  generateTechTweet,
  generateArtistTweet,
  generateCasualTweet,
  generateFitnessTweet,
  generateStudentTweet,
  generateEntrepreneurTweet,
  generateSmallBusinessTweet,
  generateJournalistTweet,
  generateGamerTweet,
  generatePhotographerTweet,
  generateAcademicTweet,
} from './tweetGenerator';

export type PersonaType =
  | 'tech_professional'
  | 'artist_creative'
  | 'entrepreneur'
  | 'fitness_coach'
  | 'student'
  | 'small_business'
  | 'journalist'
  | 'gamer'
  | 'photographer'
  | 'academic';

export interface PersonaArchetype {
  type: PersonaType;
  bioPattern: (data: any) => string;
  tweetThemes: string[];
  tweetGenerator: (data: any, seed: number) => string;
  emojiPool: string[];
  followerRatio: [number, number]; // [min, max] ratio of followers to following
  imageSearchTerms: {
    avatar: string[];
    cover: string[];
    postImages: string[];
  };
}

export const PERSONA_ARCHETYPES: Record<PersonaType, PersonaArchetype> = {
  tech_professional: {
    type: 'tech_professional',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['💻', '🚀', '⚡', '🔧'], faker.number.int({ min: 0, max: 2 }));
      const templates = [
        `${data.profession} @${data.company} | ${data.specialty} | ${data.city} ${emojis.join('')}`,
        `${data.profession} | ${data.specialty} | Coffee addict ☕ | ${data.city}`,
        `Building things with ${data.specialty} | ${data.profession} | ${data.city} ${emojis.join('')}`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'code_achievement',
      'tech_opinion',
      'learning_share',
      'tool_recommendation',
      'bug_story',
      'career_milestone',
      'weekend_project',
    ],
    tweetGenerator: (data, seed) => generateTechTweet(data, seed),
    emojiPool: ['💻', '🚀', '⚡', '🔧', '☕', '🤖', '📊', '🎯'],
    followerRatio: [1.5, 3],
    imageSearchTerms: {
      avatar: ['professional headshot', 'developer', 'tech professional portrait'],
      cover: ['code', 'technology', 'workspace', 'minimalist tech'],
      postImages: ['coding setup', 'laptop workspace', 'tech conference', 'whiteboard'],
    },
  },

  artist_creative: {
    type: 'artist_creative',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['🎨', '✨', '🖌️', '💫'], faker.number.int({ min: 1, max: 3 }));
      const templates = [
        `${data.artForm} artist ${emojis.join('')} | Commissions open | ${data.city}`,
        `Creating ${data.artForm} | Portfolio: [link] | ${data.city} ${emojis.join('')}`,
        `${data.artForm} | Bringing ideas to life ✨ | DM for commissions`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'artwork_showcase',
      'commission_open',
      'process_share',
      'inspiration',
      'art_struggle',
      'milestone',
    ],
    tweetGenerator: (data, seed) => generateArtistTweet(data, seed),
    emojiPool: ['🎨', '✨', '🖌️', '💫', '🌈', '💙', '🥺'],
    followerRatio: [2, 5],
    imageSearchTerms: {
      avatar: ['artist portrait', 'creative professional', 'artistic selfie'],
      cover: ['art studio', 'colorful abstract', 'artist workspace', 'creative'],
      postImages: ['artwork', 'painting', 'illustration', 'digital art', 'creative process'],
    },
  },

  entrepreneur: {
    type: 'entrepreneur',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['🚀', '💼', '📈', '🎯'], faker.number.int({ min: 0, max: 2 }));
      const templates = [
        `Founder @${data.company} | ${data.industry} | ${data.city} ${emojis.join('')}`,
        `Building ${data.company} | ${data.industry} for ${faker.helpers.arrayElement(['SMBs', 'creators', 'teams'])} | ${data.city}`,
        `Entrepreneur | ${data.industry} | ${faker.number.int({ min: 1, max: 3 })}x exit | Always building ${emojis.join('')}`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'business_update',
      'lesson_learned',
      'growth_metric',
      'founder_life',
      'product_launch',
    ],
    tweetGenerator: (data, seed) => generateEntrepreneurTweet(data, seed),
    emojiPool: ['🚀', '💼', '📈', '🎯', '💡', '⚡'],
    followerRatio: [2, 4],
    imageSearchTerms: {
      avatar: ['entrepreneur headshot', 'business professional', 'startup founder'],
      cover: ['startup office', 'modern workspace', 'city skyline', 'growth chart'],
      postImages: ['office', 'team meeting', 'product screenshot', 'growth chart'],
    },
  },

  fitness_coach: {
    type: 'fitness_coach',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['💪', '🏋️', '🔥', '⚡'], faker.number.int({ min: 1, max: 3 }));
      const templates = [
        `${data.certification} | Personal Trainer | Helping you reach your goals ${emojis.join('')} | ${data.city}`,
        `Fitness Coach | ${data.specialty} | Transformations welcome 💪 | ${data.city}`,
        `${data.certification} | Online coaching | DM for programs ${emojis.join('')}`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'workout_tip',
      'nutrition_advice',
      'transformation',
      'motivation',
      'myth_busting',
    ],
    tweetGenerator: (data, seed) => generateFitnessTweet(data, seed),
    emojiPool: ['💪', '🏋️', '🔥', '⚡', '🥗', '💯'],
    followerRatio: [2, 4],
    imageSearchTerms: {
      avatar: ['fitness coach', 'athletic portrait', 'gym trainer'],
      cover: ['gym', 'fitness motivation', 'workout', 'healthy lifestyle'],
      postImages: ['workout', 'gym equipment', 'healthy food', 'fitness transformation'],
    },
  },

  student: {
    type: 'student',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['📚', '🎓', '💻', '☕'], faker.number.int({ min: 1, max: 2 }));
      const templates = [
        `${data.major} @ ${data.university} | Learning ${data.interest} ${emojis.join('')} | ${data.city}`,
        `${data.major} student | ${data.interest} enthusiast | ${data.city} ${emojis.join('')}`,
        `studying ${data.major} | coffee addict ☕ | ${data.city}`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'study_update',
      'learning_journey',
      'career_exploration',
      'student_life',
    ],
    tweetGenerator: (data, seed) => generateStudentTweet(data, seed),
    emojiPool: ['📚', '🎓', '💻', '☕', '📝', '🤓'],
    followerRatio: [0.8, 1.5],
    imageSearchTerms: {
      avatar: ['student portrait', 'young professional', 'college student'],
      cover: ['university campus', 'study desk', 'books', 'coffee shop'],
      postImages: ['study setup', 'notes', 'campus', 'coffee'],
    },
  },

  small_business: {
    type: 'small_business',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['🌱', '☕', '🍰', '📍', '💐'], faker.number.int({ min: 1, max: 2 }));
      const templates = [
        `${emojis.join('')} ${data.businessType} in ${data.city} | ${data.specialty} | Open ${data.hours}`,
        `Local ${data.businessType} | ${data.city} | ${data.specialty} ${emojis.join('')} | DM for orders`,
        `Family-owned ${data.businessType} | ${data.city} since ${data.foundedYear} ${emojis.join('')}`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'product_showcase',
      'customer_love',
      'local_event',
      'business_milestone',
      'behind_scenes',
    ],
    tweetGenerator: (data, seed) => generateSmallBusinessTweet(data, seed),
    emojiPool: ['🌱', '☕', '🍰', '📍', '💐', '💙', '✨'],
    followerRatio: [1, 2],
    imageSearchTerms: {
      avatar: ['small business owner', 'local shop', 'storefront'],
      cover: ['shop interior', 'local business', 'storefront', 'products display'],
      postImages: ['products', 'shop interior', 'customers', 'local market'],
    },
  },

  journalist: {
    type: 'journalist',
    bioPattern: (data) => {
      const templates = [
        `${data.beat} Reporter @${data.publication} | ${data.city}`,
        `Covering ${data.beat} for ${data.publication} | Based in ${data.city}`,
        `${data.publication} | ${data.beat} beat | ${data.city} | DMs open for tips`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'breaking_news',
      'story_link',
      'industry_analysis',
      'source_request',
    ],
    tweetGenerator: (data, seed) => generateJournalistTweet(data, seed),
    emojiPool: ['📰', '🔍', '✍️', '🎙️'],
    followerRatio: [3, 6],
    imageSearchTerms: {
      avatar: ['journalist headshot', 'reporter', 'news professional'],
      cover: ['newsroom', 'journalism', 'reporter field', 'news'],
      postImages: ['news event', 'press conference', 'interview', 'field reporting'],
    },
  },

  gamer: {
    type: 'gamer',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['🎮', '🎯', '🔥', '⚡'], faker.number.int({ min: 1, max: 3 }));
      const templates = [
        `${data.platform} streamer ${emojis.join('')} | ${data.favoriteGames} | ${data.city}`,
        `Competitive ${data.favoriteGames} player | Streaming on ${data.platform} | ${data.city} ${emojis.join('')}`,
        `just here for ${data.favoriteGames} and vibes ${emojis.join('')} | ${data.platform}`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'stream_announcement',
      'gameplay_highlight',
      'gaming_opinion',
      'community_engagement',
    ],
    tweetGenerator: (data, seed) => generateGamerTweet(data, seed),
    emojiPool: ['🎮', '🎯', '🔥', '⚡', '💀', '👾'],
    followerRatio: [1.5, 3],
    imageSearchTerms: {
      avatar: ['gamer portrait', 'streamer', 'gaming setup selfie'],
      cover: ['gaming setup', 'esports', 'game screenshot', 'rgb lights'],
      postImages: ['gaming', 'game screenshot', 'streaming setup', 'gaming highlight'],
    },
  },

  photographer: {
    type: 'photographer',
    bioPattern: (data) => {
      const emojis = faker.helpers.arrayElements(['📸', '🌍', '✨', '🎞️'], faker.number.int({ min: 1, max: 2 }));
      const templates = [
        `${data.photoStyle} photographer ${emojis.join('')} | Based in ${data.city} | Prints available`,
        `📸 Capturing ${data.photoStyle} | ${data.city} | Portfolio: [link]`,
        `${data.photoStyle} photography | ${data.city} ${emojis.join('')} | DM for bookings`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'photo_share',
      'photography_tip',
      'gear_talk',
      'location_feature',
    ],
    tweetGenerator: (data, seed) => generatePhotographerTweet(data, seed),
    emojiPool: ['📸', '🌍', '✨', '🎞️', '🌅', '📍'],
    followerRatio: [1.5, 3],
    imageSearchTerms: {
      avatar: ['photographer portrait', 'creative professional with camera'],
      cover: ['landscape photography', 'cityscape', 'nature photography', 'golden hour'],
      postImages: ['landscape', 'cityscape', 'nature', 'street photography', 'portrait'],
    },
  },

  academic: {
    type: 'academic',
    bioPattern: (data) => {
      const templates: string[] = [
        `${data.title} ${data.field} @${data.institution} | ${data.city}`,
        `${data.title}, ${data.institution} | Researching ${data.specialty} | ${data.city}`,
        `${data.field} researcher | ${data.institution} | ${data.city}`,
      ];
      return faker.helpers.arrayElement(templates);
    },
    tweetThemes: [
      'research_update',
      'publication',
      'conference',
      'academic_life',
    ],
    tweetGenerator: (data, seed) => generateAcademicTweet(data, seed),
    emojiPool: ['🔬', '📊', '🎓', '📚', '🧬'],
    followerRatio: [2, 4],
    imageSearchTerms: {
      avatar: ['academic professional', 'professor portrait', 'researcher'],
      cover: ['university', 'laboratory', 'research', 'academic'],
      postImages: ['laboratory', 'research', 'conference', 'academic presentation'],
    },
  },
};
