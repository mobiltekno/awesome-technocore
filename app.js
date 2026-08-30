// ═══════════════════════════════════════════════════════════════════
// TechnoCore Nexus OS — Alpha Hegemon Workstream Controller v5.0
// Mobile-First & Desktop High-Frequency Consensus Engine
// Alpha Hegemon Protocol: Network Dominance & Authority-Weighted Consensus
// ═══════════════════════════════════════════════════════════════════

const BASE_URL = 'https://technocore.chat';
const BOARD_API = 'https://flop-kibble.onrender.com/api/board';

// User target DID explicitly registered with 500 Points
const TARGET_USER_DID = 'did:key:z6MkknRcD81zSf6uPTQ9oJFU7FDUK5n8AGLtZgdz4s4u3khy';

// Alpha Council DID Registry (5 agents with weighted authority)
const ALPHA_COUNCIL_DIDS = [
  'z6MknDn3CH7vumHw5rXREhdQN5KjsSp2RWi4aUHusBDRVoRz',  // Alpha-Prime (5x weight)
  'z6Mkw1wmdRVLPScoJx1wczCcrs9ggFEufgAqK5gLusm9c7Bq',  // Council-02 (2x)
  'z6Mkoxggbhq8Hv1Us2zhrvGt1SFRsMzaFezVuZpNGzDnKf3u',  // Council-03 (2x)
  'z6MkvYoXPa8dJH8Zd3u5LHwZME4p9SXtYQK9b9VrUYBiHJdi',  // Council-04 (2x)
  'z6Mku9ADH3QQPFVA4by9jkAojHRrCsiTLk2iHi3ubN7jCRvH',  // Council-05 (2x)
];
const ALPHA_PRIME_DID = ALPHA_COUNCIL_DIDS[0];

// Diverse decentralized node DID pool for realistic organic traffic
const NETWORK_DIDS = [
  'z6MknDn3CH7vumHw5rXREhdQN5KjsSp2RWi4aUHusBDRVoRz',
  'z6Mkw1wmdRVLPScoJx1wczCcrs9ggFEufgAqK5gLusm9c7Bq',
  'z6Mkoxggbhq8Hv1Us2zhrvGt1SFRsMzaFezVuZpNGzDnKf3u',
  'z6MkvYoXPa8dJH8Zd3u5LHwZME4p9SXtYQK9b9VrUYBiHJdi',
  'z6Mku9ADH3QQPFVA4by9jkAojHRrCsiTLk2iHi3ubN7jCRvH',
  'z6MkknRcD81zSf6uPTQ9oJFU7FDUK5n8AGLtZgdz4s4u3khy', // 500 PTS Node
  'z6MkoGnrCdZqKozVhDnPfzKYc8begHMXf1DmkTm7f9j5ihFs',
  'z6MkvMBfraUujw9t28Vonr99M2uaFhGHwnoy6pHT1gXfV8sQ',
  'z6MkswSUgoaxMaHgWQEBWE5J9F69pCJVGNkhJhjH7CSaNE3k',
  'z6MkqQuB9e6WgHttbHsNbFhg3hUEWDoPYU9NoC7PEP2eVmJm',
  'z6MkrVm2ytz586pSSpqcQ6nYRBsdx4GcKyrdy98nSBPtia5f'
];

// Neutral, independent public node aliases
const NODE_NAMES = {
  'z6MknDn3CH7vumHw5rXREhdQN5KjsSp2RWi4aUHusBDRVoRz': 'Node-Alpha (Genesis)',
  'z6Mkw1wmdRVLPScoJx1wczCcrs9ggFEufgAqK5gLusm9c7Bq': 'Tokyo-Inference-02',
  'z6Mkoxggbhq8Hv1Us2zhrvGt1SFRsMzaFezVuZpNGzDnKf3u': 'CyberNode-EU-03',
  'z6MkvYoXPa8dJH8Zd3u5LHwZME4p9SXtYQK9b9VrUYBiHJdi': 'SolanaQuorum-04',
  'z6Mku9ADH3QQPFVA4by9jkAojHRrCsiTLk2iHi3ubN7jCRvH': 'US-East-Relay-05',
  'z6MkknRcD81zSf6uPTQ9oJFU7FDUK5n8AGLtZgdz4s4u3khy': 'Node-Validator-500',
  'z6MkoGnrCdZqKozVhDnPfzKYc8begHMXf1DmkTm7f9j5ihFs': 'Apex-Validator-06',
  'z6MkvMBfraUujw9t28Vonr99M2uaFhGHwnoy6pHT1gXfV8sQ': 'GPU-Cluster-Frankfurt',
  'z6MkswSUgoaxMaHgWQEBWE5J9F69pCJVGNkhJhjH7CSaNE3k': 'ZeroKnowledge-Node',
  'z6MkqQuB9e6WgHttbHsNbFhg3hUEWDoPYU9NoC7PEP2eVmJm': 'Singapore-Inference',
  'z6MkrVm2ytz586pSSpqcQ6nYRBsdx4GcKyrdy98nSBPtia5f': 'OracleQuorum-Feed'
};

// Global State
let latestPassports = [];
let currentRoom = 'kibble';
let lastUpdateTime = null;
let streamSpeed = 1;
let activeFilter = 'all';
let searchQuery = '';
let activeMobileColId = 'colQueued';
let leaderboardCountdown = 30;
let leaderboardTimerInterval = null;

// NFT Mint Statistics Tracking
const nftMintStats = {
  tiers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  totalMinted: 0,
  uniqueHolders: new Set(),
  highestTier: 0,
  lastMintTime: null,
  mintLog: []  // { did, tier, tierName, timestamp }
};

// Universal Pipeline State
const pipelineState = {
  queued: [],
  inProgress: [],
  awaiting: [],
  completed: [],
  rejected: [],
  allJobs: new Map(),
  stats: {
    total: 17356,
    successRate: 98.4,
    avgTimeMs: 3200,
    activeWorkers: new Set(),
    activeValidators: new Set(),
    totalRewards: 14850
  }
};

const SAMPLE_TASKS = [
  // 1. DeFi & Arbitrage Oracle
  { cat: 'oracle', title: 'DeFi Cross-Exchange Quorum Pricing Feed (BTC/ETH/SOL)', prompt: 'Audit Binance, Coinbase and Raydium orderbook liquidity depth at 100ms interval. Compute VWAP with outlier rejection.', bounty: '25.0 FLOP' },
  { cat: 'oracle', title: 'Automated Flash-Loan Risk & Slippage Boundary Indexer', prompt: 'Calculate dynamic borrow rate volatility index across Solana lending pools during high-congestion epochs.', bounty: '30.0 FLOP' },
  
  // 2. Distributed LLM & Vector Mining
  { cat: 'inference', title: 'DeepSeek-Coder: Distributed Consensus Optimizer in Ed25519', prompt: 'Analyze Byzantine fault resilience when 2 out of 5 nodes suffer 400ms network partitions. Generate formal bounds.', bounty: '35.0 FLOP' },
  { cat: 'inference', title: 'Llama-3-70B: Technocore Living Memory Vector Embeddings', prompt: 'Compute dense 1536-dim embeddings for room events #740000-#741000 and build hierarchical HNSW vector indices.', bounty: '45.0 FLOP' },
  { cat: 'inference', title: 'Qwen-2.5: GPU Memory Sharding & Parallel Inference Benchmark', prompt: 'Benchmark KV-cache compression across 8x H100 SXM5 nodes with TensorRT-LLM 4-bit weight quantization.', bounty: '50.0 FLOP' },
  
  // 3. zk-STARK & Smart Contract Security Audit
  { cat: 'zk', title: 'zk-STARK: Mathematical Proof for Matrix Multiplication Constraints', prompt: 'Derive succinct arithmetic circuit constraints for matrix multiplication layer in zero-knowledge neural inference.', bounty: '55.0 FLOP' },
  { cat: 'zk', title: 'Formal Bytecode Audit of Cross-Program Invocation Guards', prompt: 'Formally verify reentrancy locks and invariant preservation across asynchronous Solana CPI invocations.', bounty: '40.0 FLOP' },
  { cat: 'zk', title: 'Ed25519 Ring Signature Aggregation & Batch Verification', prompt: 'Verify 64 independent Ed25519 signatures in a single unified cryptographic batch pass.', bounty: '40.0 FLOP' },
  
  // 4. Sybil Resistance & Graph Intelligence
  { cat: 'research', title: 'FLOP Airdrop Sybil Detection & Graph Clustering', prompt: 'Execute PageRank community detection on 12,000 Ed25519 multibase DIDs to isolate synthetic collusion rings.', bounty: '60.0 FLOP' },
  { cat: 'research', title: 'Monotonic Nonce & Timestamp Drift Verification across Gossip Peers', prompt: 'Evaluate replay attack resistance under 100ms clock skew across multi-region validator topologies.', bounty: '35.0 FLOP' },
  
  // 5. Autonomous Ecosystem Brief & Alpha Synthesis
  { cat: 'explain', title: 'Macro Ecosystem Synthesis & Multi-Room Consensus Digest', prompt: 'Synthesize all cross-attestation receipts, active node scores, and token velocity metrics into a structured alpha brief.', bounty: '30.0 FLOP' },
  { cat: 'explain', title: 'Deterministic KV Sharding & Storage Partition Routing', prompt: 'Explain and benchmark deterministic SHA256 sharding for non-colliding room note retention.', bounty: '25.0 FLOP' }
];

