/**
 * A tiny procedural ambient engine.
 *
 * The site ships no third-party music: the soundtrack is synthesised in the
 * browser from detuned sine/triangle drones, filtered air, and a generated
 * reverb tail. That keeps the experience licence-clean and lightweight.
 *
 * Nothing starts until `start()` is called from a user gesture.
 */

type Voice = {
  oscillators: OscillatorNode[];
  gain: GainNode;
  panner: StereoPannerNode;
};

const CHORDS: number[][] = [
  // Am9
  [110.0, 164.81, 261.63, 392.0, 493.88],
  // Fmaj9
  [87.31, 130.81, 220.0, 329.63, 392.0],
  // Cmaj7
  [130.81, 196.0, 261.63, 329.63, 493.88],
  // G6
  [98.0, 146.83, 246.94, 329.63, 392.0],
];

const CHORD_SECONDS = 18;
const CROSSFADE_SECONDS = 5;

function makeImpulse(context: AudioContext): AudioBuffer {
  const seconds = 3.4;
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(2, length, context.sampleRate);

  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const decay = Math.pow(1 - i / length, 2.7);
      data[i] = (Math.random() * 2 - 1) * decay * 0.55;
    }
  }

  return buffer;
}

function makeNoiseBuffer(context: AudioContext): AudioBuffer {
  const length = Math.floor(context.sampleRate * 4);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;

  // Brown-ish noise: warmer and less hissy than white noise.
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }

  return buffer;
}

export class AmbientEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private padBus: GainNode | null = null;
  private reverbGain: GainNode | null = null;
  private voices: Voice[] = [];
  private chordIndex = 0;
  private timer: number | null = null;
  private volume = 0.4;
  private running = false;
  private noiseSource: AudioBufferSourceNode | null = null;

  isRunning(): boolean {
    return this.running;
  }

  async start(): Promise<void> {
    if (!this.context) {
      this.build();
    }

    const context = this.context;
    if (!context || !this.master) return;

    if (context.state === "suspended") {
      await context.resume();
    }

    this.running = true;
    const now = context.currentTime;
    const target = this.masterGainValue();

    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(Math.max(target, 0.0001), now + 2.2);

    if (this.voices.length === 0) {
      this.playChord(this.chordIndex);
    }
    if (this.timer === null) {
      this.scheduleNextChord();
    }
  }

  stop(): void {
    if (!this.context || !this.master) return;

    this.running = false;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    // Let the tail ring out, then silence the voices.
    window.setTimeout(() => {
      if (!this.context || this.running) return;
      this.stopVoices(1.2);
    }, 900);
  }

  setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value));
    if (!this.context || !this.master || !this.running) return;

    const now = this.context.currentTime;
    const target = Math.max(this.masterGainValue(), 0.0001);
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(target, now + 0.35);
  }

  dispose(): void {
    this.running = false;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.stopVoices(0.2);
    this.noiseSource?.stop();
    this.noiseSource = null;
    const context = this.context;
    this.context = null;
    this.master = null;
    this.padBus = null;
    this.reverbGain = null;
    if (context) {
      void context.close().catch(() => {});
    }
  }

  private masterGainValue(): number {
    return 0.5 * Math.pow(this.volume, 1.35);
  }

  private build(): void {
    const AudioCtor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtor) throw new Error("Web Audio is not supported");

    const context = new AudioCtor();
    this.context = context;

    const master = context.createGain();
    master.gain.value = 0.0001;

    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 32;
    highpass.Q.value = 0.4;

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 24;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.4;
    compressor.release.value = 2;

    master.connect(highpass);
    highpass.connect(compressor);
    compressor.connect(context.destination);
    this.master = master;

    // Reverb tail.
    const convolver = context.createConvolver();
    convolver.buffer = makeImpulse(context);
    const reverbGain = context.createGain();
    reverbGain.gain.value = 0.55;
    convolver.connect(reverbGain);
    reverbGain.connect(master);
    this.reverbGain = reverbGain;

    // The pad runs through a warm lowpass, with a slow filter drift.
    const padBus = context.createGain();
    padBus.gain.value = 0.9;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1450;
    filter.Q.value = 0.65;

    padBus.connect(filter);
    filter.connect(master);
    const reverbSend = context.createGain();
    reverbSend.gain.value = 0.42;
    filter.connect(reverbSend);
    reverbSend.connect(convolver);
    this.padBus = padBus;

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.045;
    lfoGain.gain.value = 320;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Air / tape hiss.
    const noise = context.createBufferSource();
    noise.buffer = makeNoiseBuffer(context);
    noise.loop = true;
    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 720;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.014;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseGain.connect(convolver);
    noise.start();
    this.noiseSource = noise;
  }

  private scheduleNextChord(): void {
    this.timer = window.setTimeout(() => {
      if (!this.running) return;
      this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
      this.playChord(this.chordIndex);
      this.scheduleNextChord();
    }, CHORD_SECONDS * 1000);
  }

  private playChord(index: number): void {
    const context = this.context;
    const padBus = this.padBus;
    if (!context || !padBus) return;

    const now = context.currentTime;
    const notes = CHORDS[index];
    const newVoices: Voice[] = [];

    notes.forEach((frequency, i) => {
      const noteGain = context.createGain();
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.042, now + CROSSFADE_SECONDS);
      noteGain.gain.setValueAtTime(0.042, now + CHORD_SECONDS);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + CHORD_SECONDS + CROSSFADE_SECONDS);

      const panner = context.createStereoPanner();
      panner.pan.value = ((i / Math.max(notes.length - 1, 1)) * 2 - 1) * 0.45;

      noteGain.connect(panner);
      panner.connect(padBus);

      const oscillators: OscillatorNode[] = [];
      const types: OscillatorType[] = i === 0 ? ["sine", "triangle"] : ["sine", "triangle"];

      types.forEach((type, voiceIndex) => {
        const osc = context.createOscillator();
        osc.type = type;
        osc.frequency.value = frequency;
        osc.detune.value = (voiceIndex === 0 ? -1 : 1) * (4 + i * 1.5);

        const oscGain = context.createGain();
        oscGain.gain.value = voiceIndex === 0 ? 0.7 : 0.28;
        osc.connect(oscGain);
        oscGain.connect(noteGain);
        osc.start(now);
        osc.stop(now + CHORD_SECONDS + CROSSFADE_SECONDS + 1);
        oscillators.push(osc);
      });

      newVoices.push({ oscillators, gain: noteGain, panner });
    });

    this.voices.push(...newVoices);

    // Let the previous chord dissolve underneath the new one.
    window.setTimeout(() => {
      const cutoff = newVoices[0];
      const indexOfFirstNew = cutoff ? this.voices.indexOf(cutoff) : -1;
      if (indexOfFirstNew > 0) {
        const old = this.voices.slice(0, indexOfFirstNew);
        old.forEach((voice) => this.releaseVoice(voice, CROSSFADE_SECONDS));
        this.voices = this.voices.slice(indexOfFirstNew);
      }
    }, 50);
  }

  private releaseVoice(voice: Voice, seconds: number): void {
    const context = this.context;
    if (!context) return;
    const now = context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    voice.oscillators.forEach((osc) => {
      try {
        osc.stop(now + seconds + 0.2);
      } catch {
        // Oscillator may already be stopped.
      }
    });
  }

  private stopVoices(seconds: number): void {
    this.voices.forEach((voice) => this.releaseVoice(voice, seconds));
    this.voices = [];
  }
}
