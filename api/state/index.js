const { BlobServiceClient } = require('@azure/storage-blob');

const CONTAINER_NAME = 'wellbeing-state';
const BLOB_NAME = 'wellbeing_unified_state.json';

const corsHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function streamToText(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => chunks.push(data.toString('utf8')));
    readableStream.on('end', () => resolve(chunks.join('')));
    readableStream.on('error', reject);
  });
}

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: corsHeaders };
    return;
  }

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connStr) {
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'AZURE_STORAGE_CONNECTION_STRING not configured' }),
    };
    return;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(BLOB_NAME);

    if (req.method === 'GET') {
      const exists = await blockBlobClient.exists();
      if (!exists) {
        context.res = {
          status: 200,
          headers: corsHeaders,
          body: JSON.stringify({ exists: false, state: null }),
        };
        return;
      }

      const downloadResp = await blockBlobClient.download(0);
      const rawContent = await streamToText(downloadResp.readableStreamBody);
      const state = JSON.parse(rawContent);

      context.res = {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify({ exists: true, state }),
      };
      return;
    }

    if (req.method === 'POST') {
      const incoming = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!incoming || typeof incoming !== 'object') {
        context.res = {
          status: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Invalid JSON state payload' }),
        };
        return;
      }

      const stateToSave = {
        ...incoming,
        updatedAt: incoming.updatedAt || new Date().toISOString(),
      };

      const serialized = JSON.stringify(stateToSave);
      await blockBlobClient.upload(serialized, Buffer.byteLength(serialized), {
        blobHTTPHeaders: {
          blobContentType: 'application/json; charset=utf-8',
          blobCacheControl: 'no-store',
        },
      });

      context.res = {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true, updatedAt: stateToSave.updatedAt }),
      };
      return;
    }

    context.res = { status: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    context.log.error('[Wellbeing API /state] Error:', err);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};