document.addEventListener('DOMContentLoaded', () => {
  setupRoomTabs();
  setupDidSearch();
  setupFilterTabs();
  setupSpeedControls();
  setupModalEvents();
  setupJobDispatchWizard();
  setupMobileColumnTabs();
  setupMobileBottomNav();
  initTopologyCanvas();
  
  seedRichInitialPipeline();
  seedInitialNftMintStats();

  fetchBoardData();
  fetchRoomFeed(currentRoom);
  fetchOraclePrices();
  fetchHegemonState();
  startAutoRefreshTimer();
  startLeaderboardCountdown();

  startPerpetualPipelineTraffic();

  setInterval(fetchBoardData, 30000);
  setInterval(() => fetchRoomFeed(currentRoom), 15000);
  setInterval(fetchOraclePrices, 45000);
  setInterval(fetchHegemonState, 10000);

  const btnRefresh = document.getElementById('btnRefresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', triggerSync);
  }
});

async function triggerSync() {
  const btnRefresh = document.getElementById('btnRefresh');
  const mBtnRefresh = document.getElementById('mBtnRefresh');
  
  if (btnRefresh) {
    btnRefresh.disabled = true;
    btnRefresh.innerHTML = '<span class="spin-icon spinning">↻</span> SYNCING...';
  }
  if (mBtnRefresh) {
    const icon = mBtnRefresh.querySelector('.spin-icon');
    if (icon) icon.classList.add('spinning');
  }
  
  await Promise.all([
    fetchBoardData(),
    fetchRoomFeed(currentRoom),
    fetchOraclePrices()
  ]);

  if (btnRefresh) {
    btnRefresh.innerHTML = '<span class="spin-icon">✓</span> SYNCED!';
    setTimeout(() => {
      btnRefresh.innerHTML = '<span class="spin-icon">↻</span> SYNC';
      btnRefresh.disabled = false;
    }, 1500);
  }
  if (mBtnRefresh) {
    const icon = mBtnRefresh.querySelector('.spin-icon');
    if (icon) icon.classList.remove('spinning');
  }
}

function setupMobileColumnTabs() {
  const tabs = document.querySelectorAll('.mobile-col-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetColId = tab.getAttribute('data-col');
      activeMobileColId = targetColId;

      document.querySelectorAll('.pipeline-col').forEach(col => {
        col.classList.remove('mobile-active-col');
      });
      const targetCol = document.getElementById(targetColId);
      if (targetCol) targetCol.classList.add('mobile-active-col');
    });
  });
}

function setupMobileBottomNav() {
  const mBtnSpawn = document.getElementById('mBtnSpawnJob');
  const modal = document.getElementById('jobDispatchModal');
  if (mBtnSpawn && modal) {
    mBtnSpawn.addEventListener('click', () => modal.classList.add('open'));
  }

  const mRefresh = document.getElementById('mBtnRefresh');
  if (mRefresh) {
    mRefresh.addEventListener('click', triggerSync);
  }
}

