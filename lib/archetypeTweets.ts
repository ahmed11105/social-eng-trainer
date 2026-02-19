/**
 * Archetype-Specific Tweet Generators
 * Creates full, substantive tweets that match archetype personality
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

export function generateArchetypeTweets(persona: RichPersona, seed: number): string[] {
  const rng = new SeededRandom(seed);

  switch (persona.archetype) {
    case 'corporate_professional':
      return generateCorporateTweets(persona, rng);
    case 'casual_adult':
      return generateCasualAdultTweets(persona, rng);
    case 'internet_native':
      return generateInternetNativeTweets(persona, rng);
    case 'tech_engineering':
      return generateTechTweets(persona, rng);
    case 'parent_family':
      return generateParentTweets(persona, rng);
    case 'healthcare_worker':
      return generateHealthcareTweets(persona, rng);
    case 'student_young_adult':
      return generateStudentTweets(persona, rng);
    case 'creative_artist':
      return generateCreativeTweets(persona, rng);
    case 'hobby_enthusiast':
      return generateHobbyEnthusiastTweets(persona, rng);
    case 'local_community':
      return generateLocalCommunityTweets(persona, rng);
    case 'opinionated_commentator':
      return generateOpinionatedCommentatorTweets(persona, rng);
    case 'quiet_low_activity':
      return generateQuietLowActivityTweets(persona, rng);
    default:
      return generateCasualAdultTweets(persona, rng);
  }
}

function generateCorporateTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - professional tone
  tweets.push(
    `Been with ${persona.pet.name} for ${petYears} years now (adopted ${rng.pick(['him', 'her'])} back in ${persona.pet.adoptionYear}). Best decision I made ${rng.pick(['during the pandemic', 'that year', 'when I moved to ' + persona.location])}. ${rng.pick([`${persona.pet.name}'s napping next to me while I work from home today.`, `Still the best ${persona.pet.type} I know.`])}`
  );

  // Work achievement
  tweets.push(
    rng.pick([
      `Wrapped up a successful ${rng.pick(['client presentation', 'quarterly review', 'strategy session'])} today. Team executed flawlessly. This is why collaboration matters.`,
      `Proud of the work our team delivered this ${rng.pick(['quarter', 'month', 'week'])}. Long hours but the results speak for themselves.`,
      `${rng.pick(['Interesting', 'Great', 'Productive'])} ${rng.pick(['panel discussion', 'conversation', 'meeting'])} this morning on ${rng.pick(['digital transformation', 'leadership development', 'market trends', 'organizational change'])}. Key takeaway: ${rng.pick(['execution matters more than strategy', 'culture eats strategy for breakfast', 'people are everything'])}.`
    ])
  );

  // Networking
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    rng.pick([
      `@${friend.handle.slice(1)} Thanks for the coffee earlier. Always good to catch up. Let\'s circle back on that opportunity we discussed.`,
      `Congrats to @${friend.handle.slice(1)} on the promotion! Well deserved. Looking forward to seeing what you accomplish in the new role.`,
      `@${friend.handle.slice(1)} Saw your post about ${rng.pick(['the McKinsey report', 'that article', 'the conference'])}. Would love to hear your thoughts - sending you a DM.`
    ])
  );

  // Location/commute
  tweets.push(
    rng.pick([
      `${persona.location} traffic never ceases to amaze me. ${rng.int(30, 90)} minutes to go ${rng.int(3, 15)} miles.`,
      `Flight to ${rng.pick(['Chicago', 'New York', 'SF', 'LA'])} delayed by ${rng.int(1, 3)} hours. At least I have time to finish reviewing these ${rng.pick(['Q3 projections', 'reports', 'presentations'])}.`
    ])
  );

  // Professional reading/development
  tweets.push(
    `Reading "${rng.pick(['The Lean Startup', 'Good to Great', 'Zero to One', 'Thinking Fast and Slow'])}" for probably the ${rng.pick(['second', 'third'])} time. Still finding new insights. Highly recommend for anyone in ${rng.pick(['product development', 'leadership', 'strategy'])}.`
  );

  // Work frustration (professional tone)
  tweets.push(
    rng.pick([
      `The amount of emails I\'ve gotten today is borderline unmanageable. Going to have to block off time tomorrow just to get through my inbox.`,
      `${rng.int(5, 8)} meetings today and ${rng.int(2, 4)} of them could have been emails. Still processing.`
    ])
  );

  // Pet observation
  tweets.push(
    `${persona.pet.name} decided ${rng.int(5, 7)}:${rng.int(10, 45)}am was an appropriate time to wake me up. Not ideal but at least I got an early start on the day.`
  );

  // Location observation
  tweets.push(
    `${persona.location} ${rng.pick(['weather', 'traffic', 'restaurant scene'])} ${rng.pick(['never disappoints', 'is unmatched', 'keeps surprising me'])}.`
  );

  // Networking/LinkedIn
  tweets.push(
    rng.pick([
      `Finally updated my LinkedIn profile. Only took me ${rng.int(3, 8)} months. If you\'re in the ${persona.location} area and want to connect, always open to expanding my network.`,
      `${rng.pick(['Golf outing', 'Dinner', 'Coffee meeting'])} with ${rng.pick(['clients', 'colleagues', 'the team'])} ${rng.pick(['went great', 'was productive', 'exceeded expectations'])}. ${rng.pick(['These relationships matter.', 'This is why I love what I do.'])}`
    ])
  );

  // Friend interaction
  const friend2 = rng.pick(persona.friendCircle.filter(f => f !== friend));
  tweets.push(
    `@${friend2.handle.slice(1)} Let me know when you\'re free next week. Would be good to sync up on ${rng.pick(['the project', 'that opportunity', 'next steps'])}.`
  );

  // Mundane but professional
  tweets.push(
    rng.pick([
      `${rng.int(15, 45)} unread messages and it\'s only ${rng.int(9, 11)}am. Going to be one of those days.`,
      `Back-to-back ${rng.pick(['calls', 'meetings', 'presentations'])} from ${rng.int(9, 10)}am to ${rng.int(4, 6)}pm. ${rng.pick(['Exhausting but productive.', 'This is the job.'])}`
    ])
  );

  // Achievement/reflection
  tweets.push(
    rng.pick([
      `${rng.int(4, 7)} years in ${rng.pick(['consulting', 'this role', 'this industry'])} and still learning something new every day. ${rng.pick(['Grateful for that.', "That\'s what keeps it interesting."])}`,
      `Closed a ${rng.pick(['major', 'significant', 'challenging'])} ${rng.pick(['deal', 'project', 'engagement'])} today. Team effort all the way. ${rng.pick(['Proud of everyone involved.', 'This is why we do what we do.'])}`
    ])
  );

  return tweets;
}

function generateCasualAdultTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - casual tone
  tweets.push(
    rng.pick([
      `${persona.pet.name} had ${rng.pick(['her', 'his'])} annual checkup today. Can\'t believe it\'s been ${petYears} years since I adopted ${rng.pick(['her', 'him'])} in ${persona.pet.adoptionYear}. ${rng.pick([`${persona.pet.name}'s still scared of the vet every single time lol`, `Still the best ${persona.pet.type} ever`])}`,
      `Can\'t believe ${persona.pet.name} and I have been together for ${petYears} years now. Got ${rng.pick(['her', 'him'])} back in ${persona.pet.adoptionYear} ${rng.pick(['right before everything shut down', 'when I moved to ' + persona.location, 'and best decision ever'])}. ${rng.pick([`${persona.pet.name}'s napping next to me right now`, 'Best ${persona.pet.type} I know'])}`,
    ])
  );

  // Work accomplishment
  tweets.push(
    rng.pick([
      `Finally finished that ${rng.pick(['proposal', 'project', 'presentation', 'report'])}. Took way longer than it should have but it\'s done. Now I can actually enjoy my weekend.`,
      `Survived another week of ${rng.pick(['meetings', 'deadlines', 'back-to-back calls'])}. ${rng.pick(['Exhausted but we made it.', "That\'s a wrap on this week."])}`
    ])
  );

  // Friend interaction
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    rng.pick([
      `@${friend.handle.slice(1)} omg I know right?? I was ${rng.pick(['yelling at my TV', 'screaming', 'losing my mind'])} the entire time`,
      `@${friend.handle.slice(1)} yeah I\'m down for ${rng.pick(['trivia', 'drinks', 'brunch', 'coffee'])} on ${rng.pick(['Thursday', 'Saturday', 'Sunday'])}! haven\'t been to ${rng.pick(['that place', 'that spot', 'there'])} in a while`
    ])
  );

  // Coffee shop observation
  tweets.push(
    `The line at this coffee shop is insane. Why did I think coming here at ${rng.int(8, 10)}am on a ${rng.pick(['Saturday', 'Sunday', 'weekday'])} was a good idea${rng.pick(['', '?'])}`
  );

  // Office frustration
  tweets.push(
    rng.pick([
      `Whoever keeps ${rng.pick(['microwaving fish', 'leaving dirty dishes', 'brewing burnt coffee'])} in the office kitchen needs to stop immediately. This is a workplace not a ${rng.pick(['seafood restaurant', 'frat house', 'disaster zone'])}.`,
      `Someone just replied-all to a company-wide email and now everyone is replying-all asking people to stop replying-all. This is going to go on for hours.`
    ])
  );

  // Hobby/interest
  const interest = rng.pick(persona.interests);
  tweets.push(
    rng.pick([
      `Been ${rng.pick(['listening to', 'watching', 'obsessed with'])} ${rng.pick(['the same true crime podcast', 'this show', 'this series'])} for ${rng.int(2, 5)} hours straight. Should probably do something productive but... nah`,
      `Update: I did not do anything productive`,
      `Started watching ${rng.pick(['Love Island', 'The Bachelor', 'that new show'])} and I\'m already too invested. This is what my life has become.`
    ])
  );

  // Location/weather
  tweets.push(
    `${persona.location} weather is so unpredictable. It was ${rng.int(60, 75)} degrees ${rng.pick(['yesterday', 'this morning'])} and now it\'s ${rng.pick(['snowing', 'freezing', 'pouring rain'])}??? Make it make sense`
  );

  // Gym/exercise
  tweets.push(
    `Got to the gym for the first time in ${rng.int(2, 4)} weeks and my body is REMINDING me of that fact. Everything hurts.`
  );

  // Friend drama/story
  const friend2 = rng.pick(persona.friendCircle.filter(f => f !== friend));
  tweets.push(
    `@${friend2.handle.slice(1)} wait are you serious?? That\'s ${rng.pick(['wild', 'insane', 'crazy'])}. Send me the link`
  );

  // Social obligation
  tweets.push(
    `My neighbor just asked if I could ${rng.pick(['watch their cat', 'water their plants', 'grab their packages'])} while they\'re out of town and honestly ${rng.pick(["I\'m not a cat person but I said yes anyway", 'I said yes even though I have zero time', "I can\'t say no to people apparently"])} because I can\'t say no to people apparently`
  );

  // Restaurant/food
  tweets.push(
    `Treated myself to ${rng.pick(['dinner', 'lunch', 'brunch'])} at that new ${rng.pick(['Italian', 'Mexican', 'Thai', 'sushi'])} place ${rng.pick(['on ' + persona.location.split(' ')[0], 'downtown', 'near work'])}. The ${rng.pick(['pasta', 'tacos', 'pad thai', 'rolls'])} ${rng.pick(['was incredible', 'were amazing', 'did not disappoint'])} but I definitely ate too much. Worth it though.`
  );

  // Pet observation
  tweets.push(
    `${persona.pet.name} is currently staring at me because it\'s ${rng.int(6, 7)}:${rng.int(15, 45)} and I haven\'t fed ${rng.pick(['her', 'him'])} yet even though dinner isn\'t until ${rng.int(7, 8)}. The dramatic energy is unreal${rng.pick(['', ' 🙄'])}`
  );

  return tweets;
}

function generateInternetNativeTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - very casual/emotional
  tweets.push(
    `just remembered ${persona.pet.name}'s adoption day was ${petYears} years ago (got ${rng.pick(['her', 'him'])} in ${persona.pet.adoptionYear}) and im emotional now. best ${persona.pet.type} in the world actually`
  );

  // Work frustration
  tweets.push(
    rng.pick([
      `why did i agree to wake up at ${rng.int(7, 9)}am for a client call. this is a crime against humanity`,
      `spent ${rng.int(3, 6)} hours editing a ${rng.int(15, 45)} second video. this is what my degree has led to`,
      `client: "can you make it more fun?" me: "what does that mean" client: "just make it pop" me: 🙃`
    ])
  );

  // Friend interaction - excited
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    rng.pick([
      `@${friend.handle.slice(1)} WAIT UR KIDDING`,
      `@${friend.handle.slice(1)} STOP IM CRYING${rng.pick(['GGG', 'G'])} 😭😭`,
      `@${friend.handle.slice(1)} literally the same energy as that one scene ${rng.pick(['in the episode', 'we were talking about', 'from the show'])}`
    ])
  );

  // Group chat FOMO
  tweets.push(
    `the group chat is POPPING OFF rn and im stuck in a ${rng.pick(['meeting', 'call', 'zoom'])} i hate it here`
  );

  // Location-specific observation
  tweets.push(
    `${persona.location} coffee shop workers will make u the best ${rng.pick(['latte', 'cappuccino', 'cortado'])} of ur life and then give u the most withering look when u ask for ${rng.pick(['oat milk', 'almond milk', 'extra foam'])}`
  );

  // Show/media reaction
  tweets.push(
    rng.pick([
      `new episode dropped and i already know the discourse is gonna be insufferable`,
      `the timeline is being SO weird today what is happening`,
      `just ${rng.pick(['watched', 'finished'])} ${rng.pick(['that episode', 'the finale', 'the new ep'])} and ${rng.pick(['im not okay', 'i have thoughts', 'what just happened', 'need to process'])}`
    ])
  );

  // Eating habits
  tweets.push(
    `ngl i forgot to eat lunch again. survived on ${rng.pick(['iced coffee and spite', 'energy drinks', 'coffee and anxiety'])}`
  );

  // Sleep schedule
  tweets.push(
    `my sleep schedule is so cooked. went to bed at ${rng.int(3, 5)}am woke up at ${rng.int(1, 3)}pm. genuinely dont know what day it is`
  );

  // Pet chaos
  tweets.push(
    `${persona.pet.name} ${rng.pick(['knocked over my water bottle directly onto my keyboard', 'sat on my laptop and closed all my tabs', 'stole my hair tie'])}. ${rng.pick(['she', 'he'])} looked me dead in the eyes while doing it. no remorse. icon behavior honestly`
  );

  // Project completion
  tweets.push(
    `finally finished that project im gonna sleep for ${rng.int(12, 20)} hours`
  );

  // Friend share
  const friend2 = rng.pick(persona.friendCircle.filter(f => f !== friend));
  tweets.push(
    `@${friend2.handle.slice(1)} OMG WAIT I NEED TO SHOW U SOMETHING ${rng.pick(['*sends link*', '(link in dms)', ''])}`
  );

  // Chronically online observation
  tweets.push(
    rng.pick([
      `been on ${rng.pick(['twitter', 'tiktok', 'instagram'])} for ${rng.int(4, 8)} hours straight. ${rng.pick(['this is fine', 'everything is fine', 'no regrets'])}`,
      `${rng.pick(['touch grass challenge:', 'going outside speedrun:', 'leaving my room any%:'])} failed`
    ])
  );

  return tweets;
}

function generateTechTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - tech-flavored
  tweets.push(
    `${rng.pick(["Can\'t believe", 'Realized'])} ${persona.pet.name} and I have been ${rng.pick(['paired', 'together'])} for ${petYears} years now. Got ${rng.pick(['him', 'her'])} back in ${persona.pet.adoptionYear} ${rng.pick(['right before the pandemic hit', 'when I moved to ' + persona.location, 'best decision I made that year'])}. ${rng.pick([`${persona.pet.name}'s currently debugging my life by sitting on my keyboard`, 'Best pair programming partner'])}`
  );

  // Work/coding
  tweets.push(
    rng.pick([
      `Spent ${rng.int(3, 8)} hours tracking down a bug that was literally a ${rng.pick(['missing semicolon', 'typo in a variable name', 'wrong environment variable'])}. ${rng.pick(['This is fine.', 'Love this job.', 'Why do I do this to myself.'])}`,
      `${rng.pick(['Finally', 'Just'])} got ${rng.pick(['CI/CD', 'the deploy', 'the build'])} working after ${rng.int(2, 5)} hours. ${rng.pick(["It was a", "Turned out to be a"])} ${rng.pick(['caching issue', 'permissions problem', 'config typo'])}. ${rng.pick(['Classic.', 'Of course it was.'])}`,
      `Refactored ${rng.int(500, 2000)} lines of legacy code today. ${rng.pick(["It\'s", "Code is"])} ${rng.pick(['beautiful now', 'actually readable', 'so much cleaner'])}. ${rng.pick(['My past self would be proud.', 'This is the good stuff.'])}`
    ])
  );

  // Meeting frustration
  tweets.push(
    rng.pick([
      `${rng.int(5, 8)} meetings today and I got maybe ${rng.int(20, 45)} minutes of actual coding done. ${rng.pick(['This is sustainable.', 'Great use of time.', 'Love meetings.'])}`,
      `Client just asked if we can "make the ${rng.pick(['app', 'site', 'dashboard'])} more ${rng.pick(['Web 2.0', 'blockchain', 'AI-powered'])}". I physically aged ${rng.int(5, 15)} years. ${rng.pick(['Brother we are in 2026.', 'Make it stop.'])}`
    ])
  );

  // Keyboard/setup
  tweets.push(
    `Finally upgraded my ${rng.pick(['keyboard', 'monitor', 'desk'])} setup and wow the difference is ${rng.pick(['night and day', 'incredible', 'unreal'])}. My wallet hates me but my ${rng.pick(['fingers', 'eyes', 'back'])} ${rng.pick(['are happy', 'approve', 'thank me'])}.`
  );

  // Friend/gaming interaction
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['dude', 'bro', 'yo'])} I JUST got to that ${rng.pick(['boss', 'level', 'part'])} and yeah it\'s ${rng.pick(['brutal', 'insane', 'ridiculous'])}. Took me like ${rng.int(10, 25)} tries`
  );

  // Gaming
  tweets.push(
    `${rng.pick(['Three', 'Four'])} day weekend and I\'ve already spent ${rng.int(6, 12)} hours playing ${rng.pick(['Elden Ring', 'Baldurs Gate', 'that new game', 'FromSoft'])}. This is either really healthy or really concerning and I\'m not sure which.`
  );

  // Location
  tweets.push(
    `${persona.location} ${rng.pick(['heat', 'cold', 'weather'])} is ${rng.pick(['already unbearable', 'insane', 'unreal'])} and it\'s only ${rng.pick(['February', 'June', 'October'])}. ${rng.pick(['This is fine.', 'Everything is fine.'])} ${rng.pick(['', '🙃'])}`
  );

  // Password/security
  tweets.push(
    `Realized I\'ve been using the same ${rng.pick(['password structure', 'password pattern', 'passwords'])} since ${rng.pick(['college', '2015', 'high school'])} and should probably change that but also... ${rng.pick(['effort', "that\'s a lot of work", 'nah'])}.`
  );

  // Pet observation
  tweets.push(
    `${persona.pet.name} is ${rng.pick(['losing his mind', 'going crazy', 'freaking out'])} because there\'s a ${rng.pick(['bird', 'squirrel', 'lizard'])} ${rng.pick(['on the patio', 'outside', 'on the balcony'])} and ${rng.pick(['he', 'she'])} cannot comprehend that the glass door is preventing ${rng.pick(['him', 'her'])} from reaching it. The drama is unreal.`
  );

  // Procrastination
  tweets.push(
    `Spent my lunch break ${rng.pick(['doom scrolling Reddit', 'on Hacker News', 'watching tech videos'])} and now I\'m behind on everything. ${rng.pick(['Adulting is going great.', 'This is fine.', 'Productivity 100.'])}`
  );

  // Nostalgia
  tweets.push(
    rng.pick([
      `Remember when we thought ${rng.int(2018, 2021)} was going to be "${rng.pick(['our year', 'the year', 'it'])}?" ${rng.pick(['Good times.', 'Simpler times.', 'lol'])}`,
      `My coworker just said "${rng.pick(['that\'s so fetch', 'on fleek', 'what\'s the tea'])}" unironically in a meeting and I had to mute myself. ${rng.pick(['It\'s 2026.', 'We\'ve moved on.', 'Make it stop.'])}`
    ])
  );

  // Friend plans
  const friend2 = rng.pick(persona.friendCircle.filter(f => f !== friend));
  tweets.push(
    `@${friend.handle.slice(1)} @${friend2.handle.slice(1)} you guys wanna run some ${rng.pick(['co-op', 'ranked', 'duos'])} this weekend? I\'m free ${rng.pick(['Saturday', 'Sunday'])} ${rng.pick(['afternoon', 'evening'])}`
  );

  return tweets;
}

function generateParentTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - parent tone
  tweets.push(
    `${persona.pet.name} has been part of our family for ${petYears} years now. Got ${rng.pick(['him', 'her'])} back in ${persona.pet.adoptionYear} ${rng.pick(['when the kids were little', 'before the kids were born', 'right after we moved'])}. ${rng.pick(['Best family dog ever.', `The kids and ${persona.pet.name} are inseparable.`, 'Still going strong.'])}`
  );

  // Parenting exhaustion
  tweets.push(
    rng.pick([
      `${rng.int(5, 7)}am wake up call from a ${rng.int(3, 7)} year old who wanted to show me a ${rng.pick(['rock', 'toy', 'drawing', 'bug'])}. ${rng.pick(['Exhausted but we made it.', "This is parenthood.", 'Coffee is life.'])}`,
      `Survived another ${rng.pick(['birthday party', 'school event', 'playdate'])} with ${rng.int(10, 20)} kids. ${rng.pick(['Exhausted.', 'Need a nap.', 'How do teachers do this every day?'])}`,
      `Found ${rng.pick(['cheerios', 'goldfish', 'legos', 'stickers'])} in places I didn\'t know existed. ${rng.pick(['This is my life now.', 'Parenthood is wild.'])}`
    ])
  );

  // Work-life balance
  tweets.push(
    `${rng.pick(['Managed to', 'Actually'])} make it to ${rng.pick(['work on time', 'the meeting', 'school pickup'])} ${rng.pick(['for once', 'somehow', 'today'])}. ${rng.pick(['Small victories.', 'We take those.', "I\'ll count it as a win."])}`
  );

  // Kid achievement
  tweets.push(
    `${rng.pick(['So proud of', "Can\'t believe"])} ${rng.pick(['my kid', 'the kids', 'our little one'])} ${rng.pick(['for making honor roll', 'for winning the game', 'for their artwork', 'today'])}. ${rng.pick(['These are the moments.', "They\'re growing up too fast.", 'Proud parent moment.'])}`
  );

  // Location
  tweets.push(
    `${persona.location} ${rng.pick(['schools', 'parks', 'community'])} ${rng.pick(['are amazing', 'never disappoint', 'are the best'])}. ${rng.pick(['Grateful we moved here.', 'Love this town.', 'Best decision we made.'])}`
  );

  // Friend interaction
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['Yes!', 'Totally.'])} ${rng.pick(['The kids loved it.', "We\'re dealing with the same thing.", 'Same here.'])} ${rng.pick(['Want to set up a playdate?', 'Coffee soon?'])}`
  );

  // Work stress
  tweets.push(
    rng.pick([
      `${rng.pick(['Between', 'Juggling'])} work ${rng.pick(['meetings', 'deadlines', 'calls'])} and ${rng.pick(['school pickup', 'soccer practice', 'dance class', 'piano lessons'])}, ${rng.pick(["I don\'t know how we do it", 'barely keeping it together', 'running on fumes'])}. ${rng.pick(['Coffee is the only thing keeping me going.', 'Exhausted but grateful.'])}`,
      `Finally got the kids to bed and now I have ${rng.int(2, 4)} hours of work to catch up on. ${rng.pick(['This is sustainable.', 'Work-life balance is a myth.'])}`
    ])
  );

  // Meal planning
  tweets.push(
    `${rng.pick(['Made', 'Cooked'])} ${rng.pick(['dinner', 'lunch', 'breakfast'])} for the ${rng.pick(['third', 'fourth', 'fifth'])} time today. ${rng.pick(['Why do kids eat so much?', "They\'re always hungry.", 'I used to have hobbies.'])}`
  );

  // Pet and kids
  tweets.push(
    `Caught ${rng.pick(['my kid', 'the kids'])} and ${persona.pet.name} ${rng.pick(['napping together', 'playing in the backyard', 'making a mess'])}. ${rng.pick(['This is everything.', 'My heart.', 'These moments make it all worth it.'])}`
  );

  // Weekend
  tweets.push(
    `Weekend ${rng.pick(['plans', 'itinerary'])}: ${rng.int(2, 4)} ${rng.pick(['birthday parties', 'sports games', 'activities'])} and maybe ${rng.int(20, 45)} minutes of ${rng.pick(['rest', 'quiet time', 'sanity'])}. ${rng.pick(['This is fine.', "Who needs sleep anyway?"])}`
  );

  return tweets;
}

function generateHealthcareTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue
  tweets.push(
    `Coming home to ${persona.pet.name} after a ${rng.int(12, 16)} hour shift ${rng.pick(['never gets old', 'is everything', 'keeps me going'])}. Been ${petYears} years since I adopted ${rng.pick(['him', 'her'])} in ${persona.pet.adoptionYear}. ${rng.pick(['Best decision I ever made.', `${persona.pet.name} is the best therapy.`, 'Still the best part of my day.'])}`
  );

  // Long shift
  tweets.push(
    rng.pick([
      `${rng.int(12, 16)} hour shift done. ${rng.pick(['Exhausted but we made it.', 'My feet are screaming.', 'Need sleep.'])} ${rng.pick(['See you tomorrow for another one.', 'Back at it tomorrow.'])}`,
      `${rng.int(3, 5)} ${rng.pick(['shifts', 'days'])} in a row and I ${rng.pick(['barely remember my name', 'forgot what day it is', "can\'t feel my feet"])}. ${rng.pick(['Healthcare is wild.', 'This is the job.', 'Worth it though.'])}`
    ])
  );

  // Patient win
  tweets.push(
    `${rng.pick(['Patient', 'Someone'])} I\'ve been working with for ${rng.pick(['weeks', 'months'])} ${rng.pick(['finally went home today', 'hit their recovery goal', 'made amazing progress'])}. ${rng.pick(['These are the moments.', 'This is why I do this.', 'Best part of the job.'])}`
  );

  // Staffing issues
  tweets.push(
    rng.pick([
      `${rng.pick(['Understaffed', 'Short-staffed', 'Running on fumes'])} again today. ${rng.int(1, 2)} ${rng.pick(['nurse', 'tech', 'person'])} for ${rng.int(8, 15)} patients. ${rng.pick(['This is fine.', 'Great ratio.', 'Totally sustainable.'])}`,
      `${rng.int(4, 6)} call-outs today which means ${rng.pick(['mandatory overtime', 'extra shifts', 'chaos'])}. ${rng.pick(['Love this.', 'This is the dream.'])}`
    ])
  );

  // Paperwork frustration
  tweets.push(
    `Spent ${rng.int(2, 4)} hours on ${rng.pick(['charting', 'documentation', 'paperwork'])} for ${rng.int(20, 45)} minutes of actual ${rng.pick(['patient care', 'clinical work'])}. ${rng.pick(['Makes total sense.', 'The system works.', 'This is fine.'])}`
  );

  // Location
  tweets.push(
    `${persona.location} ${rng.pick(['traffic', 'commute'])} at ${rng.int(6, 7)}am ${rng.pick(['is something else', 'never gets easier', 'is brutal'])}. ${rng.pick(['But we made it.', 'Still better than night shift traffic.'])}`
  );

  // Coworker support
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['That shift was insane.', 'We survived.', 'Tomorrow has to be better.'])} ${rng.pick(['Coffee before?', 'Thanks for having my back.', 'couldn\'t do this without you.'])}`
  );

  // Pet comfort
  tweets.push(
    `${persona.pet.name} ${rng.pick(['knew I had a rough day', 'could tell I was exhausted', 'sensed it'])} and ${rng.pick(['hasn\'t left my side', 'won\'t stop cuddling', 'is being extra sweet'])}. ${rng.pick(['Dogs know.', 'Cats know.', 'Best ' + persona.pet.type + ' ever.'])}`
  );

  // Small joy
  tweets.push(
    `${rng.pick(['Finally', 'Actually'])} ${rng.pick(['got to sit down', 'took a lunch break', 'left on time'])} ${rng.pick(['today', 'for the first time this week'])}. ${rng.pick(['Small victories.', 'We take those.', "I\'ll count it as a win."])}`
  );

  // Night shift
  tweets.push(
    rng.pick([
      `${rng.pick(['Night shift', 'Overnight'])} ${rng.int(3, 5)} of ${rng.int(4, 6)}. My sleep schedule is ${rng.pick(['destroyed', 'non-existent', 'a myth'])}. ${rng.pick(['This is sustainable.', 'Love this lifestyle.'])}`,
      `Finished ${rng.pick(['night shift', 'overnight'])} and the sun is up. ${rng.pick(['Going to bed now.', 'Time for breakfast dinner.', 'My schedule makes no sense.'])}`
    ])
  );

  return tweets;
}

function generateStudentTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue
  tweets.push(
    `${persona.pet.name} ${rng.pick(['is the only reason I survived', 'got me through', 'is carrying me through'])} ${rng.pick(['finals', 'midterms', 'this semester'])}. Got ${rng.pick(['him', 'her'])} ${petYears} years ago in ${persona.pet.adoptionYear} and ${rng.pick(['best decision', 'saved my life', 'still the MVP'])}. ${rng.pick([`${persona.pet.name} > therapy`, 'Best study buddy'])}`
  );

  // All-nighter
  tweets.push(
    rng.pick([
      `${rng.int(3, 5)}am and I\'m ${rng.pick(['still', 'somehow still'])} working on this ${rng.pick(['essay', 'paper', 'project'])} that\'s due at ${rng.int(8, 10)}am. ${rng.pick(['This is fine.', 'Great time management.', 'Love this for me.'])}`,
      `Pulled an all-nighter for a ${rng.pick(['midterm', 'final', 'exam'])} and ${rng.pick(['honestly don\'t remember anything', 'my brain is mush', 'ran on pure caffeine'])}. ${rng.pick(['College is fun.', 'Worth the tuition.'])}`
    ])
  );

  // Broke student life
  tweets.push(
    rng.pick([
      `${rng.pick(['Surviving on', 'Living off'])} ${rng.pick(['ramen', 'instant noodles', 'rice and beans'])} ${rng.pick(['for the third day in a row', 'again', 'until Friday'])}. ${rng.pick(['Broke student life hits different.', 'This is the dream.', 'College is expensive.'])}`,
      `Checked my bank account and ${rng.pick(['immediately regretted it', 'closed the app', 'pretended I didn\'t see it'])}. ${rng.pick(['Ignorance is bliss.', 'Student loans are real.'])}`
    ])
  );

  // Group project hell
  tweets.push(
    `Group project and I\'m ${rng.pick(['doing all the work', 'carrying the team', 'the only one who showed up'])} ${rng.pick(['again', 'as usual', 'of course'])}. ${rng.pick(['Love this.', 'Great teamwork.', 'Why do I even try.'])}`
  );

  // Friend interaction
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['dude', 'bro', 'yo'])} ${rng.pick(['library', 'study sesh', 'cram session'])} at ${rng.int(6, 9)}pm? ${rng.pick(['Need to actually study this time.', 'Bring coffee.', 'This exam is gonna kill me.'])}`
  );

  // Campus life
  tweets.push(
    `${persona.location} ${rng.pick(['campus', 'weather', 'dining hall food'])} ${rng.pick(['is unmatched', 'hits different', 'never disappoints'])}. ${rng.pick(['Best decision choosing this school.', 'Love it here.', 'No regrets.'])}`
  );

  // Sleep schedule
  tweets.push(
    `My sleep schedule is ${rng.pick(['completely destroyed', 'non-existent', 'a joke'])}. Went to bed at ${rng.int(4, 6)}am, woke up at ${rng.int(2, 4)}pm. ${rng.pick(['This is sustainable.', 'College life.', 'What is time.'])}`
  );

  // Coffee addiction
  tweets.push(
    `${rng.pick(['On', 'Currently on'])} ${rng.pick(['coffee', 'energy drink', 'caffeine'])} #${rng.int(4, 7)} ${rng.pick(['today', 'and it\'s only 2pm'])}. ${rng.pick(['This is healthy.', 'Totally fine.', 'Blood type is now espresso.'])}`
  );

  // Procrastination
  tweets.push(
    rng.pick([
      `${rng.pick(['Have', 'Got'])} a ${rng.pick(['paper', 'assignment', 'project'])} due ${rng.pick(['tomorrow', 'in 6 hours', 'tonight'])} ${rng.pick(['and haven\'t started', 'and barely started', 'haven\'t even opened the doc'])}. ${rng.pick(['We love to see it.', 'Procrastination king/queen.', 'This is the way.'])}`,
      `Spent ${rng.int(4, 8)} hours ${rng.pick(['on TikTok', 'scrolling', 'doing nothing'])} instead of ${rng.pick(['studying', 'working on my paper', 'doing homework'])}. ${rng.pick(['Productivity.', 'Time well spent.'])}`
    ])
  );

  // Pet study buddy
  tweets.push(
    `${persona.pet.name} is ${rng.pick(['sitting on my textbook', 'on my laptop', 'demanding attention'])} while I\'m trying to study. ${rng.pick(['Very helpful.', 'Great study buddy.', 'This is fine.'])}`
  );

  return tweets;
}

function generateCreativeTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue
  tweets.push(
    `${persona.pet.name} has been my ${rng.pick(['creative muse', 'studio companion', 'constant inspiration'])} for ${petYears} years now. Got ${rng.pick(['him', 'her'])} back in ${persona.pet.adoptionYear} ${rng.pick(['when I was just starting out', 'right when I went freelance', 'during my first year'])}. ${rng.pick([`${persona.pet.name} is in half my work honestly`, 'Best creative partner', 'Still the best ' + persona.pet.type])}`
  );

  // Creative block
  tweets.push(
    rng.pick([
      `${rng.pick(['Art block', 'Creative block', 'Writer\'s block'])} ${rng.pick(['is real', 'hitting hard', 'is destroying me'])}. ${rng.pick(['Stared at a blank canvas for 3 hours.', 'Nothing is working.', 'This is torture.'])} ${rng.pick(['Send help.', 'Why did I choose this career.'])}`,
      `${rng.int(6, 10)} hours into this ${rng.pick(['piece', 'project', 'commission'])} and ${rng.pick(['it\'s finally coming together', 'starting to look like something', 'almost there'])}. ${rng.pick(['The grind is real.', 'Worth it though.'])}`
    ])
  );

  // Client frustration
  tweets.push(
    rng.pick([
      `Client: "${rng.pick(['can you make it pop more', 'add more colors', 'make it bigger', 'can you do it for exposure'])}" Me: ${rng.pick(['🙃', '🫠', 'No.'])}`,
      `${rng.pick(['Fifth', 'Sixth', 'Seventh'])} round of revisions on a project I ${rng.pick(['finished weeks ago', 'already perfected', 'thought was done'])}. ${rng.pick(['This is fine.', 'Love freelancing.', 'Great use of time.'])}`
    ])
  );

  // Work in progress
  tweets.push(
    `${rng.int(12, 20)} hours into this ${rng.pick(['commission', 'piece', 'project'])} and ${rng.pick(['forgot to eat', 'lost track of time', 'don\'t know what day it is'])}. ${rng.pick(['The flow state is real.', 'This is why I do this.', 'Love this feeling.'])}`
  );

  // Location inspiration
  tweets.push(
    `${persona.location} ${rng.pick(['light', 'architecture', 'energy', 'art scene'])} ${rng.pick(['never fails to inspire', 'hits different', 'is unmatched'])}. ${rng.pick(['Best decision moving here.', 'This city gets me.'])}`
  );

  // Friend interaction
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['Your', 'That'])} ${rng.pick(['latest piece', 'new work', 'portfolio'])} is ${rng.pick(['stunning', 'incredible', 'so good'])}. ${rng.pick(['The colors!', 'The composition!', 'Teach me your ways.'])}`
  );

  // Coffee shop culture
  tweets.push(
    `${rng.int(4, 8)} hours at the ${rng.pick(['coffee shop', 'cafe', 'local spot'])} ${rng.pick(['working', 'creating', 'in the zone'])}. ${rng.pick(['Barista knows my order by heart now.', 'This is my office.', 'Best workspace.'])}`
  );

  // Pricing struggle
  tweets.push(
    rng.pick([
      `${rng.pick(['Someone', 'Client', 'Person'])} asked how much for a ${rng.pick(['commission', 'custom piece', 'project'])} and ${rng.pick(['I froze', 'panicked', 'blanked'])}. ${rng.pick(['Why is pricing so hard.', 'Imposter syndrome is real.', 'Need to work on this.'])}`,
      `${rng.pick(['Raised', 'Updated'])} my ${rng.pick(['commission', 'project'])} rates and ${rng.pick(['feel guilty', 'am nervous', 'hope people don\'t hate me'])}. ${rng.pick(['Know your worth they said.', 'This is the right move.', 'Growth.'])}`
    ])
  );

  // Pet interruption
  tweets.push(
    `${persona.pet.name} ${rng.pick(['knocked over my paint water', 'sat on my sketchbook', 'walked across wet canvas', 'is sitting on my tablet'])}. ${rng.pick(['Very helpful.', 'Great assistant.', 'This is fine.'])} ${rng.pick(['Love this chaos.', "Wouldn\'t trade it."])}`
  );

  // Social media struggle
  tweets.push(
    `Spent ${rng.int(2, 4)} hours ${rng.pick(['creating', 'making', 'working on'])} ${rng.pick(['a post', 'content', 'this piece'])} and it got ${rng.int(3, 15)} likes. ${rng.pick(['The algorithm hates me.', 'Why do I even try.', 'Art is pain.'])}`
  );

  // Late night creativity
  tweets.push(
    `${rng.int(2, 4)}am and ${rng.pick(['creativity finally hit', 'inspiration struck', 'the ideas are flowing'])}. ${rng.pick(['Why is it always the middle of the night.', 'Sleep is for the weak.', 'This is when the magic happens.'])}`
  );

  return tweets;
}

function generateHobbyEnthusiastTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;
  const mainHobby = persona.interests[0]?.name || rng.pick(['hiking', 'photography', 'gaming', 'cooking', 'gardening']);

  // Pet clue - hobby connection
  tweets.push(
    `${persona.pet.name} ${rng.pick(['comes', 'joins me', 'tags along'])} on ${rng.pick(['every', 'most of my', 'almost every'])} ${mainHobby} ${rng.pick(['trip', 'session', 'adventure'])}. Been ${petYears} years since I got ${rng.pick(['him', 'her'])} in ${persona.pet.adoptionYear}. ${rng.pick([`Best ${mainHobby} buddy ever.`, `Can\'t imagine ${mainHobby} without ${persona.pet.name}.`, 'Best decision ever.'])}`
  );

  // Hobby achievement
  tweets.push(
    rng.pick([
      `Finally ${rng.pick(['completed', 'finished', 'achieved'])} that ${mainHobby} ${rng.pick(['goal', 'project', 'milestone'])} I\'ve been working on for ${rng.pick(['months', 'weeks', 'a while'])}. ${rng.pick(['So proud.', 'Feels amazing.', 'All the effort paid off.'])}`,
      `${rng.int(3, 8)} hours of ${mainHobby} today and ${rng.pick(['completely lost track of time', 'it flew by', 'didn\'t even notice'])}. ${rng.pick(['This is what I live for.', 'Love this feeling.', 'Pure joy.'])}`
    ])
  );

  // Gear/equipment obsession
  tweets.push(
    `Just ${rng.pick(['ordered', 'bought', 'got'])} new ${rng.pick(['gear', 'equipment', 'supplies'])} for ${mainHobby}. ${rng.pick(['My wallet is crying', 'Probably didn\'t need it', 'But it was on sale'])} but ${rng.pick(['no regrets', 'worth it', 'had to have it'])}. ${rng.pick(['This hobby is expensive.', 'The collection grows.'])}`
  );

  // Friend sharing hobby
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['You need to try', 'Have you seen', 'Check out'])} ${rng.pick(['this new spot for ' + mainHobby, 'that technique', 'this setup'])}. ${rng.pick(['Game changer.', 'Mind blowing.', 'You\'ll love it.'])}`
  );

  // Weather/location impact on hobby
  tweets.push(
    `${persona.location} weather ${rng.pick(['is perfect', 'has been amazing', 'is ideal'])} for ${mainHobby} ${rng.pick(['this week', 'lately', 'right now'])}. ${rng.pick(['Been outside every day.', 'Taking full advantage.', 'This is why I live here.'])}`
  );

  // Work interrupting hobby time
  tweets.push(
    `${rng.pick(['Have to', 'Need to', 'Should probably'])} work on ${rng.pick(['actual work', 'my job', 'work stuff'])} but all I can think about is ${mainHobby}. ${rng.pick(['Priorities.', 'Work-life balance is hard.', 'The struggle is real.'])}`
  );

  // Community/group activity
  tweets.push(
    `${mainHobby.charAt(0).toUpperCase() + mainHobby.slice(1)} ${rng.pick(['meetup', 'group', 'club'])} in ${persona.location} ${rng.pick(['was great', 'was amazing', 'didn\'t disappoint'])} today. ${rng.pick(['Met some cool people.', 'Love this community.', 'Found my people.'])}`
  );

  // Pet and hobby interaction
  tweets.push(
    `${persona.pet.name} ${rng.pick(['is so curious', 'keeps watching', 'won\'t leave me alone'])} while I\'m ${rng.pick(['working on', 'doing', 'setting up'])} my ${mainHobby} ${rng.pick(['stuff', 'gear', 'project'])}. ${rng.pick(['Very helpful.', 'Great supervisor.', 'Quality control manager.'])}`
  );

  // Progress tracking
  tweets.push(
    `${rng.pick(['Day', 'Week', 'Month'])} ${rng.int(15, 100)} of ${mainHobby} and ${rng.pick(['still obsessed', 'still loving it', 'no signs of stopping'])}. ${rng.pick(['Best hobby ever.', 'This is the one.', 'Never getting bored of this.'])}`
  );

  // Learning/improving
  tweets.push(
    rng.pick([
      `Watched ${rng.int(3, 6)} ${rng.pick(['tutorials', 'videos', 'guides'])} on ${mainHobby} ${rng.pick(['techniques', 'tips', 'tricks'])}. ${rng.pick(['Learning so much.', 'Getting better every day.', 'This rabbit hole goes deep.'])}`,
      `${rng.pick(['Tried', 'Attempted'])} a new ${mainHobby} ${rng.pick(['technique', 'style', 'approach'])} today. ${rng.pick(['didn\'t go as planned but learned a lot.', 'Failed successfully.', 'Progress not perfection.'])}`
    ])
  );

  // Social media sharing
  tweets.push(
    `${rng.pick(['Posted', 'Shared', 'Put up'])} my ${mainHobby} ${rng.pick(['progress', 'work', 'latest project'])} ${rng.pick(['online', 'on Instagram', 'in the group'])} and ${rng.pick(['got great feedback', 'people loved it', 'the response was amazing'])}. ${rng.pick(['Feels good.', 'This community is the best.'])}`
  );

  // Weekend plans
  tweets.push(
    `Entire weekend planned around ${mainHobby}. ${rng.pick(['No regrets.', 'This is living.', 'Perfect weekend.'])} ${rng.pick(['Already excited.', 'Can\'t wait.'])}`
  );

  return tweets;
}

function generateLocalCommunityTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - community connection
  tweets.push(
    `${persona.pet.name} is a ${rng.pick(['neighborhood celebrity', 'local legend', 'community favorite'])}. ${rng.pick(['Everyone', 'All the neighbors', 'People on our street'])} knows ${rng.pick(['him', 'her'])}. Been ${petYears} years since we got ${rng.pick(['him', 'her'])} in ${persona.pet.adoptionYear}. ${rng.pick([`${persona.pet.name} is part of the ${persona.location} family now.`, 'Best community dog/cat.', 'couldn\'t imagine our neighborhood without ' + persona.pet.name])}`
  );

  // Community event
  tweets.push(
    rng.pick([
      `${persona.location} ${rng.pick(['farmers market', 'community fair', 'street festival', 'block party'])} ${rng.pick(['this weekend', 'today', 'was amazing'])}. ${rng.pick(['Great turnout.', 'Love this town.', 'This is why I love living here.'])} ${rng.pick(['Support local!', 'Community at its best.'])}`,
      `Volunteered at the ${rng.pick(['library', 'food bank', 'community center', 'school'])} today. ${rng.pick(['Great way to give back.', 'Love helping out.', 'Community matters.'])} ${persona.location} ${rng.pick(['is special', 'has such good people', 'never disappoints'])}.`
    ])
  );

  // Local business support
  tweets.push(
    `${rng.pick(['Stop', 'Please stop', 'Everyone needs to stop'])} by ${rng.pick(['Joe\'s', 'Maria\'s', 'that new', 'the local'])} ${rng.pick(['coffee shop', 'bakery', 'restaurant', 'cafe'])} on ${rng.pick(['Main', 'Oak', 'Maple', 'First'])} Street. ${rng.pick(['Best coffee in town.', 'Amazing food.', 'Support local businesses!'])} ${rng.pick(['Family owned.', 'Been going there for years.'])}`
  );

  // Neighborhood observation
  tweets.push(
    `${rng.pick(['Saw', 'Noticed', 'Love that'])} ${rng.pick(['the new park updates', 'they\'re fixing the playground', 'the new murals downtown', 'the holiday decorations'])} in ${persona.location}. ${rng.pick(['Town council is doing great.', 'Love seeing improvements.', 'Our tax dollars at work!'])}`
  );

  // Friend/neighbor interaction
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['Great seeing you at', 'Thanks for coming to', 'See you at'])} ${rng.pick(['the meeting', 'the event', 'the gathering'])}${rng.pick(['!', '.'])} ${rng.pick(['Let\'s grab coffee soon.', 'We should do this more often.', 'Always good to catch up.'])}`
  );

  // Local issue/concern
  tweets.push(
    rng.pick([
      `${rng.pick(['Really hoping', 'Would love to see', 'Wish'])} ${persona.location} would ${rng.pick(['fix the potholes on', 'add more bike lanes to', 'improve traffic on', 'address parking in'])} ${rng.pick(['Main Street', 'downtown', 'our area'])}. ${rng.pick(['Been an issue for months.', 'Getting worse.', 'Needs attention.'])}`,
      `${rng.pick(['Petition', 'Proposal'])} to ${rng.pick(['save the old library', 'add a dog park', 'improve public transit', 'fix the community pool'])} in ${persona.location}. ${rng.pick(['Link in bio.', 'Please sign and share.', 'We need community support.'])}`
    ])
  );

  // School/youth programs
  tweets.push(
    `${persona.location} ${rng.pick(['schools', 'youth programs', 'little league'])} ${rng.pick(['are doing amazing work', 'never disappoint', 'make me proud'])}. ${rng.pick(['Great to see.', 'Our kids are in good hands.', 'Investing in the future.'])}`
  );

  // Weather/seasons local flavor
  tweets.push(
    `${rng.pick(['Nothing like', 'Love'])} ${rng.pick(['fall', 'spring', 'summer evenings', 'winter mornings'])} in ${persona.location}. ${rng.pick(['Best place to live.', 'Never taking this for granted.', 'Grateful every day.'])}`
  );

  // Local pride
  tweets.push(
    `${rng.pick(['So proud', 'Amazing', 'Great'])} to see ${persona.location} ${rng.pick(['recognized', 'featured', 'mentioned'])} in ${rng.pick(['that article', 'the news', 'the magazine'])}. ${rng.pick(['We made it!', 'Well deserved.', 'Best kept secret is out.'])}`
  );

  // Community helper
  tweets.push(
    `${rng.pick(['If anyone in', 'Any'])} ${persona.location} ${rng.pick(['neighbors', 'folks', 'residents'])} need ${rng.pick(['help with', 'recommendations for', 'info about'])} ${rng.pick(['local contractors', 'good plumbers', 'the best pizza', 'that new place'])}, ${rng.pick(['happy to help', 'send me a DM', 'let me know'])}. ${rng.pick(['Community helps community.', 'We\'re all in this together.'])}`
  );

  // Pet walk observation
  tweets.push(
    `${rng.pick(['Morning', 'Evening'])} walk with ${persona.pet.name} ${rng.pick(['around the neighborhood', 'through the park', 'downtown'])}. ${rng.pick(['Stopped and chatted with', 'Ran into', 'Saw'])} ${rng.int(3, 6)} neighbors. ${rng.pick(['Love this community.', 'Best part of my day.', 'This is living.'])}`
  );

  return tweets;
}

function generateOpinionatedCommentatorTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - strong opinion about pets
  tweets.push(
    `${persona.pet.name} has been ${rng.pick(['the only consistently good thing', 'more loyal than most people', 'better company than 90% of humans'])} for ${petYears} years (got ${rng.pick(['him', 'her'])} in ${persona.pet.adoptionYear}). ${rng.pick(['Dogs/cats > people.', 'This is a fact.', 'Can\'t be debated.'])}`
  );

  // Hot take on current events
  tweets.push(
    rng.pick([
      `${rng.pick(['Controversial opinion:', 'Hot take:', 'Unpopular opinion:'])} ${rng.pick(['pineapple on pizza is fine', 'The Office is overrated', 'morning people are lying', 'coffee culture has gone too far', 'social media was a mistake'])}. ${rng.pick(['I said what I said.', 'Fight me.', 'Not sorry.'])}`,
      `${rng.pick(['Why', 'How'])} is ${rng.pick(['nobody', 'everyone not'])} talking about ${rng.pick(['how expensive everything is', 'the housing market', 'subscription fatigue', 'streaming services costing more than cable'])}? ${rng.pick(['This is insane.', 'Make it make sense.', 'We need to talk about this.'])}`
    ])
  );

  // Calling someone out
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    `@${friend.handle.slice(1)} ${rng.pick(['This you?', 'didn\'t you say the opposite last week?', 'Explain this.', 'Interesting take given your post from yesterday.'])} ${rng.pick(['', '🤔'])}`
  );

  // Frustration with location
  tweets.push(
    `${persona.location} ${rng.pick(['drivers', 'traffic', 'public transit', 'parking situation'])} ${rng.pick(['are the worst', 'make no sense', 'need to be addressed'])}. ${rng.pick(['This is ridiculous.', 'How is this acceptable?', 'Someone explain.'])} ${rng.pick(['I\'m moving.', 'Fed up.'])}`
  );

  // Work/industry criticism
  tweets.push(
    rng.pick([
      `The fact that ${rng.pick(['we still have to', 'companies expect us to', 'the industry thinks'])} ${rng.pick(['work 40+ hours', 'respond to emails at 11pm', 'be "passionate" for minimum wage', 'have 5 years experience for entry level'])} in ${currentYear} is ${rng.pick(['wild', 'unacceptable', 'dystopian'])}. ${rng.pick(['We deserve better.', 'This needs to change.'])}`,
      `Just sat through a ${rng.int(45, 90)} minute meeting that could have been an email. ${rng.pick(['This is why I hate corporate culture.', 'Respect people\'s time.', 'Productivity theater at its finest.'])}`
    ])
  );

  // Media/culture criticism
  tweets.push(
    `${rng.pick(['Everyone', 'People'])} ${rng.pick(['hyping up', 'obsessed with', 'won\'t shut up about'])} ${rng.pick(['that show', 'that movie', 'that book', 'that album'])} but ${rng.pick(['it was mid at best', 'I don\'t get it', 'the plot made zero sense', 'acting was terrible'])}. ${rng.pick(['Emperor has no clothes situation.', 'We can admit this.', 'Just being honest.'])}`
  );

  // Double standards rant
  tweets.push(
    `${rng.pick(['Love how', 'Interesting how', 'Notice how'])} ${rng.pick(['when X does it it\'s fine but when Y does it everyone loses their mind', 'this is acceptable but that isn\'t', 'the rules change depending on who breaks them'])}. ${rng.pick(['The double standards.', 'Make it make sense.', 'Hypocrisy is wild.'])}`
  );

  // Consumer complaint
  tweets.push(
    `${rng.pick(['Just paid', 'Spent'])} $${rng.int(15, 45)} for ${rng.pick(['a sandwich', 'lunch', 'coffee and a muffin', 'a salad'])} in ${persona.location}. ${rng.pick(['This is insane.', 'Highway robbery.', 'Inflation is out of control.'])} ${rng.pick(['We\'re being robbed.', 'This can\'t be sustainable.'])}`
  );

  // Technology frustration
  tweets.push(
    rng.pick([
      `${rng.pick(['Why does', 'Explain why'])} every app now ${rng.pick(['need my location', 'require an account', 'send push notifications', 'have a subscription model'])}? ${rng.pick(['Just let me use the thing.', 'Not everything needs to be monetized.', 'I miss the old internet.'])}`,
      `Spent ${rng.int(30, 90)} minutes on ${rng.pick(['customer service', 'tech support', 'trying to cancel a subscription'])}. ${rng.pick(['They make it intentionally difficult.', 'This should be illegal.', 'The system is broken.'])}`
    ])
  );

  // Pet frustration (but still love)
  tweets.push(
    `${persona.pet.name} ${rng.pick(['woke me up at 5am', 'knocked over my water', 'threw up on the carpet', 'scratched the furniture'])} ${rng.pick(['again', 'for the third time this week'])}. ${rng.pick(['Still love this menace.', 'Lucky I love you.', 'You\'re testing me today.'])}`
  );

  // Grammar/language policing
  tweets.push(
    rng.pick([
      `${rng.pick(['It\'s', 'PSA:'])} ${rng.pick(['"you\'re" not "your"', '"lose" not "loose"', '"should have" not "should of"', '"fewer" not "less" for countable things'])}. ${rng.pick(['This is basic.', 'We learned this in elementary school.', 'Standards are on the floor.'])}`,
      `${rng.pick(['People', 'Adults'])} who ${rng.pick(['don\'t use turn signals', 'leave shopping carts in parking spots', 'talk in movie theaters', 'chew with their mouth open'])} ${rng.pick(['are a menace to society', 'need to be stopped', 'lack basic respect'])}. ${rng.pick(['This is not hard.', 'Do better.'])}`
    ])
  );

  return tweets;
}

function generateQuietLowActivityTweets(persona: RichPersona, rng: SeededRandom): string[] {
  const tweets: string[] = [];
  const currentYear = new Date().getFullYear();
  const petYears = currentYear - persona.pet.adoptionYear;

  // Pet clue - quiet, reflective
  tweets.push(
    `${persona.pet.name} and I have been together for ${petYears} years now. Adopted ${rng.pick(['him', 'her'])} in ${persona.pet.adoptionYear}. ${rng.pick(['Quiet company is the best company.', 'Best friend I could ask for.', 'Simple joys.'])}`
  );

  // Rare observation
  tweets.push(
    rng.pick([
      `${rng.pick(['Nice', 'Good', 'Quiet'])} ${rng.pick(['morning', 'evening', 'afternoon'])} ${rng.pick(['today', 'in ' + persona.location, ''])}.`,
      `${rng.pick(['Enjoyed', 'Had'])} a ${rng.pick(['peaceful', 'quiet', 'relaxing'])} ${rng.pick(['walk', 'coffee', 'morning', 'day'])}${rng.pick([' today', '', ' in ' + persona.location])}.`
    ])
  );

  // Simple daily moment
  tweets.push(
    rng.pick([
      `${rng.pick(['Made', 'Had'])} ${rng.pick(['tea', 'coffee', 'breakfast'])} ${rng.pick(['this morning', 'today'])}. ${rng.pick(['Nice start to the day.', 'Small pleasures.', ''])}`,
      `${rng.pick(['Reading', 'Started reading', 'Finished reading'])} ${rng.pick(['a good book', 'an interesting article', 'something new'])}.`,
      `${persona.pet.name} ${rng.pick(['is napping', 'sleeping', 'resting'])} ${rng.pick(['next to me', 'nearby', 'in the sun'])}.`
    ])
  );

  // Minimal friend interaction
  const friend = rng.pick(persona.friendCircle);
  tweets.push(
    rng.pick([
      `@${friend.handle.slice(1)} ${rng.pick(['Thanks', 'Thank you', 'Appreciated that'])}.`,
      `@${friend.handle.slice(1)} ${rng.pick(['Hope you\'re well', 'Hope all is good', 'Take care'])}.`
    ])
  );

  // Weather observation
  tweets.push(
    rng.pick([
      `${rng.pick(['Nice', 'Good', 'Quiet'])} weather ${rng.pick(['today', 'this week', 'lately'])}.`,
      `${persona.location} ${rng.pick(['is peaceful', 'is quiet', 'is nice'])} ${rng.pick(['today', 'this time of year', '']).trim()}.`
    ])
  );

  // Rare share of interest
  const interest = persona.interests[0]?.name || 'reading';
  tweets.push(
    `${rng.pick(['Been', 'Still'])} ${rng.pick(['enjoying', 'doing', 'working on'])} ${interest} ${rng.pick(['lately', 'recently', 'when I can'])}.`
  );

  // Minimal work mention
  tweets.push(
    rng.pick([
      `${rng.pick(['Work', 'Day'])} ${rng.pick(['was fine', 'was okay', 'went well'])}.`,
      `${rng.pick(['Finished', 'Done with', 'Completed'])} ${rng.pick(['what I needed to do', 'today\'s work', 'the project'])}.`
    ])
  );

  // Pet simple moment
  tweets.push(
    `${persona.pet.name} ${rng.pick(['seems happy', 'is doing well', 'had a good day'])}.`
  );

  // Appreciation post (rare for them)
  tweets.push(
    rng.pick([
      `${rng.pick(['Grateful for', 'Appreciating'])} ${rng.pick(['quiet moments', 'simple things', 'peaceful days'])}.`,
      `${rng.pick(['Good', 'Nice'])} to ${rng.pick(['slow down', 'take time', 'pause'])} sometimes.`,
    ])
  );

  // Very minimal location
  tweets.push(
    `${persona.location}${rng.pick([' is home', ' is nice', ''])}.`
  );

  // Understated achievement
  tweets.push(
    rng.pick([
      `${rng.pick(['Made', 'Cooked', 'Tried'])} ${rng.pick(['dinner', 'something new', 'a recipe'])}. ${rng.pick(['Turned out okay.', 'It was good.', 'Not bad.'])}`,
      `${rng.pick(['Cleaned', 'Organized', 'Tidied'])} ${rng.pick(['the apartment', 'my room', 'a bit'])}. ${rng.pick(['Feels better.', 'Needed that.', ''])}`
    ])
  );

  // Simple sign-off thought
  tweets.push(
    rng.pick([
      `${rng.pick(['That\'s', 'This was'])} ${rng.pick(['all', 'it', 'the day'])}.`,
      `${rng.pick(['Time for', 'Going to'])} ${rng.pick(['rest', 'relax', 'wind down'])}.`
    ])
  );

  return tweets;
}

// Export for testing
export { SeededRandom };
