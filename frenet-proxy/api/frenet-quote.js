// api/frenet-quote.js
// Proxy server-side para a API de cotação da Frenet.
// Resolve o bloqueio de CORS e mantém o token da Frenet fora do navegador.

export default async function handler(req, res) {
  // Libera o CORS apenas para o domínio da sua loja (troque se usar outro domínio)
  const ALLOWED_ORIGIN = 'https://esterodesign.com';

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Requisição de "preflight" do navegador — só confirma que o CORS está liberado
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  try {
    const frenetResponse = await fetch('https://api.frenet.com.br/shipping/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: process.env.FRENET_TOKEN, // token fica só no servidor, nunca no navegador
      },
      body: JSON.stringify(req.body),
    });

    const data = await frenetResponse.json();
    res.status(frenetResponse.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar a Frenet', details: err.message });
  }
}
