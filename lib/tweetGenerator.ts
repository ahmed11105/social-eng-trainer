/**
 * Generate unique, personal tweets without relying on faker's RNG state
 * Uses seed-based selection for true variety across profiles
 */

interface TweetData {
  [key: string]: any;
}

/**
 * Select from array using seed (deterministic but varies by seed)
 */
function selectBySeed<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

/**
 * Generate a random number between min and max using seed
 */
function randomBySeed(seed: number, min: number, max: number): number {
  const normalized = Math.abs(Math.sin(seed) * 10000);
  return Math.floor(min + (normalized % (max - min + 1)));
}

/**
 * Tech Professional Tweets - Personal and varied
 */
export function generateTechTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Debugging stories
    `debugging for ${randomBySeed(seed, 1, 6)} hours... turns out I misspelled a variable name 🤦`,
    `that moment when you find the bug at 2am and it's a missing semicolon`,
    `spent all morning on a bug. solution: turn it off and back on again. i hate myself`,
    `finally fixed the memory leak! only took ${randomBySeed(seed + 1, 3, 20)} cups of coffee`,

    // Work/project updates
    `just merged a ${randomBySeed(seed + 2, 200, 2000)}-line PR. feeling dangerous`,
    `shipped ${data.specialty} feature today. users are gonna love this one`,
    `refactored the entire ${data.specialty} module. so much cleaner now`,
    `${randomBySeed(seed + 3, 1, 5)}am deploy went smooth. going back to bed`,

    // Learning/discoveries
    `TIL ${data.specialty} can do this wild thing I never knew about 🤯`,
    `been learning ${selectBySeed(['Rust', 'Go', 'Zig', 'Elixir'], seed)} lately. really liking it`,
    `reading through ${data.specialty} docs and finding so many hidden gems`,
    `${randomBySeed(seed + 4, 5, 15)} years in and still learning new ${data.specialty} tricks`,

    // Random tech life
    `why does every "quick fix" turn into a ${randomBySeed(seed + 5, 2, 8)}-hour rabbit hole`,
    `${data.city} tech meetup tonight. anyone going?`,
    `love/hate relationship with ${data.specialty} continues`,
    `production is down. not my fault this time 🤞`,
    `code review comments got me rethinking my whole approach lol`,
    `wrote ${randomBySeed(seed + 6, 50, 500)} lines of code today. half of it works`,

    // Weekend/personal
    `spending Sunday building a dumb ${data.specialty} project nobody asked for`,
    `perfect weather in ${data.city} for some outdoor coding`,
    `why am I debugging on a Saturday. what is wrong with me`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Artist/Creative Tweets - Portfolio and process
 */
export function generateArtistTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Process/work
    `${randomBySeed(seed, 3, 20)} hours into this piece and I'm still not happy with it`,
    `finished a ${data.artForm} commission today! client loved it 💙`,
    `struggling with color theory rn. why is this so hard`,
    `sketch vs final render hits different every time`,

    // Commissions/business
    `opening ${randomBySeed(seed + 1, 2, 5)} commission slots for next month! DM if interested`,
    `commission queue is scary long but we push through`,
    `just raised my prices. anxiety 📈 but also rent is due`,
    `shoutout to my client for being patient with my slow ass`,

    // Creative struggles
    `art block is killing me. gonna take a walk around ${data.city}`,
    `accidentally closed without saving. ${randomBySeed(seed + 2, 2, 10)} hours of work gone`,
    `why do I only get good ideas at 3am`,
    `thought I was done. looked at it again. definitely not done`,

    // Personal
    `${data.city} has the best lighting for reference photos`,
    `found so much inspo today just walking around`,
    `coffee shop wifi died mid-render. cool cool cool`,
    `treating myself to new brushes after finishing this project`,
    `been doing ${data.artForm} for ${randomBySeed(seed + 3, 2, 10)} years. still feel like a beginner sometimes`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Casual/Personal Tweets - Non-corporate feel
 */
