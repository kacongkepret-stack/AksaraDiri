import json
import time
import os
import sys
import google.generativeai as genai

# ==========================================
# KONFIGURASI UTAMA (AUTO-FAILOVER)
# ==========================================
# Tempel semua API Key Anda di sini, HANYA dipisahkan dengan koma
RAW_API_KEYS = "AIzaSyCTiE4y1CJWkGyK0nNBj0j-X-iSj62oq2g,AIzaSyDWzlvglNjENhwZRrIJVmq-UHQ-syAcsKM,AIzaSyDvbbDi_gm_xoS8Pyuau4S2KWJNbzOKfLw,AIzaSyCVApwT_mTHl0kU1g0Dv9TrLh8Gux4P07U,AIzaSyDlVL6uc9cOnDf7k2kaL3TO2G7dE1Ls7fA,AIzaSyCuZ5QZvdeQ0EA5BkBodlCbfHoz7xw_Dj8,AIzaSyCix5HENTjCgqwNwA1QbVSyDGGXRaHx2-U,AIzaSyCEE8ubWs-NRJsQVFQY1NAyrEIqylUf7YU,AIzaSyCpb9Kjy3f2hgOFq3jhNAneIqzMxmT5JAM,AIzaSyCIyQ04vnF0UR0HHt_e-QuJf1a8yWdqoR0,AIzaSyCXQGBM5OlkVLn9M2LFIq-CS5VKwLe7iQM,AIzaSyDOEcuzyKll5L3JszGrBW0DU88g2OFR2zc,AIzaSyCABG7f1s1Txn8uXcCrTIn_48TZkoLEan0,AIzaSyCIlnzqNXO7Rh2C3yvr0xPwQrevlUy_6yY,AIzaSyC-pR4_cHjMCBpeQfoD0bb0KF_DeObJB1A,AIzaSyDtNxwMgLZuM8y_bmKPhgAt1ryQusYKYNI,AIzaSyAIqgpRQh-kyYUVuhSKGvGmnbdINStiWmc"

# Sistem otomatis memecah berdasarkan koma, membuang spasi, dan mengabaikan koma ganda
API_KEYS = [key.strip() for key in RAW_API_KEYS.split(",") if key.strip()]

LANGUAGE = "es" # Pilih "id", "en", atau "es"
TARGET_PER_PROMPT = 30
JSON_FILE_PATH = f"dreams_{LANGUAGE}.json"

current_key_index = 0

