export async function onRequest(context) {
  const kv = context.env.LIVE;
  if (!kv) {
    return Response.json({ ok: false, reason: "no_kv" });
  }
  return Response.json({ ok: true });
}
