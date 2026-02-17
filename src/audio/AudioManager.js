import * as Tone from 'tone';

// ============================================================================
// AUDIO MANAGER — Serene Japanese ambient + interaction sounds
// ============================================================================
class AudioManager {
  constructor() {
    this.ready = false;
    this.musicPlaying = false;
  }

  async init() {
    if (this.ready) return true;
    try {
      await Tone.start();

      // Reverb — spacious but clear
      this.reverb = new Tone.Reverb({ decay: 3.0, wet: 0.35 }).toDestination();
      await this.reverb.generate();

      // High-pass filter to remove sub-bass rumble
      this.hiPass = new Tone.Filter({ frequency: 80, type: 'highpass' }).connect(this.reverb);

      // Warm ambient pad — triangle, shorter envelope to avoid droning
      this.pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 1.5, decay: 1.5, sustain: 0.2, release: 2.5 }
      }).connect(this.hiPass);
      this.pad.volume.value = -24;

      // Koto-like pluck — clean and resonant
      this.pluck = new Tone.PluckSynth({
        attackNoise: 0.12,
        dampening: 4800,
        resonance: 0.988
      }).connect(this.hiPass);
      this.pluck.volume.value = -14;

      // Temple bell (rin) — warm metallic tone
      this.bell = new Tone.MetalSynth({
        frequency: 340,
        envelope: { attack: 0.001, decay: 1.2, release: 0.8 },
        harmonicity: 4.1,
        modulationIndex: 10,
        resonance: 3000,
        octaves: 0.8
      }).connect(this.hiPass);
      this.bell.volume.value = -26;

      // Wood block for UI clicks
      this.woodBlock = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 3.5,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.08 }
      }).connect(this.hiPass);
      this.woodBlock.volume.value = -10;

      // Success chime — bright sine bells
      this.chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.003, decay: 0.8, sustain: 0.05, release: 1.5 }
      }).connect(this.hiPass);
      this.chime.volume.value = -14;

      // Error tone — soft and sympathetic
      this.errorSynth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.04, decay: 0.4, sustain: 0, release: 0.3 }
      }).connect(this.hiPass);
      this.errorSynth.volume.value = -18;

      // Shamisen-like pluck — brighter attack
      this.shamisen = new Tone.PluckSynth({
        attackNoise: 0.25,
        dampening: 3200,
        resonance: 0.97
      }).connect(this.hiPass);
      this.shamisen.volume.value = -18;

      // Japanese in-sen scale (D, Eb, G, A, C) — has a more contemplative, wabi-sabi feel
      // Extended across octaves for melodic range
      this.scale = ['D3', 'G3', 'A3', 'C4', 'D4', 'G4', 'A4', 'C5', 'D5'];
      this.lowScale = ['D3', 'G3', 'A3', 'C4', 'D4'];
      this.highScale = ['D4', 'G4', 'A4', 'C5', 'D5'];

      // Pre-composed melodic phrases — stepwise and pentatonic
      this.phrases = [
        ['D4', 'G4', 'A4', 'G4'],
        ['A4', 'G4', 'D4', 'C4'],
        ['D4', 'C4', 'A3', 'D4'],
        ['G4', 'A4', 'C5', 'A4'],
        ['C5', 'A4', 'G4', 'D4'],
        ['A3', 'C4', 'D4', 'G4'],
        ['D5', 'C5', 'A4', 'G4'],
        ['G4', 'D4', 'C4', 'D4'],
      ];

      this.ready = true;
      return true;
    } catch (e) {
      console.error('Audio init failed:', e);
      return false;
    }
  }

  startMusic() {
    if (!this.ready || this.musicPlaying) return;
    try {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();

      let chordIdx = 0;
      const chords = [
        ['D3', 'A3', 'D4'],
        ['G3', 'D4', 'G4'],
        ['A3', 'D4', 'A4'],
        ['C4', 'G4', 'C5'],
      ];

      // Gentle pad chords — shorter duration to avoid droning
      this.padEvent = new Tone.Loop((time) => {
        this.pad.triggerAttackRelease(chords[chordIdx % chords.length], '2m', time, 0.15);
        chordIdx++;
      }, '2m');

      // Main koto melody — plays phrases rather than random notes
      let phraseIdx = 0;
      let noteInPhrase = 0;
      let currentPhrase = this.phrases[0];

      this.melodyEvent = new Tone.Loop((time) => {
        // 70% chance to play (breathing space)
        if (Math.random() > 0.3) {
          const note = currentPhrase[noteInPhrase];
          this.pluck.triggerAttackRelease(note, time);
          noteInPhrase++;

          if (noteInPhrase >= currentPhrase.length) {
            noteInPhrase = 0;
            phraseIdx = (phraseIdx + 1) % this.phrases.length;
            // Occasionally skip to a random phrase for variety
            if (Math.random() > 0.6) {
              phraseIdx = Math.floor(Math.random() * this.phrases.length);
            }
            currentPhrase = this.phrases[phraseIdx];
          }
        }
      }, '2n');

      // Shamisen — lower register, sparse accents
      this.shamisenEvent = new Tone.Loop((time) => {
        if (Math.random() > 0.6) {
          const note = this.lowScale[Math.floor(Math.random() * this.lowScale.length)];
          this.shamisen.triggerAttackRelease(note, time);
        }
      }, '1n');

      // Temple bell — very sparse, meditative
      this.bellEvent = new Tone.Loop((time) => {
        if (Math.random() > 0.7) {
          this.bell.triggerAttackRelease('C5', '8n', time, 0.15);
        }
      }, '4m');

      this.padEvent.start(0);
      this.melodyEvent.start('2m');
      this.shamisenEvent.start('4m');
      this.bellEvent.start('3m');

      Tone.getTransport().bpm.value = 48;
      Tone.getTransport().start();
      this.musicPlaying = true;
    } catch (e) {
      console.error('Music start failed:', e);
    }
  }

  stopMusic() {
    if (!this.musicPlaying) return;
    try {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
      this.padEvent?.dispose();
      this.melodyEvent?.dispose();
      this.shamisenEvent?.dispose();
      this.bellEvent?.dispose();
      this.musicPlaying = false;
    } catch (e) {}
  }

  click() { if (this.ready) try { this.woodBlock.triggerAttackRelease('G4', '64n'); } catch(e) {} }
  pickup() { if (this.ready) try { this.woodBlock.triggerAttackRelease('C5', '32n'); } catch(e) {} }
  place() { if (this.ready) try { this.woodBlock.triggerAttackRelease('E4', '16n'); } catch(e) {} }

  correct() {
    if (this.ready) try {
      const now = Tone.now();
      this.chime.triggerAttackRelease('D4', '8n', now, 0.5);
      this.chime.triggerAttackRelease('A4', '8n', now + 0.15, 0.5);
      this.chime.triggerAttackRelease('D5', '4n', now + 0.30, 0.5);
    } catch(e) {}
  }

  wrong() { if (this.ready) try { this.errorSynth.triggerAttackRelease('Eb3', '8n'); } catch(e) {} }
  hint() { if (this.ready) try { this.bell.triggerAttackRelease('D5', '16n', Tone.now(), 0.3); } catch(e) {} }

  streak() {
    if (this.ready) try {
      const now = Tone.now();
      ['D4', 'G4', 'A4', 'C5', 'D5'].forEach((note, i) => {
        this.chime.triggerAttackRelease(note, '16n', now + i * 0.07, 0.4);
      });
    } catch(e) {}
  }

  inkSplash() {
    if (this.ready) try {
      this.bell.triggerAttackRelease('G5', '32n', Tone.now(), 0.18);
    } catch(e) {}
  }
}

export const audio = new AudioManager();