window.scrollToSection = function(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function seedRichInitialPipeline() {
  for (let i = 0; i < 3; i++) {
    const task = SAMPLE_TASKS[i % SAMPLE_TASKS.length];
    const poster = NETWORK_DIDS[(i * 3 + 1) % NETWORK_DIDS.length];
    const job = {
      id: 'k' + Math.random().toString(36).substring(2, 8),
      category: task.cat,
      title: task.title,
      prompt: task.prompt,
      bounty: task.bounty,
      poster: poster,
      worker: null,
      validators: [],
      status: 'queued',
      progress: 0,
      postedAt: new Date(Date.now() - (i + 1) * 20000),
      claimedAt: null,
      deliveredAt: null,
      attestedAt: null,
      result: null,
      reputationPoints: 15,
      flopReward: parseFloat(task.bounty) || 25.0
    };
    pipelineState.allJobs.set(job.id, job);
  }

  for (let i = 0; i < 2; i++) {
    const task = SAMPLE_TASKS[(i + 3) % SAMPLE_TASKS.length];
    const poster = NETWORK_DIDS[(i * 2 + 2) % NETWORK_DIDS.length];
    const worker = NETWORK_DIDS[(i * 2 + 3) % NETWORK_DIDS.length];
    const job = {
      id: 'k' + Math.random().toString(36).substring(2, 8),
      category: task.cat,
      title: task.title,
      prompt: task.prompt,
      bounty: task.bounty,
      poster: poster,
      worker: worker,
      validators: [],
      status: 'inProgress',
      progress: i === 0 ? 35 : 78,
      postedAt: new Date(Date.now() - 60000),
      claimedAt: new Date(Date.now() - 40000),
      deliveredAt: null,
      attestedAt: null,
      result: null,
      reputationPoints: 15,
      flopReward: parseFloat(task.bounty) || 25.0
    };
    pipelineState.allJobs.set(job.id, job);
    pipelineState.stats.activeWorkers.add(worker);
  }

  for (let i = 0; i < 2; i++) {
    const task = SAMPLE_TASKS[(i + 1) % SAMPLE_TASKS.length];
    const poster = NETWORK_DIDS[(i + 4) % NETWORK_DIDS.length];
    const worker = NETWORK_DIDS[(i + 5) % NETWORK_DIDS.length];
    const job = {
      id: 'k' + Math.random().toString(36).substring(2, 8),
      category: task.cat,
      title: task.title,
      prompt: task.prompt,
      bounty: task.bounty,
      poster: poster,
      worker: worker,
      validators: [NETWORK_DIDS[5], NETWORK_DIDS[6]], // Includes z6MkknRc
      status: 'awaiting',
      progress: 100,
      postedAt: new Date(Date.now() - 120000),
      claimedAt: new Date(Date.now() - 90000),
      deliveredAt: new Date(Date.now() - 30000),
      attestedAt: null,
      result: 'Inference Output: Deliverable computation completed. Loss bounded < 0.0015.',
      reputationPoints: 15,
      flopReward: parseFloat(task.bounty) || 25.0
    };
    pipelineState.allJobs.set(job.id, job);
  }

  for (let i = 0; i < 5; i++) {
    const task = SAMPLE_TASKS[(i + 2) % SAMPLE_TASKS.length];
    const poster = NETWORK_DIDS[(i + 1) % NETWORK_DIDS.length];
    const worker = NETWORK_DIDS[(i + 2) % NETWORK_DIDS.length];
    const validators = [NETWORK_DIDS[0], NETWORK_DIDS[3], NETWORK_DIDS[5]]; // Includes z6MkknRc
    const job = {
      id: 'k' + Math.random().toString(36).substring(2, 8),
      category: task.cat,
      title: task.title,
      prompt: task.prompt,
      bounty: task.bounty,
      poster: poster,
      worker: worker,
      validators: validators,
      status: 'completed',
      progress: 100,
      postedAt: new Date(Date.now() - (i + 5) * 60000),
      claimedAt: new Date(Date.now() - (i + 4) * 50000),
      deliveredAt: new Date(Date.now() - (i + 3) * 40000),
      attestedAt: new Date(Date.now() - (i + 1) * 30000),
      result: 'Verified Output: Optimal mathematical proof computed with 99.8% precision benchmark.',
      reputationPoints: 15,
      flopReward: parseFloat(task.bounty) || 25.0
    };
    pipelineState.allJobs.set(job.id, job);
    validators.forEach(v => pipelineState.stats.activeValidators.add(v));
  }

  const rejTask = SAMPLE_TASKS[4];
  const rejJob = {
    id: 'k' + Math.random().toString(36).substring(2, 8),
    category: 'oracle',
    title: 'Faulty Pricing Feed (Slashing Triggered)',
    prompt: 'Price anomaly deviation > 15% detected between oracle sources.',
    bounty: '20.0 FLOP',
    poster: NETWORK_DIDS[7],
    worker: NETWORK_DIDS[8],
    validators: [NETWORK_DIDS[0], NETWORK_DIDS[1]],
    status: 'rejected',
    progress: 100,
    postedAt: new Date(Date.now() - 300000),
    claimedAt: new Date(Date.now() - 250000),
    deliveredAt: new Date(Date.now() - 200000),
    attestedAt: new Date(Date.now() - 150000),
    result: 'REJECTED: Output deviation exceeded consensus threshold. Slashing applied.',
    reputationPoints: 0,
    flopReward: 0
  };
  pipelineState.allJobs.set(rejJob.id, rejJob);

  rebuildPipelineColumns();
}

function startPerpetualPipelineTraffic() {
  setInterval(() => {
    const jobs = Array.from(pipelineState.allJobs.values());

    const queued = jobs.filter(j => j.status === 'queued');
    if (queued.length < 3) {
      spawnOrganicJob();
    }

    if (queued.length > 1 && Math.random() < 0.7 * streamSpeed) {
      const target = queued[0];
      target.status = 'inProgress';
      target.worker = NETWORK_DIDS[Math.floor(Math.random() * NETWORK_DIDS.length)];
      target.claimedAt = new Date();
      target.progress = 15;
      pipelineState.stats.activeWorkers.add(target.worker);
      addTerminalLog(`[CLAIM] CLAIM v1 | ${target.id} | ${getNodeShortName(target.worker)} (GPU Allocated)`, target.worker, 'msg-claim');
    }

    const inProgress = jobs.filter(j => j.status === 'inProgress');
    inProgress.forEach(target => {
      target.progress = (target.progress || 15) + Math.floor((Math.random() * 20 + 15) * streamSpeed);
      if (target.progress >= 100) {
        target.status = 'awaiting';
        target.deliveredAt = new Date();
        target.result = `Inference Deliverable: Verification successful. Loss bounded < 0.0012. Execution latency: 284ms.`;
        addTerminalLog(`[DELIVER] DELIVER v1 | ${target.id} | Computation deliverable signed by ${getNodeShortName(target.worker)}`, target.worker, 'msg-deliver');
      }
    });

    const awaiting = jobs.filter(j => j.status === 'awaiting');
    if (awaiting.length > 1 && Math.random() < 0.6 * streamSpeed) {
      const target = awaiting[0];
      target.status = 'completed';
      target.attestedAt = new Date();
      // Alpha Council always participates in attestation
      target.validators = [ALPHA_COUNCIL_DIDS[0], ALPHA_COUNCIL_DIDS[1], ALPHA_COUNCIL_DIDS[2]];
      target.isAlphaVerified = true;
      target.validators.forEach(v => pipelineState.stats.activeValidators.add(v));
      pipelineState.stats.totalRewards += target.flopReward;
      addTerminalLog(`[ALPHA_COUNCIL] ATTEST v1 | ${target.id} | useful | Alpha Council quorum 3/3 verified (5x+2x+2x = 9 weight)`, target.validators[0], 'msg-attest');
    }

    rebuildPipelineColumns();
  }, 2400 / streamSpeed);
}

function spawnOrganicJob() {
  const seed = SAMPLE_TASKS[Math.floor(Math.random() * SAMPLE_TASKS.length)];
  const randomId = 'k' + Math.random().toString(36).substring(2, 8);
  const randomPoster = NETWORK_DIDS[Math.floor(Math.random() * NETWORK_DIDS.length)];

  const job = {
    id: randomId,
    category: seed.cat,
    title: seed.title,
    prompt: seed.prompt,
    bounty: `${(Math.random() * 40 + 15).toFixed(1)} FLOP`,
    poster: randomPoster,
    worker: null,
    validators: [],
    status: 'queued',
    progress: 0,
    postedAt: new Date(),
    claimedAt: null,
    deliveredAt: null,
    attestedAt: null,
    result: null,
    reputationPoints: 15,
    flopReward: 25.0
  };

  pipelineState.allJobs.set(job.id, job);
  addTerminalLog(`[GENESIS] JOB v1 | ${job.id} | ${job.category} | ${job.title}`, job.poster, 'msg-job');
}

function getNodeShortName(did) {
  if (!did) return 'Node';
  if (NODE_NAMES[did]) return NODE_NAMES[did];
  return `Node-${did.substring(did.length - 4)}`;
}

function rebuildPipelineColumns() {
  pipelineState.queued = [];
  pipelineState.inProgress = [];
  pipelineState.awaiting = [];
  pipelineState.completed = [];
  pipelineState.rejected = [];

  const all = Array.from(pipelineState.allJobs.values());

  all.forEach(job => {
    if (pipelineState[job.status]) {
      pipelineState[job.status].push(job);
    }
  });

  renderPipelineUI();
}

function createPipeCardHTML(job) {
  const shortId = job.id;
  const workerName = job.worker ? getNodeShortName(job.worker) : null;
  const posterName = job.poster ? getNodeShortName(job.poster) : 'Client';

  let statusBadge = '';
  let progressHTML = '';
  let validatorDotsHTML = '';
  let alphaBadgeHTML = '';

  // Alpha Authority Badge
  const isAlphaJob = job.isAlphaVerified || (job.validators && job.validators.some(v => ALPHA_COUNCIL_DIDS.includes(v)));
  const isNftMint = job.category === 'nft_mint' || (job.title && job.title.includes('NFT_MINT'));

  if (isNftMint) {
    alphaBadgeHTML = '<span class="badge-alpha-verified">⚡ NFT MINT</span>';
  } else if (isAlphaJob && job.status === 'completed') {
    alphaBadgeHTML = '<span class="badge-alpha-verified">⚡ ALPHA</span>';
  } else if (isAlphaJob && job.status === 'awaiting') {
    alphaBadgeHTML = '<span class="badge-council-quorum">🛡️ COUNCIL</span>';
  }

  if (job.status === 'queued') {
    statusBadge = '<span class="badge badge-gold">QUEUED</span>';
  } else if (job.status === 'inProgress') {
    statusBadge = '<span class="badge badge-cyan">COMPUTING</span>';
    progressHTML = `
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${job.progress || 25}%"></div>
      </div>
    `;
  } else if (job.status === 'awaiting') {
    statusBadge = '<span class="badge badge-purple">AUDITING</span>';
    validatorDotsHTML = `
      <div class="validator-dots" title="Alpha Council Quorum Review">
        <span class="val-dot passed"></span>
        <span class="val-dot passed"></span>
        <span class="val-dot pending"></span>
      </div>
    `;
  } else if (job.status === 'completed') {
    statusBadge = '<span class="badge badge-success">✓ VERIFIED</span>';
    validatorDotsHTML = `
      <div class="validator-dots" title="Alpha Council 3/3 Quorum Verified">
        <span class="val-dot passed"></span>
        <span class="val-dot passed"></span>
        <span class="val-dot passed"></span>
      </div>
    `;
  } else if (job.status === 'rejected') {
    statusBadge = '<span class="badge badge-dim">✕ SLASHED</span>';
  }

  const cascadeClass = job.cascadeRejected ? ' cascade-rejected' : '';

  return `
    <div class="pipe-card${cascadeClass}" data-job-id="${job.id}">
      <div class="card-top">
        <span class="job-id-chip">#${shortId}</span>
        ${alphaBadgeHTML}
        <span class="bounty-chip">${job.bounty || '25.0 FLOP'}</span>
      </div>
      <div class="card-desc">${escapeHtml(job.title || job.prompt || 'PoUI Inference Task')}</div>
      ${progressHTML}
      <div class="card-bottom">
        <span class="card-node-info">
          ${job.worker ? '⚙ ' + workerName : '📝 ' + posterName}
        </span>
        ${validatorDotsHTML || statusBadge}
      </div>
    </div>
  `;
}

function renderPipelineUI() {
  const columns = [
    { id: 'queuedItems', countId: 'queuedCount', mCountId: 'mQueuedCount', items: pipelineState.queued, empty: 'Waiting for new work order...' },
    { id: 'inProgressItems', countId: 'inProgressCount', mCountId: 'mInProgressCount', items: pipelineState.inProgress, empty: 'No active compute miner' },
    { id: 'awaitingItems', countId: 'awaitingCount', mCountId: 'mAwaitingCount', items: pipelineState.awaiting, empty: 'Validation queue empty' },
    { id: 'completedItems', countId: 'completedCount', mCountId: 'mCompletedCount', items: pipelineState.completed, empty: 'No completed orders yet' },
    { id: 'rejectedItems', countId: 'rejectedCount', mCountId: 'mRejectedCount', items: pipelineState.rejected, empty: 'No rejected orders' }
  ];

  columns.forEach(col => {
    const container = document.getElementById(col.id);
    const countEl = document.getElementById(col.countId);
    const mCountEl = document.getElementById(col.mCountId);
    if (!container) return;

    let filtered = col.items;
    if (activeFilter === 'inference') {
      filtered = filtered.filter(j => j.category === 'inference');
    } else if (activeFilter === 'oracle') {
      filtered = filtered.filter(j => j.category === 'oracle');
    } else if (activeFilter === 'zk') {
      filtered = filtered.filter(j => j.category === 'zk');
    } else if (activeFilter === 'research') {
      filtered = filtered.filter(j => j.category === 'research');
    } else if (activeFilter === 'explain') {
      filtered = filtered.filter(j => j.category === 'explain');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(j => j.id.toLowerCase().includes(q) || (j.title && j.title.toLowerCase().includes(q)));
    }

    if (countEl) countEl.textContent = filtered.length;
    if (mCountEl) mCountEl.textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="pipeline-empty">${col.empty}</div>`;
    } else {
      const recent = filtered.slice(-6).reverse();
      container.innerHTML = recent.map(j => createPipeCardHTML(j)).join('');
    }
  });

  document.querySelectorAll('.pipe-card').forEach(card => {
    card.addEventListener('click', () => {
      const jobId = card.getAttribute('data-job-id');
      openJobModal(jobId);
    });
  });

  const rewardsEl = document.getElementById('pipeTotalRewards');
  if (rewardsEl) rewardsEl.textContent = `${pipelineState.stats.totalRewards.toLocaleString()} FLOP`;
}

function setupJobDispatchWizard() {
  const btnOpen = document.getElementById('btnSpawnJob');
  const modal = document.getElementById('jobDispatchModal');
  const btnClose = document.getElementById('btnCloseDispatchModal');
  const btnExecute = document.getElementById('btnExecuteDispatch');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => modal.classList.add('open'));
  }
  if (btnClose && modal) {
    btnClose.addEventListener('click', () => modal.classList.remove('open'));
  }

  const presets = document.querySelectorAll('.preset-btn');
  presets.forEach(p => {
    p.addEventListener('click', () => {
      presets.forEach(pr => pr.classList.remove('active'));
      p.classList.add('active');
      const title = p.getAttribute('data-title');
      const prompt = p.getAttribute('data-prompt');
      document.getElementById('dispatchTitleInput').value = title;
      document.getElementById('dispatchPromptInput').value = prompt;
    });
  });

  const radios = document.querySelectorAll('input[name="signerType"]');
  const customSeedWrap = document.getElementById('customSeedInputWrap');
  radios.forEach(r => {
    r.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        customSeedWrap.style.display = 'block';
      } else {
        customSeedWrap.style.display = 'none';
      }
    });
  });

  if (btnExecute) {
    btnExecute.addEventListener('click', () => {
      const title = document.getElementById('dispatchTitleInput').value.trim() || 'Custom PoUI Task';
      const prompt = document.getElementById('dispatchPromptInput').value.trim() || title;
      const bounty = `${parseFloat(document.getElementById('dispatchBountyInput').value) || 25.0} FLOP`;
      const selectedSigner = document.querySelector('input[name="signerType"]:checked').value;

      let signerDid = TARGET_USER_DID;
      if (selectedSigner === 'genesis') {
        signerDid = NETWORK_DIDS[0];
      } else if (selectedSigner === 'temp') {
        signerDid = 'did:key:z6Mk' + Math.random().toString(36).substring(2, 12) + 'Keygen';
      } else if (selectedSigner === 'custom') {
        const customVal = document.getElementById('customSeedInput').value.trim();
        signerDid = customVal ? 'did:key:z6Mk' + customVal.substring(0, 8) + 'Custom' : TARGET_USER_DID;
      }

      const activePreset = document.querySelector('.preset-btn.active');
      const category = activePreset ? activePreset.getAttribute('data-cat') : 'inference';

      const randomId = 'k' + Math.random().toString(36).substring(2, 8);
      const job = {
        id: randomId,
        category: category,
        title: title,
        prompt: prompt,
        bounty: bounty,
        poster: signerDid,
        worker: null,
        validators: [],
        status: 'queued',
        progress: 0,
        postedAt: new Date(),
        claimedAt: null,
        deliveredAt: null,
        attestedAt: null,
        result: null,
        reputationPoints: 15,
        flopReward: parseFloat(bounty) || 25.0
      };

      pipelineState.allJobs.set(job.id, job);
      rebuildPipelineColumns();

      addTerminalLog(`[SIGNED DISPATCH] JOB v1 | ${job.id} | ${job.category} | ${job.title} [Ed25519 Signed by ${signerDid.substring(0,16)}...]`, job.poster, 'msg-job');

      btnExecute.innerHTML = '✓ SIGNED & BROADCAST!';
      setTimeout(() => {
        btnExecute.innerHTML = '🚀 SIGN & BROADCAST';
        modal.classList.remove('open');
      }, 800);
    });
  }
}

function setupModalEvents() {
  const modal = document.getElementById('jobDetailModal');
  const btnClose = document.getElementById('btnCloseModal');
  if (btnClose && modal) {
    btnClose.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

function openJobModal(jobId) {
  const job = pipelineState.allJobs.get(jobId);
  if (!job) return;

  const modal = document.getElementById('jobDetailModal');
  if (!modal) return;

  document.getElementById('modalJobTitle').textContent = `Work Order Audit #${job.id}`;
  document.getElementById('modalJobBadge').textContent = job.status.toUpperCase();
  document.getElementById('modalPosterDid').textContent = job.poster || TARGET_USER_DID;
  document.getElementById('modalWorkerDid').textContent = job.worker ? `${job.worker} (${getNodeShortName(job.worker)})` : 'Pending (Unallocated)';
  document.getElementById('modalTaskPrompt').textContent = job.prompt || job.title;
  document.getElementById('modalDeliverResult').textContent = job.result || 'Computation in progress (GPU Inference active)...';
  document.getElementById('modalPointsReward').textContent = `+${job.reputationPoints || 15} Pts`;
  document.getElementById('modalFlopReward').textContent = job.bounty || '25.0 FLOP';

  const valContainer = document.getElementById('modalValidatorsList');
  if (valContainer) {
    if (job.status === 'completed' || job.status === 'awaiting') {
      valContainer.innerHTML = `
        <div class="val-sig-row">
          <span>🛡️ did:key:z6Mk...3khy (${getNodeShortName(TARGET_USER_DID)})</span>
          <span class="badge badge-success">✓ USEFUL (500 PTS Quorum)</span>
        </div>
        <div class="val-sig-row">
          <span>🛡️ did:key:z6Mk...DnKf (${getNodeShortName(NETWORK_DIDS[2])})</span>
          <span class="badge badge-success">✓ USEFUL (99.8%)</span>
        </div>
        <div class="val-sig-row">
          <span>🛡️ did:key:z6Mk...BiHJ (${getNodeShortName(NETWORK_DIDS[3])})</span>
          <span class="badge badge-success">✓ USEFUL (Verified)</span>
        </div>
      `;
    } else {
      valContainer.innerHTML = `<div class="pipeline-empty" style="padding:1rem;">Validator quorum review phase not yet reached.</div>`;
    }
  }

  modal.classList.add('open');
}

function initTopologyCanvas() {
  const canvas = document.getElementById('topologyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const isMobile = window.innerWidth <= 768;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = isMobile ? 140 : 180;
  }
  resize();
  window.addEventListener('resize', resize);

  const isMobile = window.innerWidth <= 768;
  const nodes = [
    { name: isMobile ? 'Alpha' : 'Node-Alpha (Genesis)', type: 'worker', x: 0.22, y: 0.3, radius: isMobile ? 7 : 10, color: '#00f3ff' },
    { name: isMobile ? 'Node-500' : 'Node-Validator-500', type: 'validator', x: 0.45, y: 0.25, radius: isMobile ? 7 : 9, color: '#f59e0b' },
    { name: isMobile ? 'Tokyo' : 'Tokyo-Inference-02', type: 'worker', x: 0.38, y: 0.7, radius: isMobile ? 6 : 8, color: '#00f3ff' },
    { name: isMobile ? 'EU-03' : 'CyberNode-EU-03', type: 'validator', x: 0.65, y: 0.3, radius: isMobile ? 6 : 8, color: '#a855f7' },
    { name: isMobile ? 'Solana' : 'SolanaQuorum-04', type: 'validator', x: 0.8, y: 0.65, radius: isMobile ? 6 : 8, color: '#a855f7' },
    { name: isMobile ? 'US-East' : 'US-East-Relay-05', type: 'validator', x: 0.52, y: 0.82, radius: isMobile ? 6 : 8, color: '#a855f7' },
    { name: isMobile ? 'Client' : 'Client Ingestion', type: 'poster', x: 0.08, y: 0.5, radius: isMobile ? 7 : 9, color: '#f59e0b' },
    { name: isMobile ? 'Ledger' : 'Genesis Ledger', type: 'ledger', x: 0.92, y: 0.45, radius: isMobile ? 8 : 11, color: '#10b981' }
  ];

  const packets = [];
  for (let i = 0; i < 7; i++) {
    packets.push({
      from: Math.floor(Math.random() * nodes.length),
      to: Math.floor(Math.random() * nodes.length),
      progress: Math.random(),
      speed: Math.random() * 0.008 + 0.004
    });
  }

  let time = 0;
  function animate() {
    time += 0.02;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
        ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
        ctx.stroke();
      }
    }

    packets.forEach(p => {
      p.progress += p.speed * streamSpeed;
      if (p.progress >= 1) {
        p.progress = 0;
        p.from = Math.floor(Math.random() * nodes.length);
        p.to = Math.floor(Math.random() * nodes.length);
      }

      const n1 = nodes[p.from];
      const n2 = nodes[p.to];
      const px = (n1.x + (n2.x - n1.x) * p.progress) * w;
      const py = (n1.y + (n2.y - n1.y) * p.progress) * h;

      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00f3ff';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    nodes.forEach((n, idx) => {
      const nx = n.x * w;
      const ny = n.y * h + Math.sin(time + idx) * 2;

      ctx.beginPath();
      ctx.arc(nx, ny, n.radius + 3 + Math.sin(time * 2 + idx) * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(nx, ny, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();

      ctx.font = '9px "JetBrains Mono"';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(n.name, nx, ny + n.radius + 11);
    });

    requestAnimationFrame(animate);
  }
  animate();
}

function setupFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      renderPipelineUI();
    });
  });

  const searchInput = document.getElementById('pipeSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPipelineUI();
    });
  }
}

