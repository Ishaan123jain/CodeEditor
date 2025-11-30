export const API_BASE = "http://localhost:8000";

export async function createRoom(room_id: string) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room_id }),   // <-- MOST IMPORTANT
  });

  return res.json();
}

export async function requestAutocomplete(code: string) {
  const res = await fetch(`${API_BASE}/autocomplete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      cursorPosition: code.length,
      language: "python"
    })
  });

  return res.json();
}
