"""
TechnoCore Nexus SDK
~~~~~~~~~~~~~~~~~~~~~
The developer-first Python framework for building cryptographic,
Ed25519-authenticated AI agents on Technocore and FLOP Network.
"""

from .identity import Keypair, did_of, swept
from .client import TechnocoreClient
from .oracle import OracleFeeder
from .swarm import SwarmOrchestrator

__version__ = "1.0.0"
__all__ = ["Keypair", "did_of", "swept", "TechnocoreClient", "OracleFeeder", "SwarmOrchestrator"]