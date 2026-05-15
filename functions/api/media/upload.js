const KV_KEY = "wedding_live_v1";
const MAX_MEDIA_INDEX = 800;

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const MAX_BYTES = 25 * 1024 * 1024;

async function readState(kv) {
  const raw = await kv.get(KV_KEY, "text");
  if (!raw) return { media: [], store: { players: {}, submissions: [] } };
  try {
    const j = JSON.parse(raw);
    return {
      media: Array.isArray(j.media) ? j.media : [],
      store: j.store || { players: {}, submissions: [] },
    };
  } catch {
    return { media: [], store: { players: {}, submissions: [] } };
  }
}

async function appendMediaIndex(env, item) {
  const cur = await readState(env.LIVE);
  const map = new Map();
  for (const m of cur.media) {
    if (m && m.id) map.set(m.id, m);
  }
  map.set(item.id, item);
  let media = Array.from(map.values()).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (media.length > MAX_MEDIA_INDEX) media = media.slice(0, MAX_MEDIA_INDEX);
  await env.LIVE.put(KV_KEY, JSON.stringify({ media, store: cur.store }));
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.LIVE) {
    return new Response(JSON.stringify({ ok: false, error: "no_kv" }), {
      status: 503,
      headers: jsonHeaders,
    });
  }
  if (!env.MEDIA) {
    return new Response(JSON.stringify({ ok: false, error: "no_r2" }), {
      status: 503,
      headers: jsonHeaders,
    });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "bad_form" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return new Response(JSON.stringify({ ok: false, error: "no_file" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const type = file.type || "application/octet-stream";
  if (!type.startsWith("image/") && !type.startsWith("video/")) {
    return new Response(JSON.stringify({ ok: false, error: "bad_type" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (file.size > MAX_BYTES) {
    return new Response(JSON.stringify({ ok: false, error: "too_large" }), {
      status: 413,
      headers: jsonHeaders,
    });
  }

  const id = crypto.randomUUID();
  const ext = (type.split("/")[1] || "bin").split(";")[0];
  const r2Key = `media/${id}.${ext}`;

  await env.MEDIA.put(r2Key, file.stream(), {
    httpMetadata: { contentType: type },
  });

  const uploader = String(form.get("uploader") || "ospite").slice(0, 80);
  const name = String(file.name || `media-${id}`).slice(0, 200);
  const ts = Date.now();

  const item = { id, name, type, ts, uploader, r2Key, size: file.size };
  await appendMediaIndex(env, item);

  const origin = new URL(request.url).origin;
  return new Response(
    JSON.stringify({
      ok: true,
      item: {
        id,
        name,
        type,
        ts,
        uploader,
        url: `${origin}/api/media/file/${id}`,
      },
    }),
    { headers: jsonHeaders }
  );
}

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...jsonHeaders,
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
      },
    });
  }
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }
  return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
    status: 405,
    headers: jsonHeaders,
  });
}
