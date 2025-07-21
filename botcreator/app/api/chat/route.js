// app/api/chat.js
export async function POST(req) {
    const body = await req.json();
  
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  
    const result = await response.json();
  
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  