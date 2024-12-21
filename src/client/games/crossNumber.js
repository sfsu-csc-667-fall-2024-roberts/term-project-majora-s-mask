export async function crossNumber(gameId, number) {
  try {
    const response = await fetch(`/game/${gameId}/cross`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number }),
    });

    if (response.ok) {
      console.log("Number crossed successfully."); // Server will broadcast update via WebSocket
    } else {
      const error = await response.json();
      alert(`Failed to cross number: ${error.message}`);
    }
  } catch (err) {
    console.error("Error crossing number:", err);
    alert("An unexpected error occurred.");
  }
}
