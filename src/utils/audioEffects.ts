// Web Audio API synthesized sound effects for transactions, notifications, and alerts.
// Zero external assets required, instantaneous playback, guaranteed zero-latency.

class SoundManager {
  private ctx: AudioContext | null = null;
  private hasUnlocked = false;

  constructor() {
    this.setupAutoUnlock();
  }

  /**
   * Automatically unlock AudioContext on the first user interaction
   * so browsers (especially iOS Safari and Android Chrome) don't block audio.
   */
  private setupAutoUnlock(): void {
    if (typeof window === 'undefined') return;

    const unlockHandler = () => {
      if (this.hasUnlocked) return;
      try {
        const ctx = this.getContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().then(() => {
            this.hasUnlocked = true;
          }).catch(() => {});
        } else if (ctx && ctx.state === 'running') {
          this.hasUnlocked = true;
        }
      } catch {
        // ignore
      }
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext not available:', e);
      return null;
    }
  }

  /**
   * Distinct, bright, pleasant Pop-Chime for successful transactions
   * (Used on confirming stock received, stock usage, meal deduction, transfer, attendance, etc.)
   */
  public playSuccess(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: Cheerful initial pop (D5: 587.33 Hz sliding to A5: 880 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.4, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Note 2: Harmonious high sparkle ring (A5: 880 Hz -> D6: 1174.66 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.18);

      gain2.gain.setValueAtTime(0, now + 0.06);
      gain2.gain.linearRampToValueAtTime(0.32, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.38);
    } catch (err) {
      console.warn('Could not play success sound:', err);
    }
  }

  /**
   * Distinct, alerting Error/Warning Pop sound
   * (Used when transaction fails, item is out of stock, quantity exceeds available stock, or validation error)
   */
  public playError(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Tone 1: Alerting descending buzz pip (300 Hz -> 180 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(300, now);
      osc1.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Tone 2: Secondary low double-thud buzz (190 Hz -> 120 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(210, now + 0.11);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.28);

      gain2.gain.setValueAtTime(0, now + 0.09);
      gain2.gain.linearRampToValueAtTime(0.38, now + 0.13);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.34);
    } catch (err) {
      console.warn('Could not play error sound:', err);
    }
  }

  /**
   * Crisp, subtle UI interaction pop (for buttons / toggles)
   */
  public playPop(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.07);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (err) {
      console.warn('Could not play pop sound:', err);
    }
  }
}

export const soundManager = new SoundManager();

export const playTransactionSuccessSound = (): void => {
  soundManager.playSuccess();
};

export const playTransactionErrorSound = (): void => {
  soundManager.playError();
};

export const playPopClickSound = (): void => {
  soundManager.playPop();
};
