import { dataHandler } from "./data_handler.js";

let boards = dataHandler.getBoards(showBoards);
console.log(boards);

function showBoards(boards) {
    console.log(boards);
    for (let board of boards){
        document.body.innerHTML += board.id;
    }

}