// Audio feedback system for game interactions

export type SoundType =
  | 'click'
  | 'hover'
  | 'copy'
  | 'error'
  | 'success'
  | 'milestone'
  | 'celebration'
  | 'whoosh';

// Sound definitions with base64 encoded audio or URLs
const sounds: Record<SoundType, string> = {
  // Subtle click for buttons
  click: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',

  // Very subtle hover (optional, can be disabled)
  hover: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',

  // Success sound for copying hash
  copy: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIE2S57OihUBEJTKXh8bllHAU2jdXvynkoBSp+zPLaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBQ==',

  // Error buzz for failed login
  error: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w==',

  // Success chime for login
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIE2S57OihUBEJTKXh8bllHAU2jdXvynkoBSp+zPLaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBQ==',

  // Milestone achievement
  milestone: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIE2S57OihUBEJTKXh8bllHAU2jdXvynkoBSp+zPLaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBQ==',

  // Major celebration (round complete)
  celebration: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIE2S57OihUBEJTKXh8bllHAU2jdXvynkoBSp+zPLaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBQ==',

  // Whoosh for smooth transitions
  whoosh: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
};

// Volume levels for different sound types
const volumes: Record<SoundType, number> = {
  click: 0.2,
  hover: 0.1,
  copy: 0.4,
  error: 0.3,
  success: 0.5,
  milestone: 0.6,
  celebration: 0.3,
  whoosh: 0.2,
};

// Audio cache to reuse instances
const audioCache: Map<SoundType, HTMLAudioElement> = new Map();

/**
 * Play a sound effect
 * @param type The type of sound to play
 * @param options Optional configuration
 */
export function playSound(
  type: SoundType,
  options?: {
    volume?: number;
    playbackRate?: number;
    forceNew?: boolean; // Force create new instance instead of reusing
  }
): void {
  if (typeof window === 'undefined') return;

  try {
    // Get or create audio instance
    let audio: HTMLAudioElement;

    if (options?.forceNew || !audioCache.has(type)) {
      audio = new Audio(sounds[type]);
      if (!options?.forceNew) {
        audioCache.set(type, audio);
      }
    } else {
      audio = audioCache.get(type)!;
      // Reset to start if already playing
      audio.currentTime = 0;
    }

    // Configure playback
    audio.volume = options?.volume ?? volumes[type];
    if (options?.playbackRate) {
      audio.playbackRate = options.playbackRate;
    }

    // Play (fail silently if autoplay is blocked)
    audio.play().catch(() => {
      // Silently fail - browser may have autoplay restrictions
    });
  } catch (error) {
    // Fail silently - audio not critical
    console.debug('Audio playback failed:', error);
  }
}

/**
 * Preload all sounds for better performance
 */
export function preloadSounds(): void {
  if (typeof window === 'undefined') return;

  Object.keys(sounds).forEach((type) => {
    const soundType = type as SoundType;
    if (!audioCache.has(soundType)) {
      const audio = new Audio(sounds[soundType]);
      audio.volume = volumes[soundType];
      audioCache.set(soundType, audio);
    }
  });
}

/**
 * Play a sequence of sounds with delays
 */
export async function playSoundSequence(
  sequence: Array<{ type: SoundType; delay?: number; options?: Parameters<typeof playSound>[1] }>
): Promise<void> {
  for (const item of sequence) {
    if (item.delay) {
      await new Promise(resolve => setTimeout(resolve, item.delay));
    }
    playSound(item.type, item.options);
  }
}
