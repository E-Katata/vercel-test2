import { Hono } from "hono";
import { handle } from "hono/vercel";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const runtime = "edge";

const app = new Hono().basePath("/api");

// GET /api/tanks  ← Neonから一覧取得
app.get("/tanks", async (c) => {
  const rows = await sql`SELECT id, name, level, capacity FROM tanks ORDER BY id`;
  return c.json(rows);
});

// GET /api/tanks/:id ← Neonから単体取得
app.get("/tanks/:id", async (c) => {
  const id = c.req.param("id");
  const rows = await sql`SELECT id, name, level, capacity FROM tanks WHERE id = ${id}`;
  if (rows.length === 0) return c.notFound();
  return c.json(rows[0]);
});

app.post("/tanks", async (c) => {
  const body = await c.req.json();
  // DBへ登録処理
  const rows = await sql`INSERT into tanks(id, name, level, capacity) values (${body.id}, ${body.name}, ${body.level}, ${body.capacity})`;
  return c.json({ message: "created" }, 201);
});

// PUT /api/tanks/:id ← Neonから単体取得
app.put("/tanks/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  // DBへ更新処理
  const rows = await sql`UPDATE tanks set name = ${body.name}, level = ${body.level}, capacity = ${body.capacity} where id = ${id}`;
  return c.json({ message: "created" }, 201);
});

// GET /api/tanks/:id ← Neonから単体取得
app.delete("/tanks/:id", async (c) => {
  const id = c.req.param("id");
  const rows = await sql`DELETE FROM tanks WHERE id = ${id}`;
  if (rows.length === 0) return c.notFound();
  return c.json(rows[0]);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export type AppType = typeof app;
