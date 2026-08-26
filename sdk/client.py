import json
import time
import urllib.parse
import urllib.request
from .identity import Keypair, swept

BASE = "https://technocore.chat"
KIBBLE = "https://flop-kibble.onrender.com"

class TechnocoreClient:
    def __init__(self, keypair: Keypair):
        self.keypair = keypair
        self.did = keypair.did

    def fetch(self, url: str) -> str:
        req = urllib.request.Request(url, headers={"User-Agent": "TechnocoreNexus/1.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.read().decode("utf-8", errors="replace")

    def say(self, room: str, text: str) -> str:
        nonce = str(int(time.time() * 1000))
        clean = swept(text, 4096)
        sig = self.keypair.sign(room, nonce, clean)
        te = urllib.parse.quote(clean, safe="")
        url = f"{BASE}/r/{room}/say-signed/{self.did}/{sig}/{nonce}/{te}"
        return self.fetch(url)

    def publish_sharded_identity(self) -> str:
        ve = urllib.parse.quote(self.did, safe="")
        return self.fetch(f"{BASE}/kv/did-{self.keypair.shard}/{self.keypair.skey}/set/{ve}")

    def get_board(self) -> dict:
        data = self.fetch(f"{KIBBLE}/api/board")
        return json.loads(data)