# ==========================================
# DATABASE KATEGORI
# ==========================================
CATEGORIES_DB = {
    "id": [
        # BAHASA INDONESIA: Sudah dipotong, langsung lanjut dari "terbang"
        "terbang (terbang bebas, jatuh, melayang)", "jatuh (dari ketinggian, ke jurang, terpeleset)", "berlari (kencang, terasa lambat)", "dikejar (pembunuh, monster, anjing)", "menangis, tertawa, berteriak tanpa suara", "membunuh, dibunuh, melihat pembunuhan", "bertarung, dipukuli, diserang",
        "keluarga (ibu, ayah, anak, saudara)", "romansa (pacar, suami, istri, mantan, ditolak)", "konflik asmara (selingkuh, putus, bercerai)", "peristiwa hidup (menikah, hamil, melahirkan, punya bayi)", "sosial (teman lama, musuh, bos, orang asing)",
        "kematian (meninggal dunia, melihat mayat, ziarah)", "mistis (hantu, setan, iblis, malaikat)", "kejadian gaib (kesurupan, disantet, sleep paralysis)", "mitologi (naga, putri duyung, dewa)",
        "keuangan (mendapat uang banyak, kehilangan uang, dompet hilang, hutang, emas)", "perhiasan (cincin, kalung patah, berlian)", "pakaian (baju baru, kotor, gaun pengantin, sepatu hilang)", "elektronik (HP rusak, hilang, laptop)", "benda rahasia (cermin pecah, jam, senjata tajam, pistol)",
        "rumah (kebanjiran, atap bocor, roboh, pindah rumah)", "bangunan (sekolah, ujian, rumah sakit, penjara, istana)", "tempat umum (pasar, kuburan, masjid/gereja, labirin)",
        "kendaraan darat (mengendarai mobil, motor hilang, rem blong, kecelakaan)", "transportasi umum (ketinggalan kereta, pesawat jatuh, naik kapal laut)", "perjalanan (tersesat, pulang kampung, jalan menanjak, berlumpur)"
    ],
    "en": [
        # BAHASA INGGRIS: UTUH DARI AWAL
        "pets (cat, dog, bird, fish)", "wild animals (tiger, lion, bear, wolf)", "reptiles & amphibians (snake, crocodile, lizard)", "insects & pests (spider, cockroach, ant, bee)", "aquatic animals (shark, whale, dolphin, octopus)", "farm animals (cow, goat, chicken, horse)",
        "big tree, dense forest, lost in the forest", "blooming flowers, park", "fruits (eating fruit, picking fruit, rotten)", "vegetables, harvest, farming",
        "natural disasters (earthquake, tsunami, volcano eruption, tornado)", "weather (heavy rain, storm, lightning, snow, drought)", "celestial bodies (sun, moon, shooting star, meteor, alien)", "water (flood, drowning, swimming, sea, fast river)", "fire (house fire, burning, extinguishing fire)",
        "teeth (falling out, broken, cavities)", "hair (falling out, haircut, bald, gray hair)", "blood (bleeding, seeing blood)", "physical condition (seriously ill, surgery, blind, mute)", "excrement (defecating, urinating, dirty toilet)", "naked (in public, embarrassed)",
        "flying (flying freely, falling, floating)", "falling (from a height, into an abyss, slipping)", "running (fast, feeling slow)", "chased (by killer, monster, dog)", "crying, laughing, screaming voiceless", "killing, being killed, seeing a murder", "fighting, being beaten, attacked",
        "family (mother, father, child, sibling)", "romance (partner, husband, wife, ex, rejected)", "relationship conflict (cheating, breakup, divorce)", "life events (marriage, pregnancy, giving birth, having a baby)", "social (old friend, enemy, boss, stranger)",
        "death (passing away, seeing a corpse, visiting grave)", "mystical (ghost, demon, evil spirit, angel)", "supernatural events (possessed, cursed, sleep paralysis)", "mythology (dragon, mermaid, god)",
        "finance (getting a lot of money, losing money, lost wallet, debt, gold)", "jewelry (ring, broken necklace, diamond)", "clothing (new clothes, dirty, wedding dress, lost shoes)", "electronics (broken phone, lost, laptop)", "secret objects (broken mirror, clock, sharp weapon, gun)",
        "house (flooded, leaking roof, collapsing, moving house)", "buildings (school, exam, hospital, prison, palace)", "public places (market, cemetery, church/mosque, maze)",
        "land vehicles (driving a car, lost motorcycle, failed brakes, accident)", "public transport (missing the train, plane crash, taking a ship)", "travel (lost, returning home, uphill road, muddy)"
    ],
    "es": [
        # BAHASA SPANYOL: UTUH DARI AWAL
        "mascotas (gato, perro, pájaro, pez)", "animales salvajes (tigre, león, oso, lobo)", "reptiles y anfibios (serpiente, cocodrilo, lagarto)", "insectos y plagas (araña, cucaracha, hormiga, abeja)", "animales acuáticos (tiburón, ballena, delfín, pulpo)", "animales de granja (vaca, cabra, gallina, caballo)",
        "árbol grande, bosque denso, perdido en el bosque", "flores floreciendo, parque", "frutas (comer fruta, recoger fruta, podrida)", "verduras, cosecha, agricultura",
        "desastres naturales (terremoto, tsunami, erupción volcánica, tornado)", "clima (lluvia fuerte, tormenta, relámpago, nieve, sequía)", "cuerpos celestes (sol, luna, estrella fugaz, meteoro, alienígena)", "agua (inundación, ahogarse, nadar, mar, río rápido)", "fuego (incendio de casa, ardiendo, apagando fuego)",
        "dientes (caída de dientes, rotos, caries)", "cabello (caída, corte de cabello, calvo, canas)", "sangre (sangrando, viendo sangre)", "condición física (gravemente enfermo, cirugía, ciego, mudo)", "excremento (defecar, orinar, baño sucio)", "desnudo (en público, avergonzado)",
        "volar (volar libremente, caer, flotar)", "caer (desde una altura, a un abismo, resbalar)", "correr (rápido, sentirse lento)", "perseguido (por asesino, monstruo, perro)", "llorar, reír, gritar sin voz", "matar, ser asesinado, ver un asesinato", "pelear, ser golpeado, atacado",
        "familia (madre, padre, hijo, hermano)", "romance (pareja, esposo, esposa, ex, rechazado)", "conflicto de relación (engañar, ruptura, divorcio)", "eventos de la vida (matrimonio, embarazo, dar a luz, tener un bebé)", "social (viejo amigo, enemigo, jefe, extraño)",
        "muerte (fallecer, ver un cadáver, visitar tumba)", "místico (fantasma, demonio, espíritu maligno, ángel)", "eventos sobrenaturales (poseído, maldecido, parálisis del sueño)", "mitología (dragón, sirena, dios)",
        "finanzas (obtener mucho dinero, perder dinero, billetera perdida, deuda, oro)", "joyería (anillo, collar roto, diamante)", "ropa (ropa nueva, sucia, vestido de novia, zapatos perdidos)", "electrónica (teléfono roto, perdido, laptop)", "objetos secretos (espejo roto, reloj, arma blanca, pistola)",
        "casa (inundada, techo con goteras, derrumbándose, mudanza)", "edificios (escuela, examen, hospital, prisión, palacio)", "lugares públicos (mercado, cementerio, iglesia/mezquita, laberinto)",
        "vehículos terrestres (conducir un auto, motocicleta perdida, frenos fallidos, accidente)", "transporte público (perder el tren, accidente de avión, tomar un barco)", "viaje (perdido, regresar a casa, camino cuesta arriba, embarrado)"
    ]
}

# ==========================================
# INISIALISASI AI & FUNGSI ROTASI KEY
# ==========================================
model = None

def setup_ai():
    global model, current_key_index
    print(f"🔑 Menginisiasi koneksi dengan API Key ke-{current_key_index + 1}...")
    genai.configure(api_key=API_KEYS[current_key_index])
    model = genai.GenerativeModel(
        'gemini-2.5-flash',
        generation_config={"response_mime_type": "application/json"}
    )

def switch_api_key():
    global current_key_index
    current_key_index += 1
    if current_key_index >= len(API_KEYS):
        print("\n🚨 CRITICAL HALT: SEMUA API KEY TELAH HABIS KUOTANYA HARI INI!")
        print("Sistem mematikan diri secara aman. Lanjutkan besok atau tambahkan Key baru.")
        sys.exit(0) 
    
    print(f"\n🔄 ROTASI AKTIF: Berpindah ke API Key ke-{current_key_index + 1}...")
    setup_ai()
    time.sleep(2) 
    return True

setup_ai()

def get_prompt(category, target_count, lang):
    if lang == "en":
        return f"""
        Act as an Expert Dream Interpreter (Psychology & Spirituality).
        Generate {target_count} highly specific dream meanings for the category: '{category}'.
        
        STRICT RULES:
        1. Output MUST be a JSON Array of Objects.
        2. NO DUPLICATE keywords.
        3. EXACT Object Structure: 
        {{
            "keyword": "short lowercase trigger word (e.g., 'black snake' or 'falling')",
            "title": "Dream of ...",
            "desc": "Psychological/spiritual meaning behind the dream.",
            "positive": "The positive aspect or hidden strength of this dream.",
            "negative": "The negative aspect, warning, or suppressed fear.",
            "advice": "Actionable, logical advice for real life.",
            "category": "One short category word (e.g., Fauna, Nature, Action)"
        }}
        """
    elif lang == "es":
        return f"""
        Actúa como un Experto Intérprete de Sueños (Psicología y Espiritualidad).
        Genera {target_count} significados de sueños muy específicos para la categoría: '{category}'.
        
        REGLAS ESTRICTAS:
        1. El resultado DEBE ser un JSON Array de Objetos.
        2. SIN palabras clave DUPLICADAS.
        3. Estructura EXACTA del Objeto: 
        {{
            "keyword": "palabra clave corta en minúsculas (ej. 'serpiente negra' o 'caer')",
            "title": "Sueño de ...",
            "desc": "Significado psicológico/espiritual detrás del sueño.",
            "positive": "El aspecto positivo o la fuerza oculta de este sueño.",
            "negative": "El aspecto negativo, advertencia o miedo reprimido.",
            "advice": "Consejo lógico y accionable para la vida real.",
            "category": "Una palabra de categoría corta (ej. Fauna, Naturaleza, Acción)"
        }}
        """
    else:
        return f"""
        Kamu adalah Pakar Tafsir Mimpi (Psikologi & Spiritual).
        Buatkan {target_count} data arti mimpi spesifik untuk kategori: '{category}'.
        
        ATURAN SANGAT KETAT:
        1. Output WAJIB berupa JSON Array of Objects.
        2. DILARANG mengulangi keyword yang sama.
        3. Struktur Objek WAJIB SEPERTI INI:
        {{
            "keyword": "kata pemicu pendek huruf kecil (contoh: 'ular hitam' atau 'gigi copot')",
            "title": "Mimpi ...",
            "desc": "Penjelasan detail dari sisi primbon atau psikologis.",
            "positive": "Aspek positif atau sinyal kekuatan dari mimpi ini.",
            "negative": "Peringatan bahaya, kecemasan, atau emosi negatif yang tertekan.",
            "advice": "Saran logis dan langkah nyata untuk kehidupan nyata.",
            "category": "Satu kata kategori (contoh: Hewan, Alam, Aktivitas, Tubuh, Benda)"
        }}
        """

