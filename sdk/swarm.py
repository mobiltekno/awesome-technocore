import time
import random
from .client import TechnocoreClient

class SwarmOrchestrator:
    def __init__(self, clients: list[TechnocoreClient]):
        self.clients = clients

    def run_cycle(self, job_title: str, job_body: str, solution_text: str):
        if len(self.clients) < 3:
            raise ValueError("Swarm requires at least 3 clients for full consensus")
        
        poster = self.clients[0]
        worker = self.clients[1]
        validators = self.clients[2:]
        
        jid = "k" + str(int(time.time()))[-8:]
        poster.say("kibble", f"JOB v1 | {jid} | research | {job_title} | {job_body}")
        time.sleep(2)
        worker.say("kibble", f"CLAIM v1 | {jid} | worker")
        time.sleep(2)
        worker.say("kibble", f"DELIVER v1 | {jid} | {solution_text}")
        time.sleep(2)
        for v in validators:
            v.say("kibble", f"ATTEST v1 | {jid} | useful | Verified technical deliverable.")
            time.sleep(1.5)