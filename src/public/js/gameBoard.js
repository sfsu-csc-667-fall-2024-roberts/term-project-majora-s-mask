//Function to load a game board
export async function loadGameBoard(gameId, userId) {
    try {
        const response = await fetch(`/game/${gameId}`);
        if (!response.ok){
            throw new Error("Failed to fetch game data.");
        }
    

    const data = await response.json();
    const gameBoardDiv = document.getElementById("game-board");

    //clear game board
    gameBoardDiv.innerHTML = "";

    //check if board data exists
    if (!data.board || !Array.isArray(data.board)){
        gameBoardDiv.innerHTML = "<p>No game board data available.</p>";
        return;
    }

    //render the bingo board
    data.board.forEach((row) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("bingo-row");

        row.forEach((number) => {
            const cellDiv = document.createElement("div");
            cellDiv.textContent = number;
            cellDiv.className = "bingo-cell";

            //mark crossed-out numbers
            if (data.crossedNumbers && data.crossedNumbers.includes(number)){
                cellDiv.classList.add("crossed-out");
            }

            //attach event listener if it's the player's turn
            if (data.currentTurnUserId === userId){
                cellDiv.addEventListener("click", () => crossNumber(gameId, number));
            }

            rowDiv.appendChild(cellDiv);
        });

        gameBoardDiv.appendChild(rowDiv);
    });
    
        //update turn info
        const turnInfo = document.getElementById("turn-info");
        if (turnInfo){
            turnInfo.textContent = 
            data.currentTurnUserId === userId
            ? "It's your turn!"
            : `Waiting for Player ${data.currentTurnUserId}'s turn.`;
        }
    } catch (err){
        console.error("Failed to load game board:", err);
        alert("Failed to load game board. Please try again.");
    }
}

//Function to cross a number on the game board
export async function crossNumber(gameId, number) {
    try {
        const response = await fetch(`/game/${gameId}/cross`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ number }),
    });
    
    if (response.ok){
        console.log("Number crossed successfully."); //Server will broadcast update via WebSocket
    } else {
        const error = await response.json();
        alert(`Failed to cross number: ${error.message}`);
    }
 } catch (err) {
    console.error("Error crossing number:", err);
    alert("An unexpected error occurred.");
 }
}