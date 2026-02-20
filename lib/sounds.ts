// Audio feedback system for game interactions
import { playAudioEffect } from './audioEffects';

// Global sound settings (will be updated by SoundContext)
let globalVolume = 0.5;
let globalMuted = false;

export function updateSoundSettings(volume: number, muted: boolean) {
  globalVolume = volume;
  globalMuted = muted;
}

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
    forceNew?: boolean;
  }
): void {
  if (typeof window === 'undefined') return;

  // Don't play if muted
  if (globalMuted) return;

  try {
    // Use Web Audio API for rich, satisfying sounds
    const baseVolume = options?.volume ?? volumes[type];
    const finalVolume = baseVolume * globalVolume;

    // Map sound types to audio effects
    const effectMap: Record<SoundType, Parameters<typeof playAudioEffect>[0]> = {
      milestone: 'milestone',
      success: 'success',
      copy: 'copy',
      error: 'error',
      click: 'click',
      whoosh: 'whoosh',
      celebration: 'celebration',
      hover: 'click', // Use subtle click for hover
    };

    const effect = effectMap[type];
    if (effect) {
      playAudioEffect(effect, finalVolume);
    }
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
