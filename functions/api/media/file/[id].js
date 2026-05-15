export async function onRequestGet(context) {
  const { env, params } = context;
  const id = params.id;

  if (!env.MEDIA || !id || !/^[a-f0-9-]{36}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const listed = await env.MEDIA.list({ prefix: `media/${id}.` });
  const key = listed.objects[0]?.key;
  if (!key) {
    return new Response("Not found", { status: 404 });
  }

  const obj = await env.MEDIA.get(key);
  if (!obj) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    obj.httpMetadata?.contentType || "application/octet-stream"
  );
  headers.set("Cache-Control", "public, max-age=86400");
  headers.set("Accept-Ranges", "bytes");

  return new Response(obj.body, { headers });
}

export async function onRequest(context) {
  if (context.request.method === "GET") {
    return onRequestGet(context);
  }
  return new Response("Method not allowed", { status: 405 });
}
