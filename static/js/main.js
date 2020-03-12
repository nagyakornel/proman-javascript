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
        boardTitle.addEventListener('dblclick', renameStatus);
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
                    boardColumnTitle.addEventListener('dblclick', renameStatus);
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
                                    cardTitle.addEventListener('dblclick', renameStatus);
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
    boardTitle.addEventListener('dblclick', renameStatus);
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
            createNewDragula()

            function columnsForNewBoards(columnTitle, statusIndex) {

                let boardColumn = document.createElement('div');
                boardColumn.className = 'board-column col collapse multi-collapse' + data[0].id;
                let boardColumnTitle = document.createElement('div');
                boardColumnTitle.className = 'board-column-title';
                boardColumnTitle.innerHTML = columnTitle;
                boardColumnTitle.addEventListener('dblclick', renameStatus);
                boardColumn.appendChild(boardColumnTitle);
                let boardColumnContent = document.createElement('div');
                boardColumnContent.className = 'board-column-content container';
                boardColumnContent.id = `dragula-${data[0].id}-${statusIndex}`;
                boardColumn.appendChild(boardColumnTitle);
                boardColumn.appendChild(boardColumnContent);
                boardBody.appendChild(boardColumn);
                section.appendChild(boardBody);
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

function createNewDragula() {
    let allColumns = document.querySelectorAll('.container')
    let allColumnsArrays = Array.from(allColumns);
    for (let i = 1; i < 5; i++) {
        window.containerArrays.push(allColumnsArrays[allColumnsArrays.length - i]);
    }
}

function renameStatus(t) {
    let originalStatus = t.target.innerHTML;
    let input = document.createElement('input');
    input.value = originalStatus;
    input.addEventListener('keyup', displayStatus);
    input.setAttribute('data-original', originalStatus);
    t.target.innerHTML = '';
    t.target.appendChild(input);
}

function displayStatus(t) {
    if (t.which === 13) { // 13 = Enter key
        t.target.parentNode.innerHTML = t.target.value;
    } else if (t.which === 27) { // 27 = Esc key
        t.target.parentNode.innerHTML = t.target.getAttribute('data-original');
    }
}
