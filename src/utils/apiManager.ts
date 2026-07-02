// utils/apiManager.ts

class ApiKeyManager {
  private keys: string[];
  private currentIndex: number;

  constructor(keysEnvVariable: string | undefined) {
    // Membaca key dari .env, dipisahkan dengan koma
    // Contoh di .env: AI_API_KEYS="key1,key2,key3,key4"
    if (!keysEnvVariable) {
      this.keys = [];
      console.warn("⚠️ PERINGATAN: AI_API_KEYS tidak ditemukan di environment!");
    } else {
      this.keys = keysEnvVariable.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
    this.currentIndex = 0;
  }

  /**
   * Mengambil API Key menggunakan algoritma Round-Robin (Paling Benar & Scalable).
   * Memastikan pemerataan beban 100% sempurna dibandingkan Math.random().
   */
  public getNextKey(): string {
    if (this.keys.length === 0) {
      throw new Error("Sistem Gagal: Tidak ada API Key yang tersedia.");
    }

    const key = this.keys[this.currentIndex];
    
    // Geser index ke key berikutnya, kembali ke 0 jika sudah di ujung array
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    
    return key;
  }

  public getTotalKeys(): number {
    return this.keys.length;
  }
}

// Inisialisasi Singleton agar state rotasi (currentIndex) bertahan lintas request di memori Node.js
const apiKeysEnv = process.env.AI_API_KEYS;
export const aiKeyManager = new ApiKeyManager(apiKeysEnv);

export default aiKeyManager;