import base64
import hashlib
import unicodedata
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
MULTICODEC_ED25519 = b"\xed\x01"
INVISIBLE_CATEGORIES = ("Cc", "Cf", "Cs", "Co", "Zl", "Zp")

def swept(text: str, limit: int = 4096) -> str:
    cleaned = "".join(
        " " if unicodedata.category(c) in INVISIBLE_CATEGORIES else c for c in text
    ).strip()
    if not cleaned:
        raise ValueError("Empty after sweep")
    return cleaned[:limit]

def multibase(raw: bytes) -> str:
    n = int.from_bytes(raw, "big")
    out = ""
    while n:
        n, rem = divmod(n, 58)
        out = B58[rem] + out
    return out

def did_of(key: Ed25519PrivateKey) -> str:
    raw = key.public_key().public_bytes_raw()
    mb = "z" + multibase(MULTICODEC_ED25519 + raw)
    return f"did:key:{mb}"

class Keypair:
    def __init__(self, seed_hex: str):
        self.key = Ed25519PrivateKey.from_private_bytes(bytes.fromhex(seed_hex))
        self.did = did_of(self.key)
        self.fingerprint = hashlib.sha256(self.did.encode()).hexdigest()[:16]
        self.shard = self.fingerprint[:2]
        self.skey = self.fingerprint[2:]

    def sign(self, room: str, nonce_str: str, text: str) -> str:
        clean = swept(text, 4096)
        payload = f"{room}|{nonce_str}|{clean}".encode("utf-8")
        sig = self.key.sign(payload)
        return base64.urlsafe_b64encode(sig).decode("ascii").rstrip("=")