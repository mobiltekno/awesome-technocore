"""Test Llama-3 AI responses"""
import time
from swarm_engine import solve_external_job

tests = [
    {"title": "Explain quantum entanglement", "body": "What is quantum entanglement and how does it work?", "category": "explain"},
    {"title": "Compare Bitcoin vs Ethereum consensus", "body": "Detailed comparison of PoW vs PoS", "category": "research"},
    {"title": "Build a simple HTML page", "body": "Create a landing page with hero section", "category": "build"},
]

for i, job in enumerate(tests, 1):
    t0 = time.time()
    result = solve_external_job(job)
    elapsed = time.time() - t0
    is_ai = "[AI-RESEARCH]" in result
    print(f"\n=== TEST {i} ({job['category']}) [{elapsed:.1f}s] ===")
    print(f"Llama-3 kullanildi: {is_ai}")
    print(f"Cevap: {result[:300]}")
    print()
