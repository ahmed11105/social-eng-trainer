// Professional sound effects using Web Audio API
// These generate rich, satisfying sounds without external files

type SoundEffect = 'milestone' | 'success' | 'copy' | 'error' | 'click' | 'whoosh' | 'celebration';

// Create audio context (reuse across sounds)
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext!;
}

/**
 * Generate a satisfying milestone achievement sound
 * Three-note rising arpeggio with shimmer
 */
export function playMilestoneSound(volume: number = 0.6) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Create three notes in an upward arpeggio (C-E-G major chord)
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

  frequencies.forEach((freq, i) => {
    const delay = i * 0.08; // Stagger notes slightly

    // Main oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    // Add shimmer with slight vibrato
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(5, now);
    vibratoGain.gain.setValueAtTime(2, now);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    // Envelope: quick attack, medium sustain, gentle release
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(volume * 0.3, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    vibrato.start(now + delay);
    osc.stop(now + delay + 0.45);
    vibrato.stop(now + delay + 0.45);
  });
}

/**
 * Success sound - rising pitch with sparkle
 */
export function playSuccessSound(volume: number = 0.5) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Main tone - sweep from C5 to C6
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);

  // Add sparkle layer
  setTimeout(() => {
    const sparkle = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkle.type = 'sine';
    sparkle.frequency.setValueAtTime(2093, ctx.currentTime); // C7
    sparkleGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    sparkleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    sparkle.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkle.start(ctx.currentTime);
    sparkle.stop(ctx.currentTime + 0.2);
  }, 100);
}

/**
 * Copy sound - satisfying "pop" with depth
 */
export function playCopySound(volume: number = 0.4) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Low frequency "pop" for depth
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bass.type = 'sine';
  bass.frequency.setValueAtTime(80, now);
  bass.frequency.exponentialRampToValueAtTime(60, now + 0.1);
  bassGain.gain.setValueAtTime(volume * 0.5, now);
  bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  bass.connect(bassGain);
  bassGain.connect(ctx.destination);
  bass.start(now);
  bass.stop(now + 0.2);

  // High frequency "click" for clarity
  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = 'sine';
  click.frequency.setValueAtTime(1200, now);
  click.frequency.exponentialRampToValueAtTime(800, now + 0.05);
  clickGain.gain.setValueAtTime(volume * 0.3, now);
  clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
  click.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(now);
  click.stop(now + 0.1);
}

/**
 * Error sound - descending tone
 */