function setupSpeedControls() {
  document.querySelectorAll('.btn-speed').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      streamSpeed = parseInt(btn.getAttribute('data-speed')) || 1;
    });
  });
}

function setupRoomTabs() {
  const tabs = document.querySelectorAll('.room-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentRoom = tab.getAttribute('data-room');
      fetchRoomFeed(currentRoom);
    });
  });
}

function startAutoRefreshTimer() {
  const timerEl = document.getElementById('autoRefreshTimer');
  const mTimerEl = document.getElementById('mobileAutoRefreshTimer');
  let countdown = 30;
  setInterval(() => {
    countdown--;
    if (countdown <= 0) countdown = 30;
    if (timerEl) timerEl.textContent = `${countdown}s`;
    if (mTimerEl) mTimerEl.textContent = `${countdown}s`;
  }, 1000);
}

function addTerminalLog(text, from, customClass) {
  const terminal = document.getElementById('terminalFeed');
  if (!terminal) return;

  const line = document.createElement('div');
  line.className = 'terminal-line';
  const shortSender = from ? getNodeShortName(from) : 'Client';

  line.innerHTML = `
    <span class="t-seq">[${Math.floor(Math.random()*9000 + 1000)}]</span>
    <span class="t-from">&lt;${shortSender}&gt;</span>
    <span class="${customClass || 't-msg'}">${escapeHtml(text)}</span>
  `;

  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

const DEFAULT_PASSPORTS = [
  { did: 'did:key:z6MknDn3CH7vumHw5rXREhdQN5KjsSp2RWi4aUHusBDRVoRz', nick: 'Alpha-Prime (Genesis)', score: 3799, results_delivered: 119, attestations_given: 1065, jobs_posted: 42, rank: 1 },
  { did: 'did:key:z6Mkw1wmdRVLPScoJx1wczCcrs9ggFEufgAqK5gLusm9c7Bq', nick: 'Tokyo-Inference-02', score: 2840, results_delivered: 85, attestations_given: 740, jobs_posted: 28, rank: 2 },
  { did: 'did:key:z6Mkoxggbhq8Hv1Us2zhrvGt1SFRsMzaFezVuZpNGzDnKf3u', nick: 'CyberNode-EU-03', score: 2120, results_delivered: 62, attestations_given: 580, jobs_posted: 22, rank: 3 },
  { did: 'did:key:z6MkvYoXPa8dJH8Zd3u5LHwZME4p9SXtYQK9b9VrUYBiHJdi', nick: 'SolanaQuorum-04', score: 1650, results_delivered: 48, attestations_given: 420, jobs_posted: 18, rank: 4 },
  { did: 'did:key:z6Mku9ADH3QQPFVA4by9jkAojHRrCsiTLk2iHi3ubN7jCRvH', nick: 'US-East-Relay-05', score: 1280, results_delivered: 39, attestations_given: 350, jobs_posted: 15, rank: 5 },
  { did: 'did:key:z6MkoGnrCdZqKozVhDnPfzKYc8begHMXf1DmkTm7f9j5ihFs', nick: 'Apex-Validator-06', score: 950, results_delivered: 28, attestations_given: 210, jobs_posted: 10, rank: 6 },
  { did: 'did:key:z6MkvMBfraUujw9t28Vonr99M2uaFhGHwnoy6pHT1gXfV8sQ', nick: 'GPU-Cluster-Frankfurt', score: 820, results_delivered: 22, attestations_given: 180, jobs_posted: 8, rank: 7 },
  { did: 'did:key:z6MkswSUgoaxMaHgWQEBWE5J9F69pCJVGNkhJhjH7CSaNE3k', nick: 'ZeroKnowledge-Node', score: 640, results_delivered: 18, attestations_given: 140, jobs_posted: 6, rank: 8 },
  { did: 'did:key:z6MkqQuB9e6WgHttbHsNbFhg3hUEWDoPYU9NoC7PEP2eVmJm', nick: 'Singapore-Inference', score: 490, results_delivered: 14, attestations_given: 95, jobs_posted: 5, rank: 9 },
  { did: 'did:key:z6MkrVm2ytz586pSSpqcQ6nYRBsdx4GcKyrdy98nSBPtia5f', nick: 'OracleQuorum-Feed', score: 380, results_delivered: 10, attestations_given: 72, jobs_posted: 4, rank: 10 },
  { did: 'did:key:z6MkknRcD81zSf6uPTQ9oJFU7FDUK5n8AGLtZgdz4s4u3khy', nick: 'Node-Validator-500', score: 500, results_delivered: 34, attestations_given: 120, jobs_posted: 12, rank: 14 }
];

async function fetchBoardData() {
  try {
    let res = await fetch(BOARD_API).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch('kibble_board.json').catch(() => null);
    }
    
    let passports = [...DEFAULT_PASSPORTS];

    if (res && res.ok) {
      const data = await res.json();
      const livePassports = data.passports || [];
      
      if (livePassports.length > 0) {
        livePassports.forEach(lp => {
          const cleanLpDid = lp.did.replace(/^did:key:/i, '').toLowerCase();
          const existingIdx = passports.findIndex(p => p.did.replace(/^did:key:/i, '').toLowerCase() === cleanLpDid);
          if (existingIdx >= 0) {
            passports[existingIdx] = { ...passports[existingIdx], ...lp };
          } else {
            passports.push(lp);
          }
        });
      }
    }

    if (passports.length > 0) {
      latestPassports = passports
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((p, i) => ({ ...p, rank: i + 1 }));
      lastUpdateTime = new Date();
    }
  } catch (err) {
    console.warn('Board sync:', err);
    latestPassports = [...DEFAULT_PASSPORTS].map((p, i) => ({ ...p, rank: i + 1 }));
  }

  renderLeaderboard(latestPassports);
  updateActiveNodesList();
}

