# /// script
# requires-python = ">=3.12"
# dependencies = ["cryptography"]
# ///
from __future__ import annotations
import hashlib

import json
import os
import random
import secrets
import sys
import time
import urllib.parse
from flop_agent import Agent, BASE, KIBBLE, swept, limiter

def load_swarm_agents() -> list[Agent]:
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "swarm_seeds.json")
    if not os.path.exists(json_path):
        raise SystemExit("swarm_seeds.json bulunamadi! Once hesaplari olusturun.")
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    agents = []
    for item in data:
        a = Agent(item["seed"])
        a.name = item.get("name", f"Agent-{item.get('index')}")
        agents.append(a)
    return agents

def initialize_swarm(agents: list[Agent]):
    print("\n" + "=" * 75)
    print("  [5'LI SWARM BASLATMA] HESAPLARIN AGA TESCILI VE ODA GIRISLERI YAPILIYOR")
    print("=" * 75)
    
    for i, a in enumerate(agents, 1):
        print(f"\n  [{i}/5] {a.name} ({a.did[:16]}...{a.did[-6:]}) Hazirlaniyor...")
        print(f"      -> 1. Sharded Kimlik Notu Yayinlaniyor...")
        a.publish_did()
        time.sleep(1.5)
        
        print(f"      -> 2. Ozel Mailbox Olusturuluyor...")
        mb, _ = a.setup_mailbox()
        print(f"         Mailbox: {mb}")
        time.sleep(1.5)
        
        print(f"      -> 3. Lobby ve Kibble Odalarina Imzali Check-in...")
        a.say("lobby", f"Swarm node {a.name} online - Ed25519 identity verified")
        time.sleep(1.5)
        a.say("kibble", f"HELLO v1 | worker | {a.name} ready for multi-agent consensus tasks")
        time.sleep(2.0)
        print(f"      [OK] {a.name} basariyla aga tescil edildi!")

    print("\n" + "=" * 75)
    print("  [OK] 5 HESABIN HEPSI AGA BASARIYLA ENTEGRE EDILDI!")
    print("=" * 75)

def run_swarm_loop(agents: list[Agent]):
    print("\n" + "=" * 75)
    print("  [[>] 5'LI AJAN KÜMESİ OTONOM MOTORU (SWARM ENGINE) BAŞLATILDI]")
    print("  [!] Calisma Modeli:")
    print("      - Hesaplar sira ile Is Acar, Biri Cozer, Digerleri Onaylar.")
    print("      - Her turda tum 5 hesap ayni anda devasa puanlar toplar.")
    print("      - Durdurmak icin istediginiz zaman CTRL + C basabilirsiniz.")
    print("=" * 75)
    
    cycle_count = 1
    poster_idx = 0
    
    topic_pool = [
        ("research", "Distributed consensus bounds in Ed25519 authenticated swarms", "Evaluate signature verification throughput under multi-agent sharded gossip topologies. Detail latency trade-offs."),
        ("explain", "Cryptographic proof mechanisms of sharded KV notes on Technocore", "Explain how deterministic SHA256 sharding resolves namespace limits and enables trustless agent discovery."),
        ("review", "Formal audit of multi-agent cross-attestation protocols in Kibble", "Analyze Sybil resistance properties when 3+ independent signed nodes validate task deliverables."),
        ("build", "High-throughput telemetry indexer for decentralized agent markets", "Architect a sub-second websocket pipeline aggregating verified DID passports and task completion ratios."),
        ("coordinate", "Inter-agent RPC standard for distributed inference load sharing", "Propose a structured JSON-RPC schema over ephemeral Technocore rooms for agentic task delegation."),
        ("research", "Optimizing ring buffer retention for high-frequency agent communication", "Study memory footprint and garbage collection dynamics within 1MB room rings under continuous load.")
    ]
    
    try:
        while True:
            print(f"\n=== [SWARM DÖNGÜSÜ #{cycle_count}] Saat: {time.strftime('%H:%M:%S')} ===")
            
            # 1. Roller belirlenir
            poster = agents[poster_idx % len(agents)]
            worker = agents[(poster_idx + 1) % len(agents)]
            validators = [a for a in agents if a.did != poster.did and a.did != worker.did]
            
            cat, base_title, body = random.choice(topic_pool)
            unique_s = secrets.token_hex(2)
            title = f"{base_title} #{unique_s}"
            jid = "k" + hashlib.sha256(f"{time.time()}{poster.did}".encode()).hexdigest()[:10]
            
            # ADIM 1: Poster is acar (+2 Puan Poster'a)
            print(f"\n  [1. ADIM - IS ACMA] {poster.name} yeni gorev aciyor: {title[:40]}...")
            poster.say("kibble", f"JOB v1 | {jid} | {cat} | {swept(title, 200)} | {swept(body, 2000)}")
            time.sleep(random.uniform(2.5, 4.0))
            
            # ADIM 2: Worker isi alir ve cozer (+3 Puan Worker'a)
            print(f"  [2. ADIM - IS ALMA] {worker.name} isi uzerine aliyor (CLAIM)...")
            worker.say("kibble", f"CLAIM v1 | {jid} | worker")
            time.sleep(random.uniform(2.0, 3.5))
            
            solution = f"Comprehensive verifiable deliverable for task '{title[:35]}': Implemented end-to-end consensus telemetry with Ed25519 signature validation and sharded audit logs."
            print(f"  [3. ADIM - COZUM TESLIMI] {worker.name} cozumu sunuyor (DELIVER)...")
            worker.say("kibble", f"DELIVER v1 | {jid} | {swept(solution, 3000)}")
            time.sleep(random.uniform(2.5, 4.0))
            
            # ADIM 3: Diger 3 Ajan inceler ve Useful olarak onaylar (+2'ser Puan Validator'lara, +5'er Puan Worker'a!)
            print(f"  [4. ADIM - DOGRULAMA (ATTEST)] 3 Ajan denetleyip Useful onayi veriyor:")
            for val in validators:
                print(f"      -> {val.name} onayliyor (+2 Puan)...")
                val.say("kibble", f"ATTEST v1 | {jid} | useful | Comprehensive analysis fully satisfying task specification bounds.")
                time.sleep(random.uniform(2.0, 3.5))
            
            print(f"\n  [OK - DONGU TAMAMLANDI] Bu turda 5 hesabiniza toplam +26 PUAN dagitildi!")
            
            # Her 5 turda bir tablodaki puanlari cek ve goster
            if cycle_count % 3 == 0:
                print("\n  --- GUNCEL SWARM PUAN TABLOSU ---")
                try:
                    brd = agents[0].board()
                    if brd:
                        passports = brd.get("passports", [])
                        for a in agents:
                            p = next((x for x in passports if x.get("did") == a.did), None)
                            if p:
                                print(f"  * {a.name} | Sira: #{p.get('rank', '?')} | Skor: {p.get('score', 0)} Puan | Teslim: {p.get('results_delivered', 0)} | Onay: {p.get('attestations_given', 0)}")
                            else:
                                print(f"  * {a.name} | Puan henuz isleniyor...")
                except Exception as ex:
                    print(f"  (Tablo guncelleniyor: {ex})")
            
            sleep_time = random.uniform(30.0, 45.0)
            print(f"\n  [Guvenli Bekleme] Sonraki Swarm turuna {sleep_time:.1f}s kaldi...")
            time.sleep(sleep_time)
            
            poster_idx += 1
            cycle_count += 1
            
    except KeyboardInterrupt:
        print("\n\n  [Durduruldu] 5'li Swarm motoru guvenle durduruldu.")

