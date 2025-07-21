// pages/api/scrape.ts
export async function POST(req) {
  const body = await req.json();

  const data = await fetch("http://localhost:5000/scrape", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const result = await data.json();

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
  