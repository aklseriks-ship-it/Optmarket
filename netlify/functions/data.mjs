import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "optmarkethub", consistency: "strong" });

  if (req.method === "GET") {
    const data = (await store.get("state", { type: "json" })) || {};
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "invalid json" }), { status: 400 });
    }
    const current = (await store.get("state", { type: "json" })) || {};
    const updated = { ...current, ...body };
    await store.setJSON("state", updated);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/data" };
