const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require('@azure/storage-blob');

const CONTAINER_NAME = 'wellbeing-media';

const corsHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function parseConnectionString(connStr) {
  const parts = {};
  connStr.split(';').forEach((segment) => {
    const idx = segment.indexOf('=');
    if (idx > 0) {
      const key = segment.slice(0, idx).trim();
      const val = segment.slice(idx + 1).trim();
      parts[key] = val;
    }
  });
  return parts;
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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const rawName = (body.fileName || 'media.bin').replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${rawName}`;

    const connParts = parseConnectionString(connStr);
    const accountName = connParts.AccountName;
    const accountKey = connParts.AccountKey;

    if (!accountName || !accountKey) {
      throw new Error('Invalid Storage Connection String');
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(blobName);

    const startsOn = new Date(Date.now() - 60 * 1000);
    const expiresOn = new Date(Date.now() + 10 * 60 * 1000);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: CONTAINER_NAME,
        blobName,
        permissions: BlobSASPermissions.parse('cw'),
        startsOn,
        expiresOn,
      },
      sharedKeyCredential
    ).toString();

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        uploadUrl: `${blobClient.url}?${sasToken}`,
        publicUrl: blobClient.url,
        blobName,
      }),
    };
  } catch (err) {
    context.log.error('[Wellbeing API /upload-url] Error:', err);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || 'Could not generate upload SAS URL' }),
    };
  }
};