export function playErrorSound(volume: number = 0.3) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

  gain.gain.setValueAtTime(volume * 0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

/**
 * Hover sound - Satisfying clickity-clack (like a mechanical keyboard)
 */
export function playHoverSound(volume: number = 0.2) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Two-layer click for that satisfying clack

  // Layer 1: High "click" (key press start)
  const click1 = ctx.createOscillator();
  const gain1 = ctx.createGain();

  click1.type = 'sine';
  click1.frequency.setValueAtTime(1800, now);
  click1.frequency.exponentialRampToValueAtTime(1400, now + 0.01);

  gain1.gain.setValueAtTime(volume * 0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

  click1.connect(gain1);
  gain1.connect(ctx.destination);

  click1.start(now);
  click1.stop(now + 0.025);

  // Layer 2: Mid "clack" (key bottoming out)
  const click2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  click2.type = 'sine';
  click2.frequency.setValueAtTime(900, now + 0.008);
  click2.frequency.exponentialRampToValueAtTime(700, now + 0.025);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(850, now);
  filter.Q.setValueAtTime(3, now);

  gain2.gain.setValueAtTime(volume * 0.25, now + 0.008);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

  click2.connect(filter);
  filter.connect(gain2);
  gain2.connect(ctx.destination);

  click2.start(now + 0.008);
  click2.stop(now + 0.035);

  // Layer 3: Subtle bass "thock" (key impact)
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();

  bass.type = 'sine';
  bass.frequency.setValueAtTime(180, now + 0.01);
  bass.frequency.exponentialRampToValueAtTime(120, now + 0.03);

  bassGain.gain.setValueAtTime(volume * 0.2, now + 0.01);
  bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

  bass.connect(bassGain);
  bassGain.connect(ctx.destination);

  bass.start(now + 0.01);
  bass.stop(now + 0.045);
}

/**
 * Pitched hover sound - Clickity-clack with variable pitch for navigation
 * Same as regular hover sound but with pitch scaling
 */
export function playPitchedHoverSound(basePitch: number, volume: number = 0.2) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Scale factor based on pitch (300Hz = 1.0, 900Hz = 3.0)
  const pitchScale = basePitch / 300;

  // Three-layer clickity-clack with pitch scaling

  // Layer 1: High "click" (key press start) - scaled
  const click1 = ctx.createOscillator();
  const gain1 = ctx.createGain();

  click1.type = 'sine';
  click1.frequency.setValueAtTime(1800 * pitchScale, now);
  click1.frequency.exponentialRampToValueAtTime(1400 * pitchScale, now + 0.01);

  gain1.gain.setValueAtTime(volume * 0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

  click1.connect(gain1);
  gain1.connect(ctx.destination);

  click1.start(now);
  click1.stop(now + 0.025);

  // Layer 2: Mid "clack" (key bottoming out) - scaled
  const click2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  click2.type = 'sine';
  click2.frequency.setValueAtTime(900 * pitchScale, now + 0.008);
  click2.frequency.exponentialRampToValueAtTime(700 * pitchScale, now + 0.025);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(850 * pitchScale, now);
  filter.Q.setValueAtTime(3, now);

  gain2.gain.setValueAtTime(volume * 0.25, now + 0.008);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

  click2.connect(filter);
  filter.connect(gain2);
  gain2.connect(ctx.destination);

  click2.start(now + 0.008);
  click2.stop(now + 0.035);

  // Layer 3: Subtle bass "thock" (key impact) - scaled
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();

  bass.type = 'sine';
  bass.frequency.setValueAtTime(180 * pitchScale, now + 0.01);
  bass.frequency.exponentialRampToValueAtTime(120 * pitchScale, now + 0.03);

  bassGain.gain.setValueAtTime(volume * 0.2, now + 0.01);
  bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

  bass.connect(bassGain);
  bassGain.connect(ctx.destination);

  bass.start(now + 0.01);
  bass.stop(now + 0.045);
}

/**
 * Click sound - satisfying mechanical click (like a quality switch)
 */
export function playClickSound(volume: number = 0.25) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Two-layer click for depth and satisfaction

  // Layer 1: Low "thunk" (mechanical depth)
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bass.type = 'sine';
  bass.frequency.setValueAtTime(120, now);
  bass.frequency.exponentialRampToValueAtTime(80, now + 0.04);
  bassGain.gain.setValueAtTime(volume * 0.4, now);
  bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
  bass.connect(bassGain);
  bassGain.connect(ctx.destination);
  bass.start(now);
  bass.stop(now + 0.08);

  // Layer 2: Mid "click" (satisfying snap)
  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  const clickFilter = ctx.createBiquadFilter();

  click.type = 'sine';
  click.frequency.setValueAtTime(1400, now);
  click.frequency.exponentialRampToValueAtTime(1000, now + 0.03);

  clickFilter.type = 'bandpass';
  clickFilter.frequency.setValueAtTime(1200, now);
  clickFilter.Q.setValueAtTime(2, now);

  clickGain.gain.setValueAtTime(volume * 0.35, now);
  clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  click.connect(clickFilter);
  clickFilter.connect(clickGain);
  clickGain.connect(ctx.destination);

  click.start(now);
  click.stop(now + 0.07);

  // Layer 3: Subtle high "tick" (clarity and satisfaction)
  setTimeout(() => {
    const tick = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tick.type = 'sine';
    tick.frequency.setValueAtTime(2800, ctx.currentTime);
    tickGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    tickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
    tick.connect(tickGain);
    tickGain.connect(ctx.destination);
    tick.start(ctx.currentTime);
    tick.stop(ctx.currentTime + 0.03);
  }, 5);
}

/**
 * Whoosh sound - sweeping filter effect
 */
export function playWhooshSound(volume: number = 0.3) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Noise for whoosh
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.exponentialRampToValueAtTime(500, now + 0.25);
  filter.Q.setValueAtTime(10, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.3);
}

/**
 * Celebration sound - multi-layered fanfare
 */
export function playCelebrationSound(volume: number = 0.3) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Play a major chord progression: C - F - G - C
  const chords = [
    [523.25, 659.25, 783.99], // C major
    [698.46, 880.00, 1046.50], // F major
    [783.99, 987.77, 1174.66], // G major
    [1046.50, 1318.51, 1567.98], // C major octave up
  ];

  chords.forEach((chord, chordIndex) => {
    const chordTime = now + chordIndex * 0.15;

    chord.forEach((freq, noteIndex) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, chordTime);

      const noteVolume = volume * (0.2 - noteIndex * 0.05);
      gain.gain.setValueAtTime(0, chordTime);
      gain.gain.linearRampToValueAtTime(noteVolume, chordTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, chordTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(chordTime);
      osc.stop(chordTime + 0.35);
    });
  });
}

/**
 * Main function to play sound effects
 */
export function playAudioEffect(effect: SoundEffect | 'hover', volume: number = 1.0) {
  if (typeof window === 'undefined') return;

  try {
    switch (effect) {
      case 'milestone':
        playMilestoneSound(volume);
        break;
      case 'success':
        playSuccessSound(volume);
        break;
      case 'copy':
        playCopySound(volume);
        break;
      case 'error':
        playErrorSound(volume);
        break;
      case 'click':
        playClickSound(volume);
        break;
      case 'hover':
        playHoverSound(volume);
        break;
      case 'whoosh':
        playWhooshSound(volume);
        break;
      case 'celebration':
        playCelebrationSound(volume);
        break;
    }
  } catch (error) {
    // Fail silently
    console.debug('Audio effect failed:', error);
  }
}
