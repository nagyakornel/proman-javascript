import {dataHandler} from "./data_handler.js";



dataHandler.getBoards(showBoards);


function showBoards(boards) {
    let i = 0;
    let x = 0;
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
            x = x + statusIDs.length;
            for (let statusID of statusIDs) {
                dataHandler.getStatus(statusID.status_id, callStatus);

                function callStatus(tempStatus) {
                    let boardColumn = document.createElement('div');
                    boardColumn.className = 'board-column col collapse multi-collapse' + board.id;
                    let boardColumnTitle = document.createElement('div');
                    boardColumnTitle.className = 'board-column-title';
                    boardColumnTitle.innerHTML = tempStatus[0].title;
                    boardColumn.appendChild(boardColumnTitle);
                    let boardColumnContent = document.createElement('div');
                    boardColumnContent.className = 'board-column-content container';
                    boardColumnContent.id = `dragula-${board.id}-${statusID.status_id}`;
                    dataHandler.getCardsByBoardId(board.id, statusID.status_id, appendCards);

                    function appendCards(cards) {
                        for (let lists in cards) {
                            for (let element in cards[lists]) {
                                if (element === 'title') {
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
                                    boardColumnContent.appendChild(card);
                                }
                            }
                        }
                    }

                    boardColumn.appendChild(boardColumnContent);
                    boardBody.appendChild(boardColumn);
                    if (i === x - 1) {
                        let containerNodes = document.querySelectorAll('.container');
                        window.containerArrays = Array.from(containerNodes);
                        dragula(containerArrays, {
                            copy: function (el, source) {
                                return source === document.getElementById('copycard')
                            },
                            accepts: function (el, target) {
                                return target !== document.getElementById('copycard')
                            },
                            revertOnSpill: true
                        })
                    }
                    i++;
                }

                section.appendChild(boardBody);
                boardContainer.appendChild(section);
                document.body.appendChild(boardContainer);
            }
        }
    }
}

let createNewPublicBoard = document.getElementById('create-public-board');
createNewPublicBoard.addEventListener('click', function () {
    createBoard(true)
})
let createNewPrivateBoard = document.getElementById('create-private-board');
if (createNewPrivateBoard !== null) {
    createNewPrivateBoard.addEventListener('click', function () {
        createBoard(false)
    })
}

function createBoard(publicity) {

    let boardContainer = document.createElement('div');
    boardContainer.className = 'board-container';

    let section = document.createElement('section');
    section.className = 'board';
    let boardHeader = document.createElement('div');
    boardHeader.className = 'board-header';


    let boardTitle = document.createElement('input');
    boardTitle.setAttribute('type', 'text');
    boardTitle.setAttribute('placeholder', 'New board');
    boardTitle.className = 'board-title';
    boardTitle.setAttribute('id', 'newboardtitle');
    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    boardTitle.addEventListener('blur', function () {
        console.log('blur')
        let newBoardTitle = 'New board'
        if (boardTitle.value) {
            newBoardTitle = boardTitle.value
        }
        dataHandler.createNewBoard(newBoardTitle, publicity, getNewBoard)

        function getNewBoard(data) {
            let newBoardTitle = document.createElement('span');
            newBoardTitle.innerHTML = data[0].title;
            newBoardTitle.className = 'board-title';
            boardHeader.removeChild(saveButton);
            let oldBoardTitle = document.getElementById('newboardtitle');
            boardHeader.removeChild(oldBoardTitle);
            boardHeader.appendChild(newBoardTitle);
            let boardAdd = document.createElement('button');
            boardAdd.className = 'board-add';
            boardAdd.innerHTML = 'Add Card';
            boardHeader.appendChild(boardAdd);
            let boardToggle = document.createElement('button');
            boardToggle.className = 'board-toggle';
            boardToggle.type = 'button';
            boardToggle.dataset.toggle = 'collapse';
            boardToggle.dataset.target = '.multi-collapse' + data[0].id;
            let arrowIcon = document.createElement('i');
            arrowIcon.className = 'fas fa-chevron-down';
            boardToggle.appendChild(arrowIcon);
            boardHeader.appendChild(boardToggle);
            let columnTitles = ['new', 'in progress', 'testing', 'done']
            for (let i = 0; i < columnTitles.length; i++) {
                columnsForNewBoards(columnTitles[i], i + 1)
            }

            function columnsForNewBoards(columnTitle, statusIndex) {

                let boardColumn = document.createElement('div');
                boardColumn.className = 'board-column col collapse multi-collapse' + data[0].id;
                let boardColumnTitle = document.createElement('div');
                boardColumnTitle.className = 'board-column-title';
                boardColumnTitle.innerHTML = columnTitle;
                boardColumn.appendChild(boardColumnTitle);
                let boardColumnContent = document.createElement('div');
                boardColumnContent.className = 'board-column-content container';
                boardColumnContent.id = `dragula-${data[0].id}-${statusIndex}`;
                boardColumn.appendChild(boardColumnTitle);
                boardColumn.appendChild(boardColumnContent);
                boardBody.appendChild(boardColumn);
                section.appendChild(boardBody);
                createNewDragula()

            }
        }
    });
    boardHeader.appendChild(boardTitle);
    boardHeader.appendChild(saveButton);
    section.appendChild(boardHeader);
    let boardBody = document.createElement('div');
    boardBody.className = 'board-body row';
    boardContainer.appendChild(section);
    document.body.appendChild(boardContainer);

}


let counter = 1
function createNewDragula() {
    let calc = counter%4
    if (calc !== 0){
        counter++
    } else {
        let allColumns = document.querySelectorAll('.container')
        let allColumnsArrays = Array.from(allColumns);
        counter++
        for (let i = 1; i < 5; i++) {
            window.containerArrays.push(allColumnsArrays[allColumnsArrays.length - i]);
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
