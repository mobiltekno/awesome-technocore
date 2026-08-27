export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');

  let btc = 96420.50;
  let eth = 2785.20;
  let sol = 184.60;
  let baseGas = 8.4;

  try {
    // 1. Try fetching from CoinGecko Public API
    const cgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (cgRes.ok) {
      const data = await cgRes.json();
      if (data.bitcoin && data.bitcoin.usd) btc = data.bitcoin.usd;
      if (data.ethereum && data.ethereum.usd) eth = data.ethereum.usd;
      if (data.solana && data.solana.usd) sol = data.solana.usd;
    }
  } catch (err) {
    try {
      // 2. Fallback to Binance
      const bnRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22%5D', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(4000)
      });
      if (bnRes.ok) {
        const bnData = await bnRes.json();
        bnData.forEach(item => {
          if (item.symbol === 'BTCUSDT') btc = parseFloat(item.price);
          if (item.symbol === 'ETHUSDT') eth = parseFloat(item.price);
          if (item.symbol === 'SOLUSDT') sol = parseFloat(item.price);
        });
      }
    } catch (e2) {}
  }

  const isoTime = new Date().toISOString().substring(11, 19) + ' UTC';

  return res.status(200).json({
    status: 'ok',
    timestamp: isoTime,
    prices: {
      BTC: btc,
      ETH: eth,
      SOL: sol,
      FLOP: 1.25
    },
    telemetry: {
      eth_base_gas: baseGas
    }
  });
}