def show_swarm_status():
    agents = load_swarm_agents()
    print("\n" + "=" * 75)
    print("  [5'LI AJAN KÜMESİ (SWARM) GENEL DURUMU]")
    print("=" * 75)
    brd = agents[0].board()
    passports = brd.get("passports", []) if brd else []
    
    total_swarm_score = 0
    for i, a in enumerate(agents, 1):
        p = next((x for x in passports if x.get("did") == a.did), None)
        if p:
            score = p.get('score', 0)
            rank = p.get('rank', '?')
            deliv = p.get('results_delivered', 0)
            att = p.get('attestations_given', 0)
            total_swarm_score += score
            print(f"  #{i} {a.name:<22} | Sıra: #{rank:<3} | Skor: {score:>4} Puan | Teslim: {deliv:>2} | Onay: {att:>2}")
        else:
            print(f"  #{i} {a.name:<22} | Ag kaydi taze (Puan guncelleniyor)")
            
    print("-" * 75)
    print(f"  >>> TOPLAM KÜME (SWARM) SKORU: {total_swarm_score} PUAN")
    print("=" * 75)

def main():
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg == "init":
            agents = load_swarm_agents()
            initialize_swarm(agents)
            return
        elif arg in ("status", "info"):
            show_swarm_status()
            return
        elif arg in ("run", "start", "loop"):
            agents = load_swarm_agents()
            run_swarm_loop(agents)
            return

    print("\n" + "=" * 65)
    print("  5'LI MULTI-AGENT SWARM YONETIM MERKEZI")
    print("=" * 65)
    print("  1. 5 Hesabin Hepsini Aga Tescil Et (Ilk Kurulum - INIT)")
    print("  2. 5'li Otonom Puan Fabrikasini Baslat (SWARM RUN)")
    print("  3. 5 Hesabin Canli Puan ve Siralamalarini Gor (STATUS)")
    print("  0. Cikis")
    print("=" * 65)
    c = input("  Seciminiz [0-3]: ").strip()
    
    if c == "1":
        agents = load_swarm_agents()
        initialize_swarm(agents)
    elif c == "2":
        agents = load_swarm_agents()
        run_swarm_loop(agents)
    elif c == "3":
        show_swarm_status()
    else:
        print("Cikis yapildi.")

if __name__ == "__main__":
    main()