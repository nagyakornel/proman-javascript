import {dataHandler} from "./data_handler.js";

dataHandler.getBoards(showBoards);
console.log(document.getElementById('copycard'));


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
        let boardShowArchive = document.createElement('button');
        boardShowArchive.className = 'board-add';
        boardShowArchive.innerHTML = 'Show archived cards';
        boardShowArchive.dataset.toggle = 'modal';
        boardShowArchive.dataset.target = '#modal-' + board.id;
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
        boardHeader.appendChild(boardShowArchive);
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
                                if (element === 'title' && cards[lists]['archived'] === false) {
                                    let card = document.createElement('div');
                                    card.className = 'card';
                                    let cardRemove = document.createElement('div');
                                    cardRemove.className = 'card-remove';
                                    let cardRemoveButton = document.createElement('i');
                                    cardRemoveButton.className = 'fas fa-trash-alt';
                                    cardRemoveButton.dataset.cardId = cards[lists].id;
                                    cardRemoveButton.addEventListener('click', archiveCard);
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
                        console.log('fut');
                        let containerNodes = document.querySelectorAll('.container');
                        let containerArrays = Array.from(containerNodes);
                        console.log(containerArrays);
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
                let modalFade = document.createElement('div');
                modalFade.className = 'modal fade';
                modalFade.id = 'modal-' + board.id;
                modalFade.tabindex = -1;
                modalFade.role = 'dialog';
                modalFade.ariaLabelledby = 'modal-title-' + board.id;
                modalFade.ariaHidden = true;
                let modalDialog = document.createElement('div');
                modalDialog.className = 'modal-dialog';
                modalDialog.role = 'document';
                let modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                let modalHeader = document.createElement('div');
                modalHeader.className = 'modal-header';
                let modalTitle = document.createElement('h5');
                modalTitle.className = 'modal-title';
                modalTitle.id = 'modal-' + board.id;
                modalTitle.innerHTML = 'Archived cards:';
                let modalBody = document.createElement('div');
                modalBody.className = 'modal-body';
                modalBody.innerHTML = 'Content';
                let modalFooter = document.createElement('div');
                modalFooter.className = 'modal-footer';
                let modalCloseButton = document.createElement('button');
                modalCloseButton.type = 'button';
                modalCloseButton.className = 'btn btn-secondary';
                modalCloseButton.dataset.dismiss = 'modal';
                modalCloseButton.innerHTML = 'Close';

                modalHeader.appendChild(modalTitle);
                modalFooter.appendChild(modalCloseButton);
                modalContent.appendChild(modalHeader);
                modalContent.appendChild(modalBody);
                modalContent.appendChild(modalFooter);
                modalDialog.appendChild(modalContent);
                modalFade.appendChild(modalDialog);
                boardContainer.appendChild(modalFade);



                document.body.appendChild(boardContainer);
            }
        }
    }
}

function archiveCard(t) {
    fetch('/archive-card/' + t.target.dataset.cardId)
        .then((response) => {
            t.target.parentNode.parentNode.remove();
        })
}

let createNewPublicBoard = document.getElementById('create-public-board');
createNewPublicBoard.addEventListener('click', function () {
    createBoard(true)
})
let createNewPrivateBoard = document.getElementById('create-private-board');
createNewPrivateBoard.addEventListener('click', function () {
    createBoard(false)
})


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
            console.log(data)
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
            let boardShowArchive = document.createElement('button');
            boardShowArchive.className = 'board-add';
            boardShowArchive.innerHTML = 'Show archived cards';
            boardHeader.appendChild(boardShowArchive);
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
            for (let title of columnTitles) {
                columnsForNewBoards(title)
            }

            function columnsForNewBoards(columnTitle) {
                let boardColumn = document.createElement('div');
                boardColumn.className = 'board-column col collapse multi-collapse' + data[0].id;
                let boardColumnTitle = document.createElement('div');
                boardColumnTitle.className = 'board-column-title';
                boardColumnTitle.innerHTML = columnTitle;
                boardColumn.appendChild(boardColumnTitle);
                let boardColumnContent = document.createElement('div');
                boardColumnContent.className = 'board-column-content container';
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
    document.body.appendChild(boardContainer)


}
