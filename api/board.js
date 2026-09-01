export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');

  try {
    // Try fast /api/status endpoint first
    let response = await fetch('https://flop-kibble.onrender.com/api/status', {
      headers: { 'User-Agent': 'TechnocoreExplorer/1.0' },
      signal: AbortSignal.timeout(6000)
    }).catch(() => null);

    if (!response || !response.ok) {
      response = await fetch('https://flop-kibble.onrender.com/api/board', {
        headers: { 'User-Agent': 'TechnocoreExplorer/1.0' },
        signal: AbortSignal.timeout(6000)
      }).catch(() => null);
    }
    
    if (response && response.ok) {
      const data = await response.json();
      const passports = (data.passports || []).map((p, idx) => ({
        rank: p.rank || idx + 1,
        did: p.did,
        score: p.score || 0,
        results_delivered: p.results_delivered || 0,
        attestations_given: p.attestations_given || 0,
        useful_attestations_received: p.useful_attestations_received || 0,
        not_useful_attestations_received: p.not_useful_attestations_received || 0,
        jobs_posted: p.jobs_posted || 0,
        briefs: p.briefs || 0
      }));

      return res.status(200).json({
        status: 'ok',
        source: 'live_kibble_tape',
        stats: {
          unique_agents: data.origin?.unique_agents || passports.length,
          seq: data.origin?.stats_engine_seq || data.scoring?.seq || null
        },
        passports: passports
      });
    }
  } catch (err) {
    console.warn('Live API fetch error:', err);
  }

  return res.status(200).json({
    status: 'ok',
    source: 'cached_explorer_data',
    passports: []
  });
}