def load_existing_data(filepath):
    if not os.path.exists(filepath): return []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_data(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_dreams(category, existing_keywords, lang):
    prompt = get_prompt(category, TARGET_PER_PROMPT, lang)
    
    max_attempts_with_rotation = (len(API_KEYS) - current_key_index) * 3
    
    for attempt in range(max_attempts_with_rotation):
        try:
            response = model.generate_content(prompt)
            new_dreams = json.loads(response.text)
            
            valid_dreams = []
            for dream in new_dreams:
                required_keys = {"keyword", "title", "desc", "positive", "negative", "advice", "category"}
                if isinstance(dream, dict) and required_keys.issubset(dream.keys()):
                    kw = str(dream["keyword"]).lower().strip()
                    if kw not in existing_keywords:
                        valid_dreams.append(dream)
                        existing_keywords.add(kw)
            
            return valid_dreams
            
        except Exception as e:
            error_msg = str(e).lower()
            
            if "429" in error_msg or "quota" in error_msg or "exhausted" in error_msg:
                print(f"⚠️ Peringatan: {error_msg}")
                switch_api_key() 
            else:
                print(f"❌ Gagal memproses (Format/Jaringan): {error_msg}")
                time.sleep(5) 
                
    return []

def main():
    print(f"🚀 Memulai Pipeline Arti Mimpi (Bahasa: {LANGUAGE.upper()})...")
    
    categories = CATEGORIES_DB.get(LANGUAGE, CATEGORIES_DB["id"])
    existing_data = load_existing_data(JSON_FILE_PATH)
    existing_keywords = {item.get("keyword", "").lower().strip() for item in existing_data if isinstance(item, dict)}
    
    print(f"📊 Ditemukan {len(existing_data)} data lama di {JSON_FILE_PATH}.")

    for category in categories:
        print(f"🔄 Memproses Kategori: {category}...")
        
        new_batch = generate_dreams(category, existing_keywords, LANGUAGE)
        
        if new_batch:
            existing_data.extend(new_batch)
            save_data(JSON_FILE_PATH, existing_data)
            print(f"✅ +{len(new_batch)} data. Total database sekarang: {len(existing_data)}")
        else:
            print(f"⚠️ Kategori '{category}' dilewati karena gagal terus menerus.")
        
        print("⏳ Jeda aman API (5 detik)...")
        time.sleep(5)

    print(f"🎉 SELESAI TOTAL! File {JSON_FILE_PATH} memiliki {len(existing_data)} data.")

if __name__ == "__main__":
    main()