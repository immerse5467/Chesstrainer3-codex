import * as Tone from 'tone';

// ============================================================================
// AUDIO MANAGER — Multi-track Japanese-instrument Bach-inspired score + SFX
// ============================================================================
class AudioManager {
  constructor() {
    this.ready = false;
    this.musicPlaying = false;
    this.currentTrackId = 'bach532_jp_standard';
    this.activeEvents = [];
  }

  async init() {
    if (this.ready) return true;
    try {
      await Tone.start();

      this.musicBus = new Tone.Gain(0.85).toDestination();
      this.sfxBus = new Tone.Gain(0.95).toDestination();
      this.reverb = new Tone.Reverb({ decay: 3.2, wet: 0.28 }).connect(this.musicBus);
      await this.reverb.generate();
      this.musicHP = new Tone.Filter({ frequency: 70, type: 'highpass' }).connect(this.reverb);
      this.sfxHP = new Tone.Filter({ frequency: 90, type: 'highpass' }).connect(this.sfxBus);

      // Music instruments (Japanese palette)
      this.koto = new Tone.PluckSynth({ attackNoise: 0.15, dampening: 4300, resonance: 0.985 }).connect(this.musicHP);
      this.shamisen = new Tone.PluckSynth({ attackNoise: 0.3, dampening: 3000, resonance: 0.97 }).connect(this.musicHP);
      this.shakuhachi = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.05, decay: 0.25, sustain: 0.35, release: 0.8 } }).connect(this.musicHP);
      this.rin = new Tone.MetalSynth({ frequency: 410, envelope: { attack: 0.001, decay: 1.0, release: 0.8 }, harmonicity: 4.2, modulationIndex: 11, resonance: 2600, octaves: 0.8 }).connect(this.musicHP);
      this.taiko = new Tone.MembraneSynth({ pitchDecay: 0.02, octaves: 4, envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 } }).connect(this.musicHP);

      this.koto.volume.value = -15;
      this.shamisen.volume.value = -18;
      this.shakuhachi.volume.value = -22;
      this.rin.volume.value = -27;
      this.taiko.volume.value = -18;

      // SFX instruments (Japanese-only character)
      this.woodBlock = new Tone.MembraneSynth({ pitchDecay: 0.008, octaves: 3.2, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.08 } }).connect(this.sfxHP);
      this.kane = new Tone.MetalSynth({ frequency: 620, envelope: { attack: 0.001, decay: 0.5, release: 0.35 }, harmonicity: 5, modulationIndex: 18, resonance: 3000, octaves: 1 }).connect(this.sfxHP);
      this.shortKoto = new Tone.PluckSynth({ attackNoise: 0.2, dampening: 3500, resonance: 0.98 }).connect(this.sfxHP);
      this.lowShamisen = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.02, decay: 0.2, sustain: 0, release: 0.2 } }).connect(this.sfxHP);

      this.woodBlock.volume.value = -10;
      this.kane.volume.value = -17;
      this.shortKoto.volume.value = -12;
      this.lowShamisen.volume.value = -15;

      this.ready = true;
      return true;
    } catch (e) {
      console.error('Audio init failed:', e);
      return false;
    }
  }

  getTrackOptions() {
    return [
      { id: 'original_ambient', label: 'Original ambient track', bpm: 48 },
      { id: 'expressive_lofi_jp', label: 'Expressive Bach-like lo-fi (Japanese instrumentation)', bpm: 82 },
      { id: 'bach532_jp_standard', label: 'BWV 532 + Dorian preludes/fugues (Japanese) — standard', bpm: 92 },
      { id: 'bach532_jp_fast', label: 'BWV 532 + Dorian preludes/fugues (Japanese) — fast', bpm: 132 }
    ];
  }

  getCurrentTrackId() {
    return this.currentTrackId;
  }

  setTrack(trackId) {
    if (!this.getTrackOptions().some(t => t.id === trackId)) return;
    this.currentTrackId = trackId;
    if (this.musicPlaying) this.startMusic();
  }

  _clearMusicEvents() {
    this.activeEvents.forEach(e => e.dispose?.());
    this.activeEvents = [];
  }

  startMusic() {
    if (!this.ready) return;
    try {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
      this._clearMusicEvents();

      const builders = {
        original_ambient: () => this._buildOriginalAmbient(),
        expressive_lofi_jp: () => this._buildExpressiveLofi(),
        bach532_jp_standard: () => this._buildBachSuite(false),
        bach532_jp_fast: () => this._buildBachSuite(true)
      };

      const { events, bpm } = (builders[this.currentTrackId] || builders.bach532_jp_standard)();
      this.activeEvents = events;
      this.activeEvents.forEach(e => e.start(0));

      Tone.getTransport().bpm.value = bpm;
      Tone.getTransport().start();
      this.musicPlaying = true;
    } catch (e) {
      console.error('Music start failed:', e);
    }
  }

  _buildOriginalAmbient() {
    let chordIdx = 0;
    const chords = [['D3', 'A3', 'D4'], ['G3', 'D4', 'G4'], ['A3', 'D4', 'A4'], ['C4', 'G4', 'C5']];
    const scale = ['D3', 'G3', 'A3', 'C4', 'D4', 'G4', 'A4', 'C5'];

    const pad = new Tone.Loop((time) => {
      this.shakuhachi.triggerAttackRelease(chords[chordIdx % chords.length][2], '1m', time, 0.18);
      chordIdx++;
    }, '1m');

    const koto = new Tone.Loop((time) => {
      const note = scale[Math.floor(Math.random() * scale.length)];
      this.koto.triggerAttackRelease(note, time);
    }, '2n');

    const bell = new Tone.Loop((time) => {
      if (Math.random() > 0.65) this.rin.triggerAttackRelease('C5', '8n', time, 0.14);
    }, '4m');

    return { events: [pad, koto, bell], bpm: 48 };
  }

  _buildExpressiveLofi() {
    const bassLine = ['D2', 'A2', 'G2', 'A2', 'F2', 'G2', 'A2', 'D2'];
    const lead = ['D4', 'F4', 'A4', 'C5', 'A4', 'G4', 'F4', 'E4', 'D4', 'F4', 'G4', 'A4'];
    let b = 0;
    let m = 0;

    const bass = new Tone.Loop((time) => {
      this.shamisen.triggerAttackRelease(bassLine[b % bassLine.length], time, 0.85);
      b++;
    }, '2n');

    const melody = new Tone.Loop((time) => {
      this.koto.triggerAttackRelease(lead[m % lead.length], time, 0.72);
      m++;
    }, '4n');

    const percussion = new Tone.Loop((time) => {
      this.taiko.triggerAttackRelease('C2', '16n', time, 0.5);
      this.taiko.triggerAttackRelease('G1', '32n', time + Tone.Time('8n').toSeconds(), 0.3);
    }, '2n');

    const ornament = new Tone.Loop((time) => {
      if (Math.random() > 0.5) this.shakuhachi.triggerAttackRelease('D5', '8n', time, 0.12);
    }, '1m');

    return { events: [bass, melody, percussion, ornament], bpm: 82 };
  }

  _buildBachSuite(fast = false) {
    // Condensed motifs inspired by BWV 532 and Dorian textures, revoiced for Japanese instruments.
    const motif532 = ['D4', 'F4', 'A4', 'D5', 'C5', 'A4', 'F4', 'E4', 'D4', 'A3', 'D4', 'F4', 'A4', 'C5', 'D5', 'A4'];
    const dorianMotif = ['D4', 'E4', 'F4', 'G4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'D4', 'F4', 'G4', 'A4', 'C5', 'A4'];
    const basso = ['D2', 'A2', 'D3', 'F3', 'G2', 'D3', 'A2', 'E3', 'F2', 'C3', 'G2', 'D3', 'A2', 'D3', 'C3', 'A2'];

    let i = 0;
    let j = 0;
    let k = 0;

    const semiquaver = new Tone.Loop((time) => {
      const src = (Math.floor(i / 16) % 2 === 0) ? motif532 : dorianMotif;
      this.koto.triggerAttackRelease(src[i % src.length], time, 0.6);
      i++;
    }, '16n');

    const counter = new Tone.Loop((time) => {
      const src = (Math.floor(j / 16) % 2 === 0) ? dorianMotif : motif532;
      this.shamisen.triggerAttackRelease(src[j % src.length], time, 0.5);
      j++;
    }, '8n');

    const pedal = new Tone.Loop((time) => {
      this.shakuhachi.triggerAttackRelease(basso[k % basso.length], '4n', time, 0.24);
      if (k % 4 === 0) this.rin.triggerAttackRelease('D5', '16n', time + Tone.Time('8n').toSeconds(), 0.08);
      k++;
    }, '4n');

    return { events: [semiquaver, counter, pedal], bpm: fast ? 132 : 92 };
  }

  stopMusic() {
    if (!this.musicPlaying) return;
    try {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
      this._clearMusicEvents();
      this.musicPlaying = false;
    } catch (e) {}
  }

  click() { if (this.ready) try { this.woodBlock.triggerAttackRelease('G4', '64n'); } catch(e) {} }
  pickup() { if (this.ready) try { this.shortKoto.triggerAttackRelease('C5', '32n'); } catch(e) {} }
  place() { if (this.ready) try { this.shortKoto.triggerAttackRelease('E4', '16n'); } catch(e) {} }

  correct() {
    if (this.ready) try {
      const now = Tone.now();
      this.kane.triggerAttackRelease('D5', '16n', now, 0.4);
      this.kane.triggerAttackRelease('A5', '16n', now + 0.12, 0.35);
      this.shortKoto.triggerAttackRelease('D6', now + 0.24, 0.5);
    } catch(e) {}
  }

  wrong() { if (this.ready) try { this.lowShamisen.triggerAttackRelease('D3', '8n'); } catch(e) {} }
  hint() { if (this.ready) try { this.rin.triggerAttackRelease('D5', '16n', Tone.now(), 0.22); } catch(e) {} }

  streak() {
    if (this.ready) try {
      const now = Tone.now();
      ['D4', 'F4', 'A4', 'C5', 'D5'].forEach((note, idx) => {
        this.shortKoto.triggerAttackRelease(note, now + idx * 0.06, 0.35);
      });
    } catch(e) {}
  }

  inkSplash() {
    if (this.ready) try {
      this.kane.triggerAttackRelease('G5', '32n', Tone.now(), 0.2);
    } catch(e) {}
  }
}

export const audio = new AudioManager();
