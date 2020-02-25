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
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    print("works")
    if request.method == 'POST':
        hashed_password = util.hash_password(request.form['password'])
        SQL_data_manager.register_user(request.form['username'], hashed_password)
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
    return data_handler.get_boards()


@app.route("/get-statuses")
@json_response
def get_statuses():
    return SQL_data_manager.get_statuses()


@app.route("/create-new-board/<board_title>")
@json_response
def create_board(board_title: str):
    return SQL_data_manager.create_board(board_title)


@app.route("/get-cards-by-board/<board_id>")
@json_response
def get_cards_by_board(board_id: int):
    return SQL_data_manager.get_cards_by_board(board_id)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


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
