from flask import Flask, render_template, url_for, request, redirect, send_from_directory, session, escape, jsonify
from util import json_response

import data_handler
import util
import SQL_data_manager

app = Flask(__name__)
# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    try:
        user = session['username']
    except KeyError:
        user = None
    return render_template('index.html', user=user)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        hashed_password = util.hash_password(request.form['password'])
        SQL_data_manager.register_user(request.form['username'], hashed_password)
        session['username'] = request.form['username']
        return redirect('/')
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        plain_text_password = request.form['password']
        user_name = request.form['username']
        user_hashed_password = SQL_data_manager.get_user_password(user_name)
        if user_hashed_password is not None:
            if util.validate_password(plain_text_password, user_hashed_password):
                session['username'] = user_name
                print(session)
        return redirect('/')
    return render_template('login.html')


@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    print(session)
    return redirect('/')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    try:
        user = session['username']
        user_id = SQL_data_manager.get_user_id_by_username(user)
    except KeyError:
        user_id = 0
    return SQL_data_manager.get_all_boards(user_id)


@app.route("/get-board-by-id/<int:board_id>")
@json_response
def get_board_by_id_main(board_id: int):
    """
    Returns board with given ID
    """
    return SQL_data_manager.get_board_by_id(board_id)


@app.route("/get-status-by-id/<int:status_id>")
@json_response
def get_status_by_id_main(status_id: int):
    """
    Returns status by status id
    """
    return SQL_data_manager.get_status_by_id(status_id)


@app.route("/get-card-by-id/<int:card_id>")
@json_response
def get_card_by_id_main(card_id: int):
    """
    Returns card by card id
    """
    return SQL_data_manager.get_card_by_id(card_id)


@app.route("/get-statuses")
@json_response
def get_statuses():
    return SQL_data_manager.get_statuses()


@app.route("/create-new-board/<board_title>/<publicity>")
@json_response
def create_board(board_title: str, publicity):
    try:
        user = session['username']
        user_id = SQL_data_manager.get_user_id_by_username(user)
    except KeyError:
        user_id = 1

    return SQL_data_manager.create_board(board_title, publicity, user_id)


@app.route("/get-cards-by-board/<int:board_id>/<int:status_id>")
@json_response
def get_cards_by_board(board_id: int, status_id: int):
    return SQL_data_manager.get_cards_by_board(board_id, status_id)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route('/create-card/<cardTitle>/<int:boardId>/<int:statusId>')
@json_response
def create_new_card_main(cardTitle, boardId: int, statusId: int):
    """
    Creates new card and returns the new cards data
    """
    return SQL_data_manager.create_new_card(cardTitle, boardId, statusId)


@app.route('/create-status/<statusTitle>/<int:boardId>')
@json_response
def new_status(statusTitle, boardId: int):
    """
    Adding new status(column) to board, existing or new
    """
    return SQL_data_manager.create_status(statusTitle, boardId)


@app.route('/get-status-by-board/<int:boardId>')
@json_response
def get_statuses_by_board(boardId: int):
    return SQL_data_manager.get_status_by_board(boardId)


@app.route('/edit-card-title/<cardId>/<newCardTitle>')
@json_response
def edit_card_title(cardId: int, newCardTitle):
    return SQL_data_manager.edit_card_title(cardId, newCardTitle)


@app.route('/edit-board-title/<boardId>/<newBoardTitle>')
@json_response
def edit_board_title(boardId: int, newBoardTitle):
    return SQL_data_manager.edit_board_title(boardId, newBoardTitle)


@app.route('/edit-status-title/<statusId>/<newStatusTitle>')
@json_response
def edit_status_title(statusId: int, newStatusTitle):
    return SQL_data_manager.edit_card_title(statusId, newStatusTitle)


@app.route('/delete-card/<cardId>')
@json_response
def delete_card(cardId: int):
    return SQL_data_manager.delete_card(cardId)


@app.route('/archive-card/<cardId>')
@json_response
def archive_card(cardId: int):
    return SQL_data_manager.archive_card(cardId)


@app.route('/delete-board/<boardId>')
@json_response
def delete_board(boardId: int):
    return SQL_data_manager.delete_board(boardId)


@app.route('/delete-status/<statusId>')
@json_response
def delete_status(statusId: int):
    return SQL_data_manager.delete_status(statusId)


@app.route('/is-archived/<cardId>')
@json_response
def is_archived(cardId: int):
    return SQL_data_manager.is_archived(cardId)


def main():
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True,
    )

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