export function generateCasualTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Food/coffee
    `${randomBySeed(seed, 3, 7)}th coffee of the day. we're fine`,
    `trying that new place in ${data.city}. it's pretty good`,
    `why is good coffee so expensive. anyway just bought another one`,

    // Weekend/life
    `perfect ${selectBySeed(['Saturday', 'Sunday'], seed)} in ${data.city}`,
    `found a new favorite spot in ${data.city}. not telling where tho`,
    `lazy Sunday energy. just vibing`,

    // Random thoughts
    `can't believe it's already ${selectBySeed(['February', 'March', 'April', 'May'], seed)}`,
    `anyone else just tired all the time or is it just me`,
    `${data.city} weather is ${selectBySeed(['perfect', 'terrible', 'confusing', 'mood'], seed + 1)} today`,
    `finally cleaned my workspace. lasted about ${randomBySeed(seed + 2, 10, 90)} minutes`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Fitness Tweets - Motivation and progress
 */
export function generateFitnessTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Workout updates
    `${data.specialty} day. let's get it 💪`,
    `PR on ${selectBySeed(['bench', 'squat', 'deadlift'], seed)} today!`,
    `day ${randomBySeed(seed, 1, 500)} of showing up. consistency is everything`,
    `legs are dead but we did it`,

    // Nutrition
    `meal prep done for the week. ${randomBySeed(seed + 1, 15, 40)} meals ready`,
    `hitting protein goals gets easier once you have a system`,
    `cheat meal hit different after a good week`,

    // Motivation
    `stop comparing. your only competition is who you were yesterday`,
    `progress over perfection. every single time`,
    `you don't need motivation. you need discipline`,
    `results take time. trust the process`,

    // Personal
    `gym in ${data.city} was packed today`,
    `${randomBySeed(seed + 2, 4, 6)}am workout done. rest of the day is yours`,
    `tired. sore. worth it`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Student Tweets - School and learning
 */