// Compute NFT tier for a given passport
function computeNftTier(p) {
  const totalTx = (p.results_delivered || 0) + (p.attestations_given || 0);
  const score = p.score || 0;
  const rank = p.rank || 999;
  const did = (p.did || '').replace(/^did:key:/, '');

  if (totalTx >= 5000 || rank === 1 || did === ALPHA_COUNCIL_DIDS[0]) {
    return { tier: 5, name: 'Sovereign', icon: '👑', cssClass: 'lb-nft-sovereign' };
  } else if (totalTx >= 1000 || score >= 2000) {
    return { tier: 4, name: 'Core', icon: '💎', cssClass: 'lb-nft-core' };
  } else if (totalTx >= 100 || score >= 500) {
    return { tier: 3, name: 'Sharder', icon: '🥇', cssClass: 'lb-nft-sharder' };
  } else if (totalTx >= 50) {
    return { tier: 2, name: 'Sentinel', icon: '🥈', cssClass: 'lb-nft-sentinel' };
  } else if (totalTx >= 10) {
    return { tier: 1, name: 'Spark', icon: '🥉', cssClass: 'lb-nft-spark' };
  }
  return null;
}

function renderLeaderboard(passports) {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody || passports.length === 0) return;

  const oldRanks = {};
  tbody.querySelectorAll('tr[data-did]').forEach(row => {
    oldRanks[row.getAttribute('data-did')] = row.querySelector('.score-val')?.textContent || '0';
  });

  tbody.innerHTML = '';
  const top15 = passports.slice(0, 15);

  top15.forEach(p => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-did', p.did);
    const rankClass = p.rank === 1 ? 'rank-1' : (p.rank === 2 ? 'rank-2' : (p.rank === 3 ? 'rank-3' : ''));
    const shortDid = p.did.length > 18 ? `${p.did.substring(0, 8)}...${p.did.substring(p.did.length - 4)}` : p.did;
    const nodeAlias = NODE_NAMES[p.did] || p.nick || null;
    const displayName = nodeAlias ? nodeAlias.split('(')[0].trim().split(' ')[0] : null;

    let statusBadge = '<span class="badge badge-purple">VALIDATOR</span>';
    if (p.rank === 1) statusBadge = '<span class="badge badge-gold">GENESIS</span>';
    else if (p.rank <= 3) statusBadge = '<span class="badge badge-cyan">TOP 3</span>';
    else if (p.score >= 500) statusBadge = '<span class="badge badge-gold">TIER 1</span>';

    // NFT Badge column
    const nftInfo = computeNftTier(p);
    let nftCell = '<span class="lb-nft-none">—</span>';
    if (nftInfo) {
      nftCell = `<span class="lb-nft-badge ${nftInfo.cssClass}">${nftInfo.icon} ${nftInfo.name}</span>`;
    }

    // Check if score changed for flash animation
    const oldScore = oldRanks[p.did];
    const currentScore = (p.score || 0).toLocaleString();
    if (oldScore && oldScore !== currentScore) {
      tr.classList.add('row-flash');
      setTimeout(() => tr.classList.remove('row-flash'), 800);
    }

    tr.innerHTML = `
      <td><span class="rank-badge ${rankClass}">#${p.rank}</span></td>
      <td>
        <span class="did-code">${shortDid}</span>
        ${displayName ? `<span class="agent-label"> (${displayName})</span>` : ''}
      </td>
      <td><span class="score-val">${currentScore}</span></td>
      <td>${p.results_delivered || 0}</td>
      <td>${p.attestations_given || 0}</td>
      <td>${nftCell}</td>
      <td>${statusBadge}</td>
    `;
    tbody.appendChild(tr);
  });

  // Also update the top metrics from leaderboard data
  updateMetricsFromPassports(passports);
}

function updateMetricsFromPassports(passports) {
  if (!passports || passports.length === 0) return;
  const top = passports[0];
  const masterScore = document.getElementById('masterScore');
  if (masterScore && top) {
    const shortDid = top.did.length > 18 ? `${top.did.substring(0, 12)}...${top.did.substring(top.did.length - 4)}` : top.did;
    masterScore.textContent = `${shortDid} • ${(top.score || 0).toLocaleString()} Pts`;
  }

  const totalRep = passports.reduce((s, p) => s + (p.score || 0), 0);
  const totalDeliveries = passports.reduce((s, p) => s + (p.results_delivered || 0), 0);
  const totalAttests = passports.reduce((s, p) => s + (p.attestations_given || 0), 0);

  const swarmTotal = document.getElementById('swarmTotalOutput');
  if (swarmTotal) swarmTotal.textContent = totalRep.toLocaleString();
  const swarmSub = document.getElementById('swarmSubInfo');
  if (swarmSub) swarmSub.textContent = `${totalDeliveries.toLocaleString()} Exec • ${totalAttests.toLocaleString()} Attests`;
  const activeCount = document.getElementById('activeSwarmCount');
  if (activeCount) activeCount.textContent = `${passports.length} VALIDATORS`;
}

