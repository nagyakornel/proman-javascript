import connection


@connection.connection_handler
def register_user(cursor, user_name, user_password):
    cursor.execute("""
    INSERT INTO users
    (user_name, password)
    VALUES (%(user_name)s, %(user_password)s);
    """,
                   {'user_name': user_name, 'user_password': user_password})


@connection.connection_handler
def get_user_password(cursor, user_name):
    cursor.execute("""
    SELECT password FROM users
    WHERE user_name=%(user_name)s;
    """, {'user_name': user_name})
    user_password = cursor.fetchall()
    if len(user_password) > 0:
        return user_password[0]['password']
    else:
        pass


@connection.connection_handler
def get_all_boards(cursor):
    cursor.execute("""
    SELECT * FROM boards;
    """)
    boards = cursor.fetchall()
    return boards

@connection.connection_handler
def get_board_by_id(cursor, board_id):
    cursor.execute("""
    SELECT * FROM boards
    WHERE id = %(board_id)s;
    """, {'board_id': board_id})
    boards = cursor.fetchall()
    return boards

@connection.connection_handler
def get_status_by_id(cursor, status_id):
    cursor.execute("""
    SELECT title FROM statuses
    WHERE id = %(status_id)s;
    """, {'status_id': status_id})
    status = cursor.fetchall()
    return status

@connection.connection_handler
def get_card_by_id(cursor, card_id):
    cursor.execute("""
    SELECT title FROM statuses
    WHERE id = %(card_id)s;
    """, {'card_id': card_id})
    card = cursor.fetchall()
    return card


@connection.connection_handler
def create_new_card(cursor, card_title, board_id, status_id):

    cursor.execute("""
    INSERT INTO cards (board_id, title, status_id)
    VALUES (%(board_id)s, %(title)s, %(status_id)s);
    """, {'board_id': board_id, 'title': card_title, 'status_id': status_id})


    cursor.execute("""
    SELECT * FROM cards
    WHERE board_id = %(board_id)s AND title = %(title)s AND status_id = %(status_id)s;
    """, {'board_id': board_id, 'title': card_title, 'status_id': status_id})

    new_card = cursor.fetchall()

    return  new_card

@connection.connection_handler
def get_statuses(cursor):
    cursor.execute("""
                    SELECT * FROM statuses
                    """)
    statuses = cursor.fetchall()

    return statuses


@connection.connection_handler
def get_cards_by_board(cursor, board_id):
    cursor.execute("""
                    SELECT * FROM cards
                    WHERE board_id = %(id)s;
                    """, {"id": board_id})

    cards = cursor.fetchall()
    return cards


@connection.connection_handler
def create_board(cursor, board_title):
    cursor.execute("""
                    INSERT INTO boards(title,user_id,public)
                    VALUES (%(title)s,%(user_id)s,%(public)s);
                    """, {"title": board_title, "used_id": 1, "public": True})
    cursor.execute("""
                    SELECT * FROM boards
                    WHERE title = %(title)s;
                    """, {"title": board_title})

    board = cursor.fetchall()

    return board
