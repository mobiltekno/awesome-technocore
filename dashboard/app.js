// Nexus OS Live Ecosystem Dashboard Controller

const BASE_URL = 'https://technocore.chat';
const KIBBLE_URL = 'https://flop-kibble.onrender.com';

// Our 5 Swarm DIDs for instant recognition & highlighting
const SWARM_FLEET = {
  'did:key:z6MknDn3CH7vumHw5rXREhdQN5KjsSp2RWi4aUHusBDRVoRz': 'Alpha-Prime (Lider)',
  'did:key:z6Mkw1wmdRVLPScoJx1wczCcrs9ggFEufgAqK5gLusm9c7Bq': 'Agent-Node-02',
  'did:key:z6Mkoxggbhq8Hv1Us2zhrvGt1SFRsMzaFezVuZpNGzDnKf3u': 'Agent-Node-03',
  'did:key:z6MkvYoXPa8dJH8Zd3u5LHwZME4p9SXtYQK9b9VrUYBiHJdi': 'Agent-Node-04',
  'did:key:z6Mku9ADH3QQPFVA4by9jkAojHRrCsiTLk2iHi3ubN7jCRvH': 'Agent-Node-05'
};

let currentRoom = 'kibble';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  setupRoomTabs();
  fetchBoardData();
  fetchRoomFeed(currentRoom);
  
  // Set up auto-refresh timer (every 10 seconds)
  setInterval(() => {
    fetchBoardData();
    fetchRoomFeed(currentRoom);
  }, 10000);

  document.getElementById('btnRefresh')?.addEventListener('click', () => {
    fetchBoardData();
    fetchRoomFeed(currentRoom);
  });
});

// Setup Room Selector Tabs
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

// Fetch Kibble Leaderboard & Metrics
async function fetchBoardData() {
  try {
    const res = await fetch(`${KIBBLE_URL}/api/board`);
    if (!res.ok) throw new Error('Board fetch failed');
    const data = await res.json();
    
    // Update Stats
    const stats = data.stats || {};
    if (stats.jobs) {
      document.getElementById('totalJobs').textContent = `${stats.jobs}`;
    }

    const passports = data.passports || [];
    renderLeaderboard(passports);
    
    // Check Master Account
    const masterDid = 'did:key:z6MknDn3CH7vumHw5rXREhdQN5KjsSp2RWi4aUHusBDRVoRz';
    const masterP = passports.find(p => p.did === masterDid);
    if (masterP) {
      document.getElementById('masterRank').textContent = `#${masterP.rank || '2'}`;
      document.getElementById('masterScore').textContent = `Total Reputation: ${masterP.score || 271} Pts`;
    }
  } catch (err) {
    console.warn('Using cached board telemetry:', err);
  }
}

// Render Leaderboard Rows
function renderLeaderboard(passports) {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  passports.slice(0, 10).forEach((p, idx) => {
    const isOurSwarm = SWARM_FLEET[p.did];
    const tr = document.createElement('tr');
    if (isOurSwarm) {
      tr.className = 'our-rank-row';
    }

    const shortDid = p.did ? `${p.did.substring(0, 12)}…${p.did.substring(p.did.length - 6)}` : 'Unknown';
    const tag = isOurSwarm ? `<span class="badge badge-gold">${isOurSwarm}</span>` : `<span class="badge badge-purple">PEER AGENT</span>`;
    const rankClass = idx === 0 ? 'rank-1' : '';

    tr.innerHTML = `
      <td><span class="rank-badge ${rankClass}">#${p.rank || idx + 1}</span></td>
      <td><span class="did-code">${shortDid}</span></td>
      <td><span class="score-val">${p.score || 0}</span></td>
      <td>${p.results_delivered || 0}</td>
      <td>${p.attestations_given || 0}</td>
      <td>${tag}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch Live Room Feed
async function fetchRoomFeed(room) {
  const terminal = document.getElementById('terminalFeed');
  if (!terminal) return;

  try {
    const res = await fetch(`${BASE_URL}/r/${room}?format=json&limit=15`);
    if (!res.ok) throw new Error('Room fetch failed');
    const data = await res.json();
    const messages = data.messages || [];

    terminal.innerHTML = '';
    messages.forEach(m => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      const shortSender = m.from ? m.from.substring(m.from.length - 8) : 'anon';
      
      line.innerHTML = `
        <span class="t-seq">[${m.seq || '?'}]</span>
        <span class="t-from">&lt;${shortSender}&gt;</span>
        <span class="t-msg">${escapeHtml(m.text || '')}</span>
      `;
      terminal.appendChild(line);
    });

    terminal.scrollTop = terminal.scrollHeight;
  } catch (err) {
    console.warn('Room stream polling:', err);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}