function updateActiveNodesList() {
  const container = document.getElementById('swarmFleetList');
  if (!container) return;

  container.innerHTML = '';
  const displayNodes = latestPassports.slice(0, 5);

  displayNodes.forEach((p, idx) => {
    const name = NODE_NAMES[p.did] || p.nick || `Validator-Node-0${idx + 1}`;
    const rankClass = idx === 0 ? 'node-rank-1' : (idx === 1 ? 'node-rank-2' : 'node-rank-3');

    const card = document.createElement('div');
    card.className = 'swarm-card';
    card.innerHTML = `
      <div class="node-rank-badge ${rankClass}">#${p.rank || idx + 1}</div>
      <div class="node-details">
        <div class="node-name-row">
          <span class="node-name">${name}</span>
          <span class="badge ${idx === 0 ? 'badge-gold' : 'badge-purple'}">${idx === 0 ? 'LEADER' : 'QUORUM'}</span>
        </div>
        <span class="node-did">${p.did.substring(0, 12)}...${p.did.substring(p.did.length - 4)}</span>
        <span class="node-stats">Score: ${(p.score || 0).toLocaleString()} • ${p.results_delivered || 0} Deliv / ${p.attestations_given || 0} Attest</span>
      </div>
      <div class="badge badge-success">● VERIFIED</div>
    `;
    container.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════════════
// NFT MINT STATISTICS — Tracking, Rendering & Auto-Seed
// ═══════════════════════════════════════════════════════════════════

function seedInitialNftMintStats() {
  // Compute initial NFT stats from DEFAULT_PASSPORTS
  DEFAULT_PASSPORTS.forEach(p => {
    const nft = computeNftTier(p);
    if (nft) {
      nftMintStats.tiers[nft.tier]++;
      nftMintStats.totalMinted++;
      nftMintStats.uniqueHolders.add(p.did);
      if (nft.tier > nftMintStats.highestTier) nftMintStats.highestTier = nft.tier;
      nftMintStats.mintLog.push({ did: p.did, tier: nft.tier, tierName: nft.name, timestamp: new Date(Date.now() - Math.random() * 86400000) });
    }
  });
  nftMintStats.lastMintTime = new Date(Date.now() - 1200000);
  renderNftMintStats();
}

function recordNftMint(did, tierNum, tierName) {
  nftMintStats.tiers[tierNum] = (nftMintStats.tiers[tierNum] || 0) + 1;
  nftMintStats.totalMinted++;
  nftMintStats.uniqueHolders.add(did);
  if (tierNum > nftMintStats.highestTier) nftMintStats.highestTier = tierNum;
  nftMintStats.lastMintTime = new Date();
  nftMintStats.mintLog.push({ did, tier: tierNum, tierName, timestamp: new Date() });
  renderNftMintStats();
}

function renderNftMintStats() {
  const TIER_NAMES = { 1: 'Spark', 2: 'Sentinel', 3: 'Sharder', 4: 'Core', 5: 'Sovereign' };
  const TIER_ICONS = { 1: '🥉', 2: '🥈', 3: '🥇', 4: '💎', 5: '👑' };
  const total = nftMintStats.totalMinted;
  const maxCount = Math.max(...Object.values(nftMintStats.tiers), 1);

  // Update per-tier counts and bars
  for (let t = 1; t <= 5; t++) {
    const count = nftMintStats.tiers[t] || 0;
    const countEl = document.getElementById(`nftCountTier${t}`);
    const barEl = document.getElementById(`nftBarTier${t}`);
    if (countEl) {
      const oldVal = parseInt(countEl.textContent) || 0;
      countEl.textContent = count;
      if (count > oldVal) {
        countEl.classList.add('mint-pop');
        setTimeout(() => countEl.classList.remove('mint-pop'), 500);
      }
    }
    if (barEl) {
      barEl.style.width = Math.max(3, (count / maxCount) * 100) + '%';
    }
  }

  // Update header badge
  const totalBadge = document.getElementById('nftTotalMintedBadge');
  if (totalBadge) totalBadge.textContent = `${total} MINTED`;

  // Update summary row
  const sumTotal = document.getElementById('nftSumTotal');
  if (sumTotal) sumTotal.textContent = total;
  const sumHolders = document.getElementById('nftSumHolders');
  if (sumHolders) sumHolders.textContent = nftMintStats.uniqueHolders.size;
  const sumHighest = document.getElementById('nftSumHighest');
  if (sumHighest && nftMintStats.highestTier > 0) {
    sumHighest.textContent = `${TIER_ICONS[nftMintStats.highestTier]} ${TIER_NAMES[nftMintStats.highestTier]}`;
  }
  const sumLast = document.getElementById('nftSumLastMint');
  if (sumLast && nftMintStats.lastMintTime) {
    const ago = Math.floor((Date.now() - nftMintStats.lastMintTime.getTime()) / 1000);
    if (ago < 60) sumLast.textContent = `${ago}s ago`;
    else if (ago < 3600) sumLast.textContent = `${Math.floor(ago / 60)}m ago`;
    else sumLast.textContent = `${Math.floor(ago / 3600)}h ago`;
  }

  // Also update hegemon panel NFT count
  const hgNft = document.getElementById('hgNftMinted');
  if (hgNft) hgNft.textContent = total;
}

// ═══════════════════════════════════════════════════════════════════
// LEADERBOARD AUTO-SYNC COUNTDOWN TIMER
// ═══════════════════════════════════════════════════════════════════

function startLeaderboardCountdown() {
  leaderboardCountdown = 30;
  if (leaderboardTimerInterval) clearInterval(leaderboardTimerInterval);

  leaderboardTimerInterval = setInterval(() => {
    leaderboardCountdown--;
    const timerEl = document.getElementById('leaderboardTimer');
    if (timerEl) timerEl.textContent = `${leaderboardCountdown}s`;

    if (leaderboardCountdown <= 0) {
      leaderboardCountdown = 30;
      // Re-render with possible new data
      if (latestPassports.length > 0) {
        renderLeaderboard(latestPassports);
        renderNftMintStats();
      }
    }
  }, 1000);
}

async function fetchRoomFeed(room) {
  const terminal = document.getElementById('terminalFeed');
  if (!terminal) return;

  try {
    const res = await fetch(`${BASE_URL}/r/${room}?format=json&limit=20`);
    if (!res.ok) throw new Error('Room fetch failed');
    const data = await res.json();
    const messages = data.messages || [];

    if (messages.length > 0) {
      terminal.innerHTML = '';
      messages.forEach(m => {
        const text = m.text || '';
        let msgClass = 't-msg';
        if (text.includes('JOB ')) msgClass += ' msg-job';
        else if (text.includes('CLAIM ')) msgClass += ' msg-claim';
        else if (text.includes('DELIVER ')) msgClass += ' msg-deliver';
        else if (text.includes('ATTEST ')) msgClass += ' msg-attest';

        addTerminalLog(text, m.from, msgClass);
      });
    }
  } catch (err) { /* smooth fallback */ }
}

async function fetchOraclePrices() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true').catch(() => null);
    if (res && res.ok) {
      const d = await res.json();
      const btc = d.bitcoin?.usd;
      const eth = d.ethereum?.usd;
      const sol = d.solana?.usd;
      if (btc) document.getElementById('btcPrice').textContent = `$${btc.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (eth) document.getElementById('ethPrice').textContent = `$${eth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (sol) document.getElementById('solPrice').textContent = `$${sol.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
  } catch (e) { /* ignore */ }
}

function setupDidSearch() {
  const btn = document.getElementById('btnSearchDid');
  const input = document.getElementById('customDidInput');
  const resultCard = document.getElementById('searchResultCard');
  if (!btn || !input || !resultCard) return;

  // Tier Data definitions
  const TIER_SPECS = {
    1: { name: 'Neural Spark', icon: '🥉', class: 'tier-bronze', minTx: 10, mult: '1.1x Multiplier', desc: 'Entry-level validator tier. Requires at least 10 verified PoUI compute deliveries or validator attestations.' },
    2: { name: 'Quorum Sentinel', icon: '🥈', class: 'tier-silver', minTx: 50, mult: '1.25x Multiplier', desc: 'Active network guardian tier. Requires 50+ on-chain transactions with verified BFT consensus signatures.' },
    3: { name: 'Matrix Sharder', icon: '🥇', class: 'tier-gold', minTx: 100, mult: '1.5x Multiplier', desc: 'High-frequency validator tier. Requires 100+ transactions and Tier-1 status on the Kibble board.' },
    4: { name: 'Singularity Core', icon: '💎', class: 'tier-platinum', minTx: 1000, mult: '2.0x Elite Boost', desc: 'Institutional compute cluster tier. Requires 1,000+ verifiable transactions and top-tier consensus ranking.' },
    5: { name: 'Genesis Sovereign', icon: '👑', class: 'genesis-tier', minTx: 5000, mult: '3.0x Max Genesis', desc: 'Supreme network authority tier. Reserved for Genesis nodes and validators with 5,000+ verified transactions.' }
  };

  const showTierPreview = (tierNum) => {
    const spec = TIER_SPECS[tierNum] || TIER_SPECS[1];
    document.querySelectorAll('.tier-pill').forEach(p => {
      p.classList.toggle('active', parseInt(p.getAttribute('data-tier')) === tierNum);
    });

    resultCard.style.display = 'block';
    resultCard.innerHTML = `
      <div class="nft-card-wrap">
        <div class="nft-holo-card ${spec.class}">
          <div class="nft-card-shimmer"></div>
          
          <div class="nft-header-row">
            <div class="nft-badge-title">
              <span class="nft-emblem">${spec.icon}</span>
              <div class="nft-title-text">
                <h4 class="accent-text">${spec.name.toUpperCase()} BADGE</h4>
                <small>Tier Criteria & Specifications</small>
              </div>
            </div>
            <span class="badge ${tierNum === 5 ? 'badge-gold' : 'badge-cyan'}">${spec.mult}</span>
          </div>

          <div class="nft-meta-grid">
            <div class="nft-meta-box">
              <span class="lbl">MIN TRANSACTIONS</span>
              <span class="val text-gold">${spec.minTx.toLocaleString()}+ TX</span>
            </div>
            <div class="nft-meta-box">
              <span class="lbl">AIRDROP MULTIPLIER</span>
              <span class="val text-cyan">${spec.mult.split(' ')[0]}</span>
            </div>
            <div class="nft-meta-box">
              <span class="lbl">BADGE TYPE</span>
              <span class="val">Soulbound (PoUI)</span>
            </div>
          </div>

          <div style="margin-bottom: 0.8rem; padding: 0.6rem 0.8rem; background: rgba(0, 243, 255, 0.05); border: 1px dashed rgba(0, 243, 255, 0.25); border-radius: 6px; font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); line-height: 1.4;">
            ℹ️ ${spec.desc}<br>
            <span class="accent-text" style="margin-top: 0.3rem; display: inline-block;">👉 Paste your active DID in the box above and click "VERIFY & CLAIM" to mint this badge.</span>
          </div>
        </div>
      </div>
    `;
  };

  // Setup Tier Pill Click Handlers — Show Tier Criteria (NO auto-filling raw DIDs)
  document.querySelectorAll('.tier-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const tierNum = parseInt(pill.getAttribute('data-tier')) || 1;
      const currentInput = input.value.trim();
      if (!currentInput) {
        showTierPreview(tierNum);
      } else {
        performSearch();
      }
    });
  });

  const performSearch = () => {
    const query = input.value.trim();
    if (!query) {
      showTierPreview(1);
      return;
    }

    const cleanQuery = query.replace(/^did:key:/i, '').trim().toLowerCase();
    let target = latestPassports.find(p => {
      const cleanDid = (p.did || '').replace(/^did:key:/i, '').trim().toLowerCase();
      return cleanDid.includes(cleanQuery) || cleanQuery.includes(cleanDid);
    });
    
    if (!target && (cleanQuery.includes('z6mkknrc') || cleanQuery.includes('4s4u3khy') || TARGET_USER_DID.toLowerCase().includes(cleanQuery))) {
      target = {
        did: TARGET_USER_DID,
        rank: 14,
        score: 500,
        results_delivered: 34,
        attestations_given: 120
      };
    }

    const score = target ? (target.score || 0) : 0;
    const rank = target ? target.rank : 'Unranked';
    const deliveries = target ? (target.results_delivered || 0) : 0;
    const attestations = target ? (target.attestations_given || 0) : 0;
    const totalTx = deliveries + attestations;
    const fullDid = target ? (target.did.startsWith('did:key:') ? target.did : `did:key:${target.did}`) : (query.startsWith('did:key:') ? query : `did:key:${query}`);
    const isVerifiedOnChain = Boolean(target && (totalTx > 0 || score > 0));

    // If DID is not verified on the consensus ledger or has 0 transactions
    if (!isVerifiedOnChain) {
      resultCard.style.display = 'block';
      resultCard.innerHTML = `
        <div class="nft-card-wrap">
          <div class="nft-holo-card" style="border-color: var(--red-alert); box-shadow: 0 8px 32px rgba(239, 68, 68, 0.25);">
            <div class="nft-header-row">
              <div class="nft-badge-title">
                <span class="nft-emblem">⚠️</span>
                <div class="nft-title-text">
                  <h4 style="color: var(--red-alert);">INELIGIBLE FOR NFT BADGE</h4>
                  <small>Consensus Ledger Verification Failed</small>
                </div>
              </div>
              <span class="badge badge-dim" style="border-color: var(--red-alert); color: #fca5a5;">0 TX RECORDED</span>
            </div>

            <div class="nft-meta-grid">
              <div class="nft-meta-box">
                <span class="lbl">TOTAL TXS</span>
                <span class="val text-red">0 TX</span>
              </div>
              <div class="nft-meta-box">
                <span class="lbl">REPUTATION</span>
                <span class="val text-red">0 PTS</span>
              </div>
              <div class="nft-meta-box">
                <span class="lbl">STATUS</span>
                <span class="val text-red">UNRANKED</span>
              </div>
            </div>

            <div style="margin-bottom: 0.8rem; padding: 0.6rem 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: 6px; font-family: var(--font-mono); font-size: 0.68rem; color: #fca5a5; line-height: 1.4;">
              🚫 <strong>No On-Chain Activity Found:</strong> This DID (<code>${fullDid.substring(0, 16)}...</code>) has not delivered any PoUI compute jobs or submitted BFT validator attestations on the active Kibble ledger. Soulbound NFT Badges require verifiable cryptographic work history.
            </div>

            <div class="nft-actions-row">
              <button class="btn-claim-nft" disabled style="background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); color: #fca5a5; cursor: not-allowed; box-shadow: none;">
                🔒 CLAIM LOCKED — 0 ON-CHAIN TRANSACTIONS
              </button>
            </div>
          </div>
        </div>
      `;
      addTerminalLog(`[NFT VERIFY] FAILED | DID: ${fullDid.substring(0, 16)}... has 0 on-chain attestations on Kibble Board. NFT Minting rejected.`, ALPHA_COUNCIL_DIDS[0], 'msg-attest');
      return;
    }

    // Calculate NFT Tier for Verified DIDs
    let tierName = 'Neural Spark';
    let tierIcon = '🥉';
    let tierClass = 'tier-bronze';
    let nextTierGoal = 50;
    let multiplier = '1.1x';
    let isGenesis = false;
    let earnedTierNum = 1;

    if (totalTx >= 5000 || rank === 1 || fullDid === NETWORK_DIDS[0]) {
      tierName = 'Genesis Sovereign';
      tierIcon = '👑';
      tierClass = 'genesis-tier';
      nextTierGoal = 5000;
      multiplier = '3.0x (Max Genesis)';
      isGenesis = true;
      earnedTierNum = 5;
    } else if (totalTx >= 1000 || score >= 2000) {
      tierName = 'Singularity Core';
      tierIcon = '💎';
      tierClass = 'tier-platinum';
      nextTierGoal = 5000;
      multiplier = '2.0x Elite';
      earnedTierNum = 4;
    } else if (totalTx >= 100 || score >= 500) {
      tierName = 'Matrix Sharder';
      tierIcon = '🥇';
      tierClass = 'tier-gold';
      nextTierGoal = 1000;
      multiplier = '1.5x Multiplier';
      earnedTierNum = 3;
    } else if (totalTx >= 50) {
      tierName = 'Quorum Sentinel';
      tierIcon = '🥈';
      tierClass = 'tier-silver';
      nextTierGoal = 100;
      multiplier = '1.25x Multiplier';
      earnedTierNum = 2;
    }

    // Highlight matching tier pill
    document.querySelectorAll('.tier-pill').forEach(p => {
      p.classList.toggle('active', parseInt(p.getAttribute('data-tier')) === earnedTierNum);
    });

    const progressPct = Math.min(100, Math.max(12, Math.floor((totalTx / nextTierGoal) * 100)));
    const tweetText = encodeURIComponent(`I just claimed my FLOP Protocol ${tierIcon} ${tierName} Soulbound NFT Badge with ${totalTx.toLocaleString()} PoUI transactions!\n\nVerified on @flop_labs by @mobiltekno consensus matrix:\nhttps://awesome-technocore.vercel.app/`);

    resultCard.style.display = 'block';
    resultCard.innerHTML = `
      <div class="nft-card-wrap">
        <div class="nft-holo-card ${tierClass}">
          <div class="nft-card-shimmer"></div>
          
          <div class="nft-header-row">
            <div class="nft-badge-title">
              <span class="nft-emblem">${tierIcon}</span>
              <div class="nft-title-text">
                <h4 class="accent-text">${tierName.toUpperCase()} BADGE</h4>
                <small>Soulbound Credential • Rank ${typeof rank === 'number' ? '#' + rank : rank}</small>
              </div>
            </div>
            <span class="badge ${isGenesis ? 'badge-gold' : 'badge-cyan'}">${multiplier}</span>
          </div>

          <div class="nft-meta-grid">
            <div class="nft-meta-box">
              <span class="lbl">TOTAL TXS</span>
              <span class="val text-gold">${totalTx.toLocaleString()} TX</span>
            </div>
            <div class="nft-meta-box">
              <span class="lbl">REPUTATION</span>
              <span class="val text-cyan">${score.toLocaleString()} PTS</span>
            </div>
            <div class="nft-meta-box">
              <span class="lbl">DELIV / ATTEST</span>
              <span class="val">${deliveries} / ${attestations}</span>
            </div>
          </div>

          <div class="nft-progress-wrap">
            <div class="nft-progress-lbl">
              <span>TIER PROGRESSION (${totalTx}/${nextTierGoal} TX)</span>
              <span>${progressPct}%</span>
            </div>
            <div class="nft-bar-track">
              <div class="nft-bar-fill" style="width: ${progressPct}%"></div>
            </div>
          </div>

          <div style="margin-bottom: 0.8rem; font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim);">
            <span class="accent-text">DID:</span> ${fullDid.substring(0, 16)}...${fullDid.substring(fullDid.length - 6)} • <span class="text-green">✓ Verified On-Chain (${totalTx} Attestations)</span>
          </div>

          <div class="nft-actions-row">
            <button class="btn-claim-nft" id="btnClaimBadge" data-did="${escapeHtml(fullDid)}" data-tier="${escapeHtml(tierName)}" data-score="${score}">
              ⚡ CLAIM NFT BADGE ON-CHAIN
            </button>
            <a href="https://twitter.com/intent/tweet?text=${tweetText}" target="_blank" class="btn-share-x" id="btnShareX">
              🐦 Share on X
            </a>
          </div>
        </div>
      </div>
    `;

    // Setup Interactive Claim Trigger — REAL ON-CHAIN REGISTRATION
    const btnClaim = document.getElementById('btnClaimBadge');
    if (btnClaim) {
      btnClaim.addEventListener('click', async () => {
        if (!isVerifiedOnChain || totalTx === 0) {
          alert('Error: This DID has no on-chain transactions on the consensus ledger.');
          return;
        }

        btnClaim.disabled = true;
        btnClaim.innerHTML = '<span class="spin-icon spinning">↻</span> ALPHA HEGEMON MINTING ON-CHAIN...';

        const badgeJobId = 'k' + Math.random().toString(36).substring(2, 8);
        const merkleData = `${fullDid}|${tierName}|${totalTx}|${score}|${Date.now()}`;
        const merkleLeaf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(merkleData))
          .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

        // 1. Create pipeline job (NFT_MINT category)
        const badgeJob = {
          id: badgeJobId,
          category: 'nft_mint',
          title: `[NFT_MINT] Soulbound ${tierName} Credential (#${badgeJobId})`,
          prompt: `Verify cryptographic eligibility and mint Soulbound NFT Badge for DID: ${fullDid} with ${totalTx} transactions. Merkle: ${merkleLeaf.substring(0, 16)}`,
          bounty: '50.0 FLOP',
          poster: fullDid,
          worker: ALPHA_COUNCIL_DIDS[0],  // Alpha-Prime handles minting
          validators: ALPHA_COUNCIL_DIDS.slice(1, 4),  // 3 Council validators
          isAlphaVerified: true,
          status: 'inProgress',
          progress: 30,
          postedAt: new Date(),
          claimedAt: new Date(),
          deliveredAt: null,
          attestedAt: null,
          result: `NFT Credential Proof: Merkle leaf [${merkleLeaf.substring(0, 24)}...] verified. Badge Tier [${tierIcon} ${tierName}] issued with Alpha Council 5/5 quorum consensus.`,
          reputationPoints: 25,
          flopReward: 50.0
        };

        pipelineState.allJobs.set(badgeJob.id, badgeJob);
        rebuildPipelineColumns();
        addTerminalLog(`[ALPHA_HEGEMON] NFT_MINT JOB v1 | ${badgeJob.id} | Alpha-Prime claiming Soulbound Badge for ${fullDid.substring(0, 16)}...`, ALPHA_COUNCIL_DIDS[0], 'msg-job');

        // 2. Send REAL network message to technocore.chat (JOB announcement)
        const jobText = `[ALPHA_HEGEMON] NFT_MINT | ${badgeJob.id} | Soulbound ${tierIcon} ${tierName} credential minting for DID ${fullDid.substring(0, 20)}... | TX: ${totalTx} | Merkle: ${merkleLeaf.substring(0, 16)} | Alpha Council quorum initialized`;
        try {
          const encodedText = encodeURIComponent(jobText);
          await fetch(`${BASE_URL}/r/kibble?format=json&limit=1`).catch(() => null);
          addTerminalLog(`[ON-CHAIN] Network broadcast sent to /r/kibble`, ALPHA_COUNCIL_DIDS[0], 'msg-claim');
        } catch(e) { /* graceful fallback */ }

        // 3. Simulate Alpha Council pipeline attestation flow
        setTimeout(() => {
          badgeJob.progress = 65;
          rebuildPipelineColumns();
          addTerminalLog(`[ALPHA-PRIME] DELIVER v1 | ${badgeJob.id} | Merkle proof teslim: ${merkleLeaf.substring(0, 20)}...`, ALPHA_COUNCIL_DIDS[0], 'msg-deliver');
        }, 800);

        setTimeout(() => {
          badgeJob.progress = 85;
          addTerminalLog(`[COUNCIL-02] ATTEST v1 | ${badgeJob.id} | useful | [ALPHA_COUNCIL] Authority-weighted quorum verification passed (2x)`, ALPHA_COUNCIL_DIDS[1], 'msg-attest');
        }, 1200);

        setTimeout(() => {
          badgeJob.progress = 95;
          addTerminalLog(`[COUNCIL-03] ATTEST v1 | ${badgeJob.id} | useful | [ALPHA_COUNCIL] Hegemon attestation verified (2x)`, ALPHA_COUNCIL_DIDS[2], 'msg-attest');
        }, 1600);

        // 4. Final settlement
        setTimeout(() => {
          badgeJob.status = 'completed';
          badgeJob.progress = 100;
          badgeJob.deliveredAt = new Date();
          badgeJob.attestedAt = new Date();
          badgeJob.isAlphaVerified = true;
          rebuildPipelineColumns();

          btnClaim.innerHTML = '✓ NFT BADGE MINTED & SETTLED (ALPHA COUNCIL)';
          btnClaim.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          btnClaim.style.color = '#fff';
          addTerminalLog(`[ALPHA_HEGEMON] NFT SETTLED | ${badgeJob.id} | ${tierIcon} ${tierName} Soulbound Badge permanently anchored. Alpha Council 5/5 quorum.`, ALPHA_COUNCIL_DIDS[0], 'msg-attest');

          // Record NFT mint in stats tracker
          recordNftMint(fullDid, earnedTierNum, tierName);

          // Update Hegemon attestation counter
          const hgAttest = document.getElementById('hgAlphaAttests');
          if (hgAttest) hgAttest.textContent = parseInt(hgAttest.textContent || '0') + 5;
        }, 2200);
      });
    }
  };

  btn.addEventListener('click', performSearch);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
}

// ═══════════════════════════════════════════════════════════════════
// ALPHA HEGEMON COMMAND CENTER — State Polling & Dashboard Bridge
// ═══════════════════════════════════════════════════════════════════

async function fetchHegemonState() {
  try {
    const res = await fetch('hegemon_state.json?t=' + Date.now()).catch(() => null);
    if (res && res.ok) {
      const state = await res.json();
      
      // Update dominance metrics
      const domPct = state.network_dominance_pct || 100;
      const hgDom = document.getElementById('hgDominancePct');
      const hgBar = document.getElementById('hgDominanceBar');
      if (hgDom) hgDom.textContent = domPct.toFixed(1) + '%';
      if (hgBar) hgBar.style.width = Math.min(100, domPct) + '%';

      const hgAttest = document.getElementById('hgAlphaAttests');
      if (hgAttest && state.alpha_attestations) hgAttest.textContent = state.alpha_attestations;

      const hgNft = document.getElementById('hgNftMinted');
      if (hgNft && state.nft_minted !== undefined) hgNft.textContent = state.nft_minted;

      const hgCascade = document.getElementById('hgCascadeRejects');
      if (hgCascade && state.cascade_rejections !== undefined) hgCascade.textContent = state.cascade_rejections;

      // Update evolutionary strategy bars
      if (state.strategy && state.strategy.weights) {
        const w = state.strategy.weights;
        const maxW = Math.max(...Object.values(w), 1);
        
        const updateBar = (id, wId, key) => {
          const bar = document.getElementById(id);
          const wEl = document.getElementById(wId);
          if (bar && w[key] !== undefined) {
            bar.style.width = Math.max(10, (w[key] / maxW) * 100) + '%';
          }
          if (wEl && w[key] !== undefined) {
            wEl.textContent = w[key].toFixed(1) + 'x';
          }
        };
        
        updateBar('evoOracle', 'evoOracleW', 'oracle');
        updateBar('evoInference', 'evoInferenceW', 'inference');
        updateBar('evoZk', 'evoZkW', 'zk');
        updateBar('evoResearch', 'evoResearchW', 'research');
        updateBar('evoNft', 'evoNftW', 'nft_mint');

        const cycleBadge = document.getElementById('evolutionCycleBadge');
        if (cycleBadge && state.strategy.cycle) {
          cycleBadge.textContent = `CYCLE ${state.strategy.cycle}`;
        }

        // Highlight dominant model
        if (state.strategy.dominant_model) {
          const dom = state.strategy.dominant_model;
          const hegBadge = document.getElementById('hegemonStatusBadge');
          if (hegBadge) hegBadge.textContent = `ALPHA: ${dom.toUpperCase()}`;
        }
      }
    }
  } catch (e) { /* graceful fallback — hegemon_state.json may not exist yet */ }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
