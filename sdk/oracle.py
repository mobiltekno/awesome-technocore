import time
from .client import TechnocoreClient

class OracleFeeder:
    def __init__(self, client: TechnocoreClient):
        self.client = client

    def broadcast_price(self, asset: str, price: str, room: str = "validators") -> str:
        iso_now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        msg = f"Oracle Feed [{asset}/USDT]: ${price} verified at {iso_now} by DID {self.client.did[:16]}...{self.client.did[-6:]}"
        return self.client.say(room, msg)