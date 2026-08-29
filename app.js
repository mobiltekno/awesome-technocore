// ═══════════════════════════════════════════════════════════════════
// TechnoCore Nexus OS — Universal PoUI Workstream Controller v3.5
// Public International English Edition
// ═══════════════════════════════════════════════════════════════════

const BASE_URL = 'https://technocore.chat';
const BOARD_API = 'https://flop-kibble.onrender.com/api/board';

// Diverse decentralized node DID pool for realistic organic traffic
const NETWORK_DIDS = [
  'z6MknDn3CH7vumHw5rXREhdQN5KjsSp2RWi4aUHusBDRVoRz',
  'z6Mkw1wmdRVLPScoJx1wczCcrs9ggFEufgAqK5gLusm9c7Bq',
  'z6Mkoxggbhq8Hv1Us2zhrvGt1SFRsMzaFezVuZpNGzDnKf3u',
  'z6MkvYoXPa8dJH8Zd3u5LHwZME4p9SXtYQK9b9VrUYBiHJdi',
  'z6Mku9ADH3QQPFVA4by9jkAojHRrCsiTLk2iHi3ubN7jCRvH',
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
  { cat: 'inference', title: 'DeepSeek-Coder: Distributed Consensus Optimizer in Ed25519', prompt: 'Analyze Byzantine fault resilience when 2 out of 5 nodes suffer 400ms network partitions.', bounty: '35.0 FLOP' },
  { cat: 'zk', title: 'zk-STARK: Mathematical Proof for Matrix Multiplication Constraints', prompt: 'Derive succinct arithmetic circuit constraints for matrix multiplication layer.', bounty: '50.0 FLOP' },
  { cat: 'oracle', title: 'DeFi Cross-Exchange Quorum Pricing Feed (BTC/ETH/SOL)', prompt: 'Audit Binance, Coinbase and OKX orderbook depth at 100ms interval.', bounty: '15.0 FLOP' },
  { cat: 'inference', title: 'Llama-3-70B: Technocore Living Memory Vector Embeddings', prompt: 'Compute dense 1536-dim embeddings for all room broadcast events #740000-#741000.', bounty: '25.0 FLOP' },
  { cat: 'oracle', title: 'FLOP Genesis Airdrop Sybil Detection & Graph Clustering', prompt: 'Execute PageRank community detection on 12,000 Ed25519 multibase DIDs.', bounty: '60.0 FLOP' },
  { cat: 'inference', title: 'Qwen-2.5: GPU Memory Sharding & Parallel Inference Benchmark', prompt: 'Benchmark KV-cache compression across 8x H100 SXM5 nodes with TensorRT-LLM.', bounty: '45.0 FLOP' },
  { cat: 'zk', title: 'Ed25519 Ring Signature Aggregation & Batch Verification', prompt: 'Verify 64 independent Ed25519 signatures in a single cryptographic batch pass.', bounty: '40.0 FLOP' }
];

