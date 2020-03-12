import {dataHandler} from "./data_handler.js";


dataHandler.getBoards(showBoards);


function showBoards(boards) {
    let i = 0;
    let x = 0;
    for (let board of boards) {
        let boardContainer = document.createElement('div');
        boardContainer.className = 'board-container main-board';
        let section = document.createElement('section');
        section.className = 'board';
        let boardHeader = document.createElement('div');
        boardHeader.className = 'board-header';
        let boardTitle = document.createElement('span');
        boardTitle.innerHTML = board.title;
        boardTitle.className = 'board-title';
        boardTitle.setAttribute('data-board-id', board.id);
        boardTitle.addEventListener('dblclick', renameStatus);
        /*let boardAdd = document.createElement('button');
        boardAdd.className = 'board-add';
        boardAdd.innerHTML = 'Add Card';*/
        let boardDelete = document.createElement('i');
        boardDelete.className = 'fas fa-trash-alt board-delete';
        boardDelete.addEventListener('click', function () {
            boardContainer.style.display = 'none';
            dataHandler.deleteBoard(parseInt(board.id), console.log)
        });
        let boardToggle = document.createElement('button');
        boardToggle.className = 'board-toggle';
        boardToggle.type = 'button';
        boardToggle.dataset.toggle = 'collapse';
        boardToggle.dataset.target = '.multi-collapse' + board.id;
        let arrowIcon = document.createElement('i');
        arrowIcon.className = 'fas fa-chevron-down';
        boardToggle.appendChild(arrowIcon);
        boardHeader.appendChild(boardTitle);
        //boardHeader.appendChild(boardAdd);
        boardHeader.appendChild(boardDelete);
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
                    boardColumnTitle.setAttribute('data-status-id', statusID.status_id);
                    boardColumnTitle.setAttribute('data-board-id', board.id);
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
                                    let cardTitle = document.createElement('div');
                                    cardTitle.className = 'card-title';
                                    cardTitle.innerHTML = cards[lists][element];
                                    cardTitle.setAttribute('data-card-id', cards[lists]['id']);
                                    cardTitle.addEventListener('dblclick', renameStatus);
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
                        }, addBoardEventListener())
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
            newBoardTitle.addEventListener('dblclick', renameStatus);
            boardHeader.removeChild(saveButton);
            let oldBoardTitle = document.getElementById('newboardtitle');
            boardHeader.removeChild(oldBoardTitle);
            boardHeader.appendChild(newBoardTitle);
            let boardDelete = document.createElement('i');
            boardDelete.className = 'fas fa-trash-alt';
            boardDelete.addEventListener('click', function () {
                boardContainer.style.display = 'none';
                dataHandler.deleteBoard(parseInt(data[0].id), console.log)
            });
            boardHeader.appendChild(boardDelete);
            /*let boardAdd = document.createElement('button');
            boardAdd.className = 'board-add';
            boardAdd.innerHTML = 'Add Card';
            boardHeader.appendChild(boardAdd);*/
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
    let allColumns = document.querySelectorAll('.container');
    let allColumnsArrays = Array.from(allColumns);
    for (let i = 1; i < 5; i++) {
        window.containerArrays.push(allColumnsArrays[allColumnsArrays.length - i]);
    }
    addBoardEventListener()
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
        if (t.target.parentNode.hasAttribute('data-card-id')){
            let cardId = t.target.parentNode.getAttribute('data-card-id');
            dataHandler.editCardTitle(cardId, t.target.value);
        } else if (t.target.parentNode.hasAttribute('data-status-id')) {
            let boardId = t.target.parentNode.getAttribute('data-board-id');
            let oldStatusId = t.target.parentNode.getAttribute('data-status-id');
            dataHandler.deleteStatusFromBoard(boardId, oldStatusId);
            dataHandler.addNewStatus(boardId, t.target.value);
            dataHandler.updateStatusOfCards(boardId, oldStatusId, t.target.value);
        } else if (t.target.parentNode.hasAttribute('data-board-id')) {
            let boardId = t.target.parentNode.getAttribute('data-board-id');
            dataHandler.editBoardTitle(boardId, t.target.value);
        }
        t.target.parentNode.innerHTML = t.target.value;
    } else if (t.which === 27) { // 27 = Esc key
        t.target.parentNode.innerHTML = t.target.getAttribute('data-original');
    }
}


function saveBoardTitle(t) {
    console.log('saved?')
}

let archiveColumn = document.getElementById('archive-column')
archiveColumn.addEventListener('DOMNodeInserted', addTrashcan)

function addTrashcan() {
    let archiveCards = document.getElementById('archive-column').childNodes;
    for (let i=1; i<archiveCards.length; i++) {
        console.log(archiveCards[i].innerHTML)
        if (archiveCards[i].innerHTML.includes('<div class="card-remove"><i class="fas fa-trash-alt"></i></div>')){
            console.log(true)
        } else {
            let cardToChange = archiveCards[i]
            let currentInnerHTML = archiveCards[i].innerHTML
            cardToChange.innerHTML = `<div class="card-remove"><i class="fas fa-trash-alt"></i></div>`
            cardToChange.innerHTML += currentInnerHTML
        }
    }
    let deleteListeners = document.getElementsByClassName("card-remove")
    for (let i=0; i<deleteListeners.length; i++){
        deleteListeners[i].addEventListener('click', deleteCard)
    }
}

function addBoardEventListener() {
    let mainBoard = document.getElementsByClassName('board-column col collapse');
    console.log(mainBoard)
    for (let i = 0; i < mainBoard.length; i++) {
        mainBoard[i].addEventListener('DOMNodeInserted', removeTrashcan)
        }
}

function removeTrashcan(e){
    if (e.target.firstElementChild.outerHTML === '<div class="card-remove"><i class="fas fa-trash-alt"></i></div>'){
        console.log(e.target.innerHTML)
        console.log(e.target.innerHTML.length)
        let newInnerHTML = e.target.innerHTML.slice(63, e.target.innerHTML.length)
        e.target.innerHTML = newInnerHTML
    }
    eventListenerToAllCards();
}

function deleteCard(){
    this.parentNode.parentNode.removeChild(this.parentNode)
}

function eventListenerToAllCards(){
    let allCards = document.getElementsByClassName('card-title')
    for (let i=0; i<allCards.length; i++){
        allCards[i].addEventListener('dblclick', renameStatus)
    }
}

eventListenerToAllCards()
