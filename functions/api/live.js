/**
 * Stato conmotione: store gioco (KV) + indice media (metadati, file su R2).
 * Binding: LIVE (KV), MEDIA (R2) — vedi wrangler.toml
 */
const KV_KEY = "wedding_live_v1";
const MAX_MEDIA_INDEX = 800;

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function defaultState() {
  return {
    media: [],
    store: { players: {}, submissions: [] },
  };
}

async function readState(kv) {
  const raw = await kv.get(KV_KEY, "text");
  if (!raw) return defaultState();
  try {
    const j = JSON.parse(raw);
    return {
      media: Array.isArray(j.media) ? j.media : [],
      store: {
        players:
          j.store && typeof j.store.players === "object" ? j.store.players : {},
        submissions: Array.isArray(j.store?.submissions)
          ? j.store.submissions
          : [],
      },
    };
  } catch {
    return defaultState();
  }
}

function mergePlayers(pa, pb) {
  const out = { ...pa };
  for (const [k, v] of Object.entries(pb || {})) {
    if (!v || typeof v !== "object") continue;
    if (!out[k]) {
      out[k] = { ...v };
    } else {
      const o = out[k];
      out[k] = {
        ...o,
        ...v,
        name: v.name || o.name,
        score: Math.max(Number(o.score) || 0, Number(v.score) || 0),
        completedMissionIds: [
          ...new Set([
            ...(o.completedMissionIds || []),
            ...(v.completedMissionIds || []),
          ]),
        ],
      };
    }
  }
  return out;
}

function mergeStore(a, b) {
  const subsMap = new Map();
  for (const s of [...(a.submissions || []), ...((b && b.submissions) || [])]) {
    if (s && s.id) subsMap.set(s.id, s);
  }
  return {
    players: mergePlayers(a.players || {}, (b && b.players) || {}),
    submissions: Array.from(subsMap.values()),
  };
}

function mediaWithUrls(media, origin) {
  return (media || []).map((m) => {
    if (!m || !m.id) return m;
    const out = { ...m };
    delete out.data;
    delete out.r2Key;
    if (m.r2Key || m.id) {
      out.url = `${origin}/api/media/file/${m.id}`;
    }
    return out;
  });
}

async function handleGet(request, env) {
  if (!env.LIVE) {
    return new Response(JSON.stringify({ ok: false, error: "no_kv" }), {
      headers: jsonHeaders,
    });
  }
  const state = await readState(env.LIVE);
  const origin = new URL(request.url).origin;
  return new Response(
    JSON.stringify({
      ok: true,
      media: mediaWithUrls(state.media, origin),
      store: state.store,
      hasR2: Boolean(env.MEDIA),
      updatedAt: Date.now(),
    }),
    { headers: jsonHeaders }
  );
}

async function handlePost(request, env) {
  if (!env.LIVE) {
    return new Response(JSON.stringify({ ok: false, error: "no_kv" }), {
      headers: jsonHeaders,
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "bad_json" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
  const cur = await readState(env.LIVE);
  const merged = {
    media: cur.media,
    store: mergeStore(cur.store, body.store || { players: {}, submissions: [] }),
  };
  await env.LIVE.put(KV_KEY, JSON.stringify(merged));
  const origin = new URL(request.url).origin;
  return new Response(
    JSON.stringify({
      ok: true,
      media: mediaWithUrls(merged.media, origin),
      store: merged.store,
      hasR2: Boolean(env.MEDIA),
      updatedAt: Date.now(),
    }),
    { headers: jsonHeaders }
  );
}

export async function onRequest(context) {
  try {
    const { request, env } = context;
    const m = request.method;

    if (m === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...jsonHeaders,
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "Content-Type",
          "access-control-max-age": "86400",
        },
      });
    }

    if (m === "GET") return await handleGet(request, env);
    if (m === "POST") return await handlePost(request, env);

    return new Response(
      JSON.stringify({ ok: false, error: "method_not_allowed" }),
      { status: 405, headers: jsonHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "internal",
        message: e instanceof Error ? e.message : String(e),
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