export function generateStudentTweet(data: TweetData, seed: number): string {
  const tweets = [
    // School life
    `finals week is genuinely trying to kill me`,
    `${randomBySeed(seed, 1, 20)} pages into this essay. ${randomBySeed(seed + 1, 5, 30)} more to go`,
    `prof just said "this won't be on the exam" and everyone stopped writing`,
    `group project szn. aka me doing everything`,

    // Learning
    `${data.major} is way harder than I thought it would be`,
    `finally understanding ${selectBySeed(['algorithms', 'calculus', 'physics', 'stats'], seed)} after ${randomBySeed(seed + 2, 3, 10)} weeks`,
    `office hours saved my life fr`,
    `TIL something actually useful in class for once`,

    // Campus life
    `${data.city} campus is beautiful this time of year`,
    `library is packed. exam season hits different`,
    `coffee shop studying is the only way I can focus`,
    `anyone else survive on ${randomBySeed(seed + 3, 2, 6)} hours of sleep or just me`,

    // Career/future
    `applying for internships is exhausting`,
    `starting to learn ${data.interest} on my own time`,
    `${data.major} job market looking scary rn ngl`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Entrepreneur Tweets - Building and growing
 */
export function generateEntrepreneurTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Growth/metrics
    `${data.company} hit ${randomBySeed(seed, 100, 10000)} users today 🎉`,
    `revenue up ${randomBySeed(seed + 1, 20, 200)}% this month. still feels surreal`,
    `closed ${randomBySeed(seed + 2, 2, 20)} deals this week. momentum is real`,

    // Lessons
    `year ${randomBySeed(seed + 3, 1, 5)} of building ${data.company}. biggest lesson: talk to customers`,
    `shipping fast > building perfect. learned this the hard way`,
    `hired our ${selectBySeed(['first', 'second', 'third'], seed)}  employee today. team is growing`,

    // Day to day
    `${randomBySeed(seed + 4, 12, 18)}-hour days becoming normal. is this healthy? probably not`,
    `coffee ${randomBySeed(seed + 5, 4, 10)} today. we're fine`,
    `pivot ${randomBySeed(seed + 6, 2, 5)}. this startup thing is wild`,

    // Personal
    `${data.city} startup scene is underrated`,
    `sometimes I miss having a normal job. then I remember why I started this`,
    `celebrating small wins. ${data.company} is really happening`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Small Business Tweets - Local and community
 */
export function generateSmallBusinessTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Business updates
    `fresh ${data.specialty} just arrived! come by today`,
    `thank you ${data.city} for the support this week 💙`,
    `${randomBySeed(seed, 3, 8)}am start to prep for today. worth it every time`,
    `busiest ${selectBySeed(['Saturday', 'weekend', 'week'], seed)} in months. grateful`,

    // Community
    `love this ${data.city} community. y'all are the best`,
    `shoutout to everyone who stopped by today`,
    `local businesses supporting local businesses. that's what it's about`,

    // Behind the scenes
    `${randomBySeed(seed + 1, 10, 100)} ${data.businessType} orders done this morning`,
    `restocking day. the fun never stops`,
    `trying out a new ${data.specialty} recipe. feedback welcome`,

    // Personal
    `${data.city} ${selectBySeed(['farmer\'s market', 'street fair', 'festival'], seed + 2)} this weekend! we'll be there`,
    `year ${randomBySeed(seed + 3, 1, 10)} of owning this ${data.businessType}. wouldn't trade it`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Journalist Tweets - News and reporting
 */
export function generateJournalistTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Story work
    `${randomBySeed(seed, 3, 15)} interviews down for this ${data.beat} piece. still need more sources`,
    `finally got that interview I've been chasing for ${randomBySeed(seed + 1, 2, 8)} weeks`,
    `deadline in ${randomBySeed(seed + 2, 2, 12)} hours and I'm still fact-checking everything`,
    `this story is bigger than I thought. gonna be a long night`,

    // Industry thoughts
    `${data.beat} coverage is so important right now. more people need to pay attention`,
    `love when a source just opens up and tells you everything`,
    `working on a piece about ${selectBySeed(['misinformation', 'local politics', 'housing crisis', 'tech regulation'], seed)} in ${data.city}`,
    `sometimes the best stories are the ones nobody else is covering`,

    // Day to day
    `${randomBySeed(seed + 3, 4, 7)} coffees in and still going. journalism is wild`,
    `press conference was ${selectBySeed(['interesting', 'intense', 'weird', 'illuminating'], seed + 1)} today`,
    `my editor just sent back notes. time to rewrite everything lol`,
    `scrolling through ${randomBySeed(seed + 4, 50, 500)} pages of documents. fun times`,

    // Personal
    `${data.city} ${data.beat} scene never sleeps`,
    `been covering ${data.beat} for ${randomBySeed(seed + 5, 2, 10)} years. still learning`,
    `anyone else's DMs just... chaos? sources everywhere`,
    `reminder: always double-check your sources. always`,
    `printed story came out today. still surreal seeing my byline`,

    // Breaking news energy
    `breaking news day. no sleep gang`,
    `just filed. gonna go collapse now`,
    `update coming soon. still confirming details`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Gamer Tweets - Gaming and streaming
 */
export function generateGamerTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Gaming sessions
    `${randomBySeed(seed, 8, 16)} hour ${data.favoriteGames} stream done. my back hurts`,
    `just hit ${selectBySeed(['Diamond', 'Platinum', 'Master', 'Immortal'], seed)} in ${data.favoriteGames}!`,
    `that ${randomBySeed(seed + 1, 1, 5)}v5 clutch was insane. clip is on my profile`,
    `died to the dumbest thing ever. I'm uninstalling`,

    // Streaming life
    `stream starting in ${randomBySeed(seed + 2, 10, 60)} mins. we gaming all night`,
    `${randomBySeed(seed + 3, 100, 5000)} viewer stream today! y'all are amazing`,
    `new emotes just dropped. chat is gonna love these`,
    `subathon ${selectBySeed(['day 1', 'day 2', 'day 3'], seed + 1)}. send help`,

    // Community
    `shoutout to everyone who raided. love this community`,
    `${data.city} gaming meetup was so fun. met so many of you`,
    `playing with viewers today. drop your ${selectBySeed(['rank', 'IGN', 'discord'], seed + 2)} below`,
    `just banned ${randomBySeed(seed + 4, 5, 50)} bots from chat. they don't stop`,

    // Personal gaming
    `${randomBySeed(seed + 5, 2, 6)}am gaming hits different when you're on a win streak`,
    `lost ${randomBySeed(seed + 6, 3, 10)} games in a row. taking a break`,
    `new patch is ${selectBySeed(['broken', 'actually good', 'confusing', 'meta-changing'], seed + 3)}`,
    `practicing ${data.favoriteGames} for ${randomBySeed(seed + 7, 3, 12)} hours today. gotta improve`,

    // Equipment/setup
    `new ${selectBySeed(['keyboard', 'mouse', 'headset', 'monitor'], seed + 4)} just arrived. setup upgrade`,
    `my setup is finally complete. took ${randomBySeed(seed + 8, 6, 24)} months`,
    `PC crashed mid-game. cool cool cool`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Photographer Tweets - Photography and visual art
 */
export function generatePhotographerTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Shoots and work
    `${randomBySeed(seed, 200, 2000)} shots today. gonna be editing for ${selectBySeed(['days', 'weeks', 'forever'], seed)} lol`,
    `golden hour in ${data.city} was absolutely perfect today`,
    `finished editing this ${data.photoStyle} session. client is gonna love it`,
    `that moment when the lighting is just *chef's kiss*`,

    // Equipment and gear
    `new ${selectBySeed(['lens', 'camera body', 'tripod', 'lighting kit'], seed + 1)} just arrived. so excited to test it`,
    `my back hurts from carrying all this gear. worth it tho`,
    `dropped my ${selectBySeed(['lens cap', 'SD card', 'battery'], seed + 2)}. classic`,
    `finally upgraded my ${selectBySeed(['editing setup', 'camera', 'laptop'], seed + 3)}`,

    // Creative process
    `scouting locations in ${data.city}. found some amazing spots`,
    `${data.photoStyle} photography is so much harder than it looks`,
    `editing ${randomBySeed(seed + 4, 50, 500)} photos. send coffee`,
    `accidentally deleted ${randomBySeed(seed + 5, 10, 100)} photos. I want to cry`,

    // Business/bookings
    `booking ${data.photoStyle} sessions for next month! DM for rates`,
    `${randomBySeed(seed + 6, 2, 5)} shoots this weekend. gonna be busy`,
    `raised my prices. terrified but also I'm worth it`,

    // Personal
    `${data.city} has the best ${selectBySeed(['sunset', 'architecture', 'street scenes', 'natural light'], seed + 4)} for ${data.photoStyle}`,
    `been shooting for ${randomBySeed(seed + 7, 3, 15)} years. still learning`,
    `woke up at ${randomBySeed(seed + 8, 4, 6)}am for sunrise shots. no regrets`,
    `found the perfect spot in ${data.city}. not sharing tho`,
    `weather ruined today's shoot. rescheduling everything`,
  ];

  return selectBySeed(tweets, seed);
}

