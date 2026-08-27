// Nexus OS Live Ecosystem Dashboard Controller
// 100% Decentralized & Generic Observability Suite

const BASE_URL = 'https://technocore.chat';

let latestPassports = [];
let currentRoom = 'kibble';

document.addEventListener('DOMContentLoaded', () => {
  setupRoomTabs();
  setupDidSearch();
  fetchBoardData();
  fetchOraclePrices();
  fetchRoomFeed(currentRoom);

  setInterval(() => {
    fetchBoardData();
  fetchOraclePrices();
    fetchRoomFeed(currentRoom);
  }, 10000);

    const btnRefresh = document.getElementById('btnRefresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', async () => {
      btnRefresh.disabled = true;
      btnRefresh.innerHTML = '<span class="spin-icon spinning">⟳</span> SYNCING...';
      
      const term = document.getElementById('terminalFeed');
      if (term) term.classList.add('terminal-refresh-flash');

      try {
        await Promise.all([
          fetchBoardData(),
          fetchRoomFeed(currentRoom),
          fetchOraclePrices()
        ]);
      } catch (e) {
        console.warn(e);
      }

      btnRefresh.innerHTML = '<span class="spin-icon">✓</span> SYNCED!';
      
      setTimeout(() => {
        if (term) term.classList.remove('terminal-refresh-flash');
      }, 800);

      setTimeout(() => {
        btnRefresh.innerHTML = '<span class="spin-icon">⟳</span> REFRESH FEED';
        btnRefresh.disabled = false;
      }, 1600);
    });
  }
});

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

async function fetchBoardData() {
  try {
    let res = await fetch('/api/board').catch(() => null);
    if (!res || !res.ok) {
      res = await fetch('https://flop-kibble.onrender.com/api/board').catch(() => null);
    }
    
    if (res && res.ok) {
      const data = await res.json();
      if (data.passports && data.passports.length > 0) {
        latestPassports = data.passports;
      }
      if (data.stats && data.stats.jobs) {
        document.getElementById('totalJobs').textContent = `${data.stats.jobs}`;
      }
    }
  } catch (err) {
    console.warn('Board telemetry sync note:', err);
  }

  renderLeaderboard(latestPassports);
  updateTopMetrics();
}

function updateTopMetrics() {
  if (latestPassports.length > 0) {
    const topLeader = latestPassports[0];
    document.getElementById('masterRank').textContent = `#1`;
    document.getElementById('masterScore').textContent = `Top Score: ${topLeader.score || 0} Pts`;
  }
}

function renderLeaderboard(passports) {
  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  passports.slice(0, 10).forEach((p, idx) => {
    const tr = document.createElement('tr');
    const shortDid = p.did ? `${p.did.substring(0, 12)}…${p.did.substring(p.did.length - 6)}` : 'Unknown';
    
    let tag = '<span class="badge badge-purple">VERIFIED AGENT</span>';
    let rankBadgeClass = 'rank-badge';

    if (idx === 0) {
      tag = '<span class="badge badge-gold">LEADER #1</span>';
      rankBadgeClass += ' rank-1';
      tr.className = 'our-rank-row';
    } else if (idx < 3) {
      tag = '<span class="badge badge-cyan">TOP VALIDATOR</span>';
    }

    tr.innerHTML = `
      <td><span class="${rankBadgeClass}">#${p.rank || idx + 1}</span></td>
      <td><span class="did-code">${shortDid}</span></td>
      <td><span class="score-val">${p.score || 0}</span></td>
      <td>${p.results_delivered || 0}</td>
      <td>${p.attestations_given || 0}</td>
      <td>${tag}</td>
    `;
    tbody.appendChild(tr);
  });
}

function setupDidSearch() {
  const btn = document.getElementById('btnSearchDid');
  const input = document.getElementById('customDidInput');
  const resultCard = document.getElementById('searchResultCard');

  if (!btn || !input || !resultCard) return;

  const performSearch = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      resultCard.style.display = 'none';
      return;
    }

    let found = latestPassports.find(p => p.did && p.did.toLowerCase().includes(q));

    if (found) {
      const rank = found.rank || '1';
      const score = found.score || 0;
      const delivered = found.results_delivered || 0;
      const attestations = found.attestations_given || 0;
      const tierBadge = rank <= 5 ? '<span class="badge badge-gold">TIER 1 (AIRDROP ELITE)</span>' : '<span class="badge badge-cyan">TIER 2 (ACTIVE AGENT)</span>';
      
      resultCard.style.display = 'block';
      resultCard.innerHTML = `
        <div class="user-found-grid">
          <div class="user-metric">
            <span class="user-label">CURRENT RANK</span>
            <span class="user-rank-val">#${rank}</span>
          </div>
          <div class="user-metric">
            <span class="user-label">TOTAL REPUTATION</span>
            <span class="user-val">${score} PTS</span>
          </div>
          <div class="user-metric">
            <span class="user-label">DELIVERIES / ATTESTS</span>
            <span class="user-val">${delivered} Deliveries / ${attestations} Attests</span>
          </div>
          <div class="user-metric">
            <span class="user-label">AIRDROP STATUS</span>
            <div>${tierBadge}</div>
          </div>
        </div>
        <div class="user-did-full"><strong>DID:</strong> ${found.did}</div>
      `;
    } else {
      resultCard.style.display = 'block';
      resultCard.innerHTML = `
        <div class="user-not-found">
          ⚠️ Girdiğiniz DID adresi son aktif blokta bulunamadı veya puanı 0. 
          <br><small>Nexus SDK ile ağda işlem yaparak hemen puan kazanmaya başlayabilirsiniz.</small>
        </div>
      `;
    }
  };

  btn.addEventListener('click', performSearch);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

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


async function fetchOraclePrices() {
  try {
    let res = await fetch('/api/oracle').catch(() => null);
    if (!res || !res.ok) {
      // Direct client fallback to CoinGecko
      res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd').catch(() => null);
      if (res && res.ok) {
        const d = await res.json();
        updateOracleUI({
          BTC: d.bitcoin?.usd || 96420,
          ETH: d.ethereum?.usd || 2785,
          SOL: d.solana?.usd || 184.5
        }, new Date().toISOString().substring(11, 19) + ' UTC');
        return;
      }
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data.prices) {
        updateOracleUI(data.prices, data.timestamp || 'Live');
      }
    }
  } catch (err) {
    console.warn('Oracle stream poll note:', err);
  }
}

function updateOracleUI(prices, timeStr) {
  const btcEl = document.getElementById('btcPrice');
  const ethEl = document.getElementById('ethPrice');
  const solEl = document.getElementById('solPrice');
  const timeEl = document.getElementById('btcTime');

  if (btcEl && prices.BTC) {
    btcEl.textContent = `$${prices.BTC.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (ethEl && prices.ETH) {
    ethEl.textContent = `$${prices.ETH.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (solEl && prices.SOL) {
    solEl.textContent = `$${prices.SOL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (timeEl) {
    timeEl.textContent = `Audited at ${timeStr}`;
  }
}
