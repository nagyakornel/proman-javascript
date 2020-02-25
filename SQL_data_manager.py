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
