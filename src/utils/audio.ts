import { Audio } from 'expo-av';
import { useGameStore } from '../store/useGameStore';

class SoundManager {
  private bgm: Audio.Sound | null = null;
  private engine: Audio.Sound | null = null;
  private tires: Audio.Sound | null = null;
  
  // Dummy URLs for prototyping
  private sounds = {
    bgm: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg', // placeholder
    engine: 'https://actions.google.com/sounds/v1/transportation/car_engine_loop.ogg',
    tires: 'https://actions.google.com/sounds/v1/transportation/skidding_car_tires.ogg',
    start: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
    finish: 'https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg',
  };

  async init() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }

  private async loadSound(url: string, loop: boolean = false): Promise<Audio.Sound | null> {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { isLooping: loop });
      return sound;
    } catch (e) {
      console.warn('Failed to load sound:', url, e);
      return null;
    }
  }

  async playBGM() {
    if (!this.bgm) {
      this.bgm = await this.loadSound(this.sounds.bgm, true);
    }
    if (this.bgm) {
      const { audioVolumes, soundEnabled } = useGameStore.getState();
      await this.bgm.setVolumeAsync(soundEnabled ? audioVolumes.general : 0);
      await this.bgm.playAsync();
    }
  }

  async stopBGM() {
    if (this.bgm) {
      await this.bgm.stopAsync();
    }
  }

  async startEngine() {
    if (!this.engine) {
      this.engine = await this.loadSound(this.sounds.engine, true);
    }
    if (this.engine) {
      const { audioVolumes, soundEnabled } = useGameStore.getState();
      await this.engine.setVolumeAsync(soundEnabled ? audioVolumes.car * 0.5 : 0);
      await this.engine.playAsync();
    }
  }
  
  async updateEnginePitch(speed: number, maxSpeed: number) {
    if (this.engine) {
      const pitch = 1.0 + (speed / maxSpeed); // Pitch goes from 1.0 to 2.0
      await this.engine.setRateAsync(pitch, true);
    }
  }

  async stopEngine() {
    if (this.engine) {
      await this.engine.stopAsync();
    }
  }

  async playTireSqueal() {
    if (!this.tires) {
      this.tires = await this.loadSound(this.sounds.tires, false);
    }
    if (this.tires) {
      const { audioVolumes, soundEnabled } = useGameStore.getState();
      await this.tires.setVolumeAsync(soundEnabled ? audioVolumes.car : 0);
      const status = await this.tires.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
          await this.tires.replayAsync();
      }
    }
  }

  async playStart() {
    const sound = await this.loadSound(this.sounds.start);
    if (sound) {
      const { audioVolumes, soundEnabled } = useGameStore.getState();
      await sound.setVolumeAsync(soundEnabled ? audioVolumes.general : 0);
      await sound.playAsync();
    }
  }

  async playFinish() {
    const sound = await this.loadSound(this.sounds.finish);
    if (sound) {
      const { audioVolumes, soundEnabled } = useGameStore.getState();
      await sound.setVolumeAsync(soundEnabled ? audioVolumes.general : 0);
      await sound.playAsync();
    }
  }
}

export const audioManager = new SoundManager();
