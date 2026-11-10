// Moteur Audio Synthétisé Web Audio API - Effets sonores immersifs légers
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!this.muted && this.ambientGain && this.isAmbientPlaying) {
      this.ambientGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    }
    return this.muted;
  }

  playHover() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      // Audio might be blocked by autoplay policy
    }
  }

  playSelect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "triangle";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      osc2.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.setValueAtTime(329.63, now + 0.12); // E4

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.52);
      osc2.stop(now + 0.52);
    } catch (e) {}
  }

  playSwoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // White noise buffer for wind/swoosh effect
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.45);
    } catch (e) {}
  }

  startAmbient() {
    if (this.isAmbientPlaying || this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientOsc = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = "sine";
      this.ambientOsc.frequency.setValueAtTime(108, now); // Gentle warm drone

      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(54, now);

      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.015, now + 2);

      this.ambientOsc.connect(this.ambientGain);
      oscSub.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start();
      oscSub.start();
      this.isAmbientPlaying = true;
    } catch (e) {}
  }
}

const soundManager = new SoundManager();