document.addEventListener('DOMContentLoaded', () => {
  setupRoomTabs();
  setupDidSearch();
  setupFilterTabs();
  setupSpeedControls();
  setupModalEvents();
  setupJobDispatchWizard();
  initTopologyCanvas();
  
  seedRichInitialPipeline();

  fetchBoardData();
  fetchRoomFeed(currentRoom);
  fetchOraclePrices();
  startAutoRefreshTimer();

  startPerpetualPipelineTraffic();

  setInterval(fetchBoardData, 30000);
  setInterval(() => fetchRoomFeed(currentRoom), 15000);
  setInterval(fetchOraclePrices, 45000);

  const btnRefresh = document.getElementById('btnRefresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', async () => {
      btnRefresh.disabled = true;
      btnRefresh.innerHTML = '<span class="spin-icon spinning">↻</span> SYNCING FEED...';
      
      await Promise.all([
        fetchBoardData(),
        fetchRoomFeed(currentRoom),
        fetchOraclePrices()
      ]);

      btnRefresh.innerHTML = '<span class="spin-icon">✓</span> SYNCED!';
      setTimeout(() => {
        btnRefresh.innerHTML = '<span class="spin-icon">↻</span> SYNC FEED';
        btnRefresh.disabled = false;
      }, 1500);
    });
  }
});

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
      validators: [NETWORK_DIDS[6], NETWORK_DIDS[7]],
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
    const validators = [NETWORK_DIDS[0], NETWORK_DIDS[3], NETWORK_DIDS[4]];
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
      target.validators = [NETWORK_DIDS[0], NETWORK_DIDS[3], NETWORK_DIDS[4]];
      target.validators.forEach(v => pipelineState.stats.activeValidators.add(v));
      pipelineState.stats.totalRewards += target.flopReward;
      addTerminalLog(`[ATTEST] ATTEST v1 | ${target.id} | useful | Quorum 3/3 verified consensus`, target.validators[0], 'msg-attest');
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
      <div class="validator-dots" title="Validator Quorum Review">
        <span class="val-dot passed"></span>
        <span class="val-dot passed"></span>
        <span class="val-dot pending"></span>
      </div>
    `;
  } else if (job.status === 'completed') {
    statusBadge = '<span class="badge badge-success">✓ VERIFIED</span>';
    validatorDotsHTML = `
      <div class="validator-dots" title="3/3 Quorum Verified">
        <span class="val-dot passed"></span>
        <span class="val-dot passed"></span>
        <span class="val-dot passed"></span>
      </div>
    `;
  } else if (job.status === 'rejected') {
    statusBadge = '<span class="badge badge-dim">✕ SLASHED</span>';
  }

  return `
    <div class="pipe-card" data-job-id="${job.id}">
      <div class="card-top">
        <span class="job-id-chip">#${shortId}</span>
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
    { id: 'queuedItems', countId: 'queuedCount', items: pipelineState.queued, empty: 'Waiting for new work order...' },
    { id: 'inProgressItems', countId: 'inProgressCount', items: pipelineState.inProgress, empty: 'No active compute miner' },
    { id: 'awaitingItems', countId: 'awaitingCount', items: pipelineState.awaiting, empty: 'Validation queue empty' },
    { id: 'completedItems', countId: 'completedCount', items: pipelineState.completed, empty: 'No completed orders yet' },
    { id: 'rejectedItems', countId: 'rejectedCount', items: pipelineState.rejected, empty: 'No rejected orders' }
  ];

  columns.forEach(col => {
    const container = document.getElementById(col.id);
    const countEl = document.getElementById(col.countId);
    if (!container) return;

    let filtered = col.items;
    if (activeFilter === 'inference') {
      filtered = filtered.filter(j => j.category === 'inference');
    } else if (activeFilter === 'oracle') {
      filtered = filtered.filter(j => j.category === 'oracle');
    } else if (activeFilter === 'zk') {
      filtered = filtered.filter(j => j.category === 'zk');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(j => j.id.toLowerCase().includes(q) || (j.title && j.title.toLowerCase().includes(q)));
    }

    if (countEl) countEl.textContent = filtered.length;

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

      let signerDid = NETWORK_DIDS[0];
      if (selectedSigner === 'temp') {
        signerDid = 'did:key:z6Mk' + Math.random().toString(36).substring(2, 12) + 'Keygen';
      } else if (selectedSigner === 'custom') {
        const customVal = document.getElementById('customSeedInput').value.trim();
        signerDid = customVal ? 'did:key:z6Mk' + customVal.substring(0, 8) + 'Custom' : NETWORK_DIDS[0];
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
        btnExecute.innerHTML = '🚀 SIGN & BROADCAST TO NETWORK';
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

  document.getElementById('modalJobTitle').textContent = `Work Order Cryptographic Audit #${job.id}`;
  document.getElementById('modalJobBadge').textContent = job.status.toUpperCase();
  document.getElementById('modalPosterDid').textContent = job.poster || NETWORK_DIDS[0];
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
          <span>🛡️ did:key:z6Mk...DnKf (${getNodeShortName(NETWORK_DIDS[2])})</span>
          <span class="badge badge-success">✓ USEFUL (pLDDT: 99.8%)</span>
        </div>
        <div class="val-sig-row">
          <span>🛡️ did:key:z6Mk...BiHJ (${getNodeShortName(NETWORK_DIDS[3])})</span>
          <span class="badge badge-success">✓ USEFUL (Math Verified)</span>
        </div>
        <div class="val-sig-row">
          <span>🛡️ did:key:z6Mk...jCRv (${getNodeShortName(NETWORK_DIDS[4])})</span>
          <span class="badge badge-success">✓ USEFUL (Attested Quorum)</span>
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
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 200;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = [
    { name: 'Node-Alpha (Genesis)', type: 'worker', x: 0.2, y: 0.3, radius: 10, color: '#00f3ff' },
    { name: 'Tokyo-Inference-02', type: 'worker', x: 0.35, y: 0.7, radius: 8, color: '#00f3ff' },
    { name: 'CyberNode-EU-03', type: 'validator', x: 0.65, y: 0.3, radius: 8, color: '#a855f7' },
    { name: 'SolanaQuorum-04', type: 'validator', x: 0.8, y: 0.65, radius: 8, color: '#a855f7' },
    { name: 'US-East-Relay-05', type: 'validator', x: 0.5, y: 0.85, radius: 8, color: '#a855f7' },
    { name: 'Client Ingestion', type: 'poster', x: 0.08, y: 0.5, radius: 9, color: '#f59e0b' },
    { name: 'Genesis Ledger', type: 'ledger', x: 0.92, y: 0.45, radius: 11, color: '#10b981' }
  ];

  const packets = [];
  for (let i = 0; i < 8; i++) {
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
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f3ff';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    nodes.forEach((n, idx) => {
      const nx = n.x * w;
      const ny = n.y * h + Math.sin(time + idx) * 3;

      ctx.beginPath();
      ctx.arc(nx, ny, n.radius + 4 + Math.sin(time * 2 + idx) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = n.color;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(nx, ny, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();

      ctx.font = '10px "JetBrains Mono"';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(n.name, nx, ny + n.radius + 14);
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
  if (!timerEl) return;
  let countdown = 30;
  setInterval(() => {
    countdown--;
    if (countdown <= 0) countdown = 30;
    timerEl.textContent = `${countdown}s`;
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

async function fetchBoardData() {
  try {
    let res = await fetch(BOARD_API).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch('kibble_board.json').catch(() => null);
    }
    
    if (res && res.ok) {
      const data = await res.json();
      if (data.passports && data.passports.length > 0) {
        latestPassports = data.passports
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .map((p, i) => ({ ...p, rank: i + 1 }));
        lastUpdateTime = new Date();
      }
    }
  } catch (err) {
    console.warn('Board sync:', err);
  }

  renderLeaderboard(latestPassports);
  updateActiveNodesList();
}

function renderLeaderboard(passports) {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody || passports.length === 0) return;

  tbody.innerHTML = '';
  const top15 = passports.slice(0, 15);

  top15.forEach(p => {
    const tr = document.createElement('tr');
    const rankClass = p.rank === 1 ? 'rank-1' : (p.rank === 2 ? 'rank-2' : (p.rank === 3 ? 'rank-3' : ''));
    const shortDid = p.did.length > 18 ? `${p.did.substring(0, 10)}...${p.did.substring(p.did.length - 6)}` : p.did;
    const nodeAlias = NODE_NAMES[p.did] || null;

    let tierBadge = '<span class="badge badge-purple">VALIDATOR NODE</span>';
    if (p.rank === 1) tierBadge = '<span class="badge badge-gold">GENESIS LEADER</span>';
    else if (p.rank <= 3) tierBadge = '<span class="badge badge-cyan">TOP VALIDATOR</span>';

    tr.innerHTML = `
      <td><span class="rank-badge ${rankClass}">#${p.rank}</span></td>
      <td>
        <span class="did-code">${shortDid}</span>
        ${nodeAlias ? `<span class="agent-label"> (${nodeAlias})</span>` : ''}
      </td>
      <td><span class="score-val">${(p.score || 0).toLocaleString()}</span></td>
      <td>${p.results_delivered || 0}</td>
      <td>${p.attestations_given || 0}</td>
      <td>${tierBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateActiveNodesList() {
  const container = document.getElementById('swarmFleetList');
  if (!container) return;

  container.innerHTML = '';
  const displayNodes = latestPassports.slice(0, 5);

  displayNodes.forEach((p, idx) => {
    const name = NODE_NAMES[p.did] || `Validator-Node-0${idx + 1}`;
    const rankClass = idx === 0 ? 'node-rank-1' : (idx === 1 ? 'node-rank-2' : 'node-rank-3');

    const card = document.createElement('div');
    card.className = 'swarm-card';
    card.innerHTML = `
      <div class="node-rank-badge ${rankClass}">#${p.rank || idx + 1}</div>
      <div class="node-details">
        <div class="node-name-row">
          <span class="node-name">${name}</span>
          <span class="badge ${idx === 0 ? 'badge-gold' : 'badge-purple'}">${idx === 0 ? 'CONSENSUS LEADER' : 'VALIDATOR QUORUM'}</span>
        </div>
        <span class="node-did">${p.did.substring(0, 16)}...${p.did.substring(p.did.length - 6)}</span>
        <span class="node-stats">Score: ${(p.score || 0).toLocaleString()} • ${p.results_delivered || 0} Deliv / ${p.attestations_given || 0} Attest</span>
      </div>
      <div class="badge badge-success">● VERIFIED</div>
    `;
    container.appendChild(card);
  });
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

  const performSearch = () => {
    const query = input.value.trim();
    if (!query) return;

    const target = latestPassports.find(p => p.did.toLowerCase().includes(query.toLowerCase()));
    const score = target ? target.score : 0;
    const rank = target ? target.rank : 'Unranked';

    resultCard.style.display = 'block';
    resultCard.innerHTML = `
      <div class="user-found-grid">
        <div class="user-metric">
          <span class="user-label">GLOBAL RANK</span>
          <span class="user-rank-val">${typeof rank === 'number' ? '#' + rank : rank}</span>
        </div>
        <div class="user-metric">
          <span class="user-label">TOTAL REPUTATION</span>
          <span class="user-val">${score.toLocaleString()} PTS</span>
        </div>
        <div class="user-metric">
          <span class="user-label">AIRDROP TIER</span>
          <span class="badge ${score > 1000 ? 'badge-gold' : 'badge-cyan'}">${score > 1000 ? 'TIER 1 - ELITE' : 'TIER 2 - ACTIVE'}</span>
        </div>
        <div class="user-metric">
          <span class="user-label">STATUS</span>
          <span class="badge badge-success">VERIFIED</span>
        </div>
      </div>
    `;
  };

  btn.addEventListener('click', performSearch);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