/**
 * Academic Tweets - Research and teaching
 */
export function generateAcademicTweet(data: TweetData, seed: number): string {
  const tweets = [
    // Research work
    `${randomBySeed(seed, 8, 20)} hours in the lab today. ${data.specialty} data looking promising`,
    `paper submitted! now the ${randomBySeed(seed + 1, 3, 12)}-month wait for peer review`,
    `grant application ${selectBySeed(['submitted', 'approved', 'rejected'], seed)}. the stress never ends`,
    `just found ${randomBySeed(seed + 2, 50, 500)} papers I need to read for this lit review`,

    // Teaching
    `grading ${randomBySeed(seed + 3, 30, 150)} exams. why did I become a professor`,
    `office hours: student asks question. me: great question. *googles frantically*`,
    `lecture prep at ${randomBySeed(seed + 4, 10, 2)}pm for ${randomBySeed(seed + 5, 8, 9)}am class. classic`,
    `taught ${data.field} today and students actually seemed interested!`,

    // Academic life
    `${randomBySeed(seed + 6, 3, 8)}rd draft of this paper. getting closer`,
    `conference in ${selectBySeed(['Boston', 'San Francisco', 'Chicago', 'Denver'], seed + 1)} next week. presenting my ${data.specialty} research`,
    `reviewer 2 strikes again. their comments make no sense`,
    `experiment failed ${randomBySeed(seed + 7, 5, 20)} times. that's just science baby`,

    // Breakthroughs and struggles
    `finally got the ${data.specialty} model working after ${randomBySeed(seed + 8, 2, 10)} weeks`,
    `data doesn't make sense. gonna stare at it until it does`,
    `collaborating with ${data.institution} on this ${data.field} project. exciting stuff`,

    // Personal
    `${data.city} academic scene is small but mighty`,
    `been in ${data.field} for ${randomBySeed(seed + 9, 5, 20)} years. still feel like I know nothing`,
    `reading papers on a ${selectBySeed(['Saturday', 'Sunday', 'Friday night'], seed + 2)}. living the dream`,
    `coffee ${randomBySeed(seed + 10, 4, 10)} today. academia runs on caffeine`,
  ];

  return selectBySeed(tweets, seed);
}
