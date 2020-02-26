import {dataHandler} from "./data_handler.js";

let boards = dataHandler.getBoards(showBoards);

function showBoards(boards) {
    for (let board of boards) {
        let boardContainer = document.createElement('div');
        boardContainer.className = 'board-container';
        let section = document.createElement('section');
        section.className = 'board';
        let boardHeader = document.createElement('div');
        boardHeader.className = 'board-header';
        let boardTitle = document.createElement('span');
        boardTitle.innerHTML = board.title;
        boardTitle.className = 'board-title';
        let boardAdd = document.createElement('button');
        boardAdd.className = 'board-add';
        boardAdd.innerHTML = 'Add Card';
        let boardToggle = document.createElement('button');
        boardToggle.className = 'board-toggle';
        boardToggle.type = 'button';
        boardToggle.dataset.toggle = 'collapse';
        boardToggle.dataset.target = '.multi-collapse' + board.id;
        let arrowIcon = document.createElement('i');
        arrowIcon.className = 'fas fa-chevron-down';
        boardToggle.appendChild(arrowIcon);
        boardHeader.appendChild(boardTitle);
        boardHeader.appendChild(boardAdd);
        boardHeader.appendChild(boardToggle);
        section.appendChild(boardHeader);

        let boardBody = document.createElement('div');
        boardBody.className = 'board-body row';
        dataHandler.getStatusesByBoard(board.id, showStatuses);

        function showStatuses(statusIDs) {
            let statuses = [];
            for (let statusID of statusIDs) {
                let status = dataHandler.getStatus(statusID.status_id, callStatus);

                function callStatus(tempStatus) {
                    statuses.push(tempStatus[0].title);
                    let boardColumn = document.createElement('div');
                    boardColumn.className = 'board-column col collapse multi-collapse' + board.id;
                    let boardColumnTitle = document.createElement('div');
                    boardColumnTitle.className = 'board-column-title';
                    boardColumnTitle.innerHTML = tempStatus[0].title;
                    boardColumn.appendChild(boardColumnTitle);

                    let boardColumnContent = document.createElement('div');
                    boardColumnContent.className = 'board-column-content container';

                    dataHandler.getCardsByBoardId(board.id, statusID.status_id, appendCards);

                    function appendCards(cards) {

                        for (let lists in cards) {
                            console.log(cards[lists]);
                            for (let element in cards[lists]) {
                                console.log(element);
                                if (element === 'title') {
                                    console.log(element);
                                    let card = document.createElement('div');
                                    card.className = 'card';
                                    let cardRemove = document.createElement('div');
                                    cardRemove.className = 'card-remove';
                                    let cardRemoveButton = document.createElement('i');
                                    cardRemoveButton.className = 'fas fa-trash-alt';
                                    let cardTitle = document.createElement('div');
                                    cardTitle.className = 'card-title';
                                    cardTitle.innerHTML = cards[lists][element];
                                    cardRemove.appendChild(cardRemoveButton);
                                    card.appendChild(cardRemove);
                                    card.appendChild(cardTitle);
                                    console.log(card);
                                    boardColumn.appendChild(card);
                                }
                            }
                        }


                    }

                    boardBody.appendChild(boardColumn);
                }

                section.appendChild(boardBody);
                boardContainer.appendChild(section);
                document.body.appendChild(boardContainer);
            }
        }


    }
}


/*
<div class="board-container">
    <section class="board">
        <div class="board-header"><span class="board-title">Board 1</span>
            <button class="board-add">Add Card</button>
            <button class="board-toggle" type="button" data-toggle="collapse"
                    data-target=".multi-collapse"
                    aria-expanded="false" aria-controls="multiCollapseExample1 multiCollapseExample2"><i
                    class="fas fa-chevron-down"></i>
            </button>
        </div>
        <div class="board-body row">
            <div class="board-column col collapse multi-collapse" id="multiCollapseExample1">
                <div class="board-column-title">New</div>
                <div class="board-column-content container" id="left-defaults">
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">Card 1</div>
                    </div>
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">Card 2</div>
                    </div>
                </div>
            </div>
            <div class="board-column col collapse multi-collapse" id="multiCollapseExample1">
                <div class="board-column-title">In Progress</div>
                <div class="board-column-content container" id="middle-defaults">
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">Card 4</div>
                    </div>
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">Card 5</div>
                    </div>
                </div>
            </div>
            <div class="board-column col collapse multi-collapse" id="multiCollapseExample1">
                <div class="board-column-title">In Progress</div>
                <div class="board-column-content container" id="right-defaults">
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">Card 1</div>
                    </div>
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">Card 2</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
*/
