export async function POST() {
  return new Response(JSON.stringify({ status: "stub" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
