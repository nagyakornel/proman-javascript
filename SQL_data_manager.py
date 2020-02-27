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
def get_all_boards(cursor, user_id):
    cursor.execute("""
    SELECT * FROM boards
    WHERE public = true OR user_id = %(user_id)s;
    """, {'user_id': user_id})
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
    SELECT * FROM cards
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

    return new_card


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute("""
                    SELECT * FROM statuses
                    """)
    statuses = cursor.fetchall()

    return statuses


@connection.connection_handler
def get_cards_by_board(cursor, board_id, status_id):
    cursor.execute("""
                    SELECT * FROM cards
                    WHERE board_id = %(id)s AND status_id = %(status_id)s;
                    """, {"id": board_id, "status_id": status_id})

    cards = cursor.fetchall()
    return cards


@connection.connection_handler
def get_archived_cards_by_board(cursor, board_id):
    cursor.execute("""
                    SELECT * FROM cards
                    WHERE board_id = %(id)s AND archived = true;
                    """, {"id": board_id})

    cards = cursor.fetchall()
    return cards


@connection.connection_handler
def create_board(cursor, board_title, publicity, user_id):
    cursor.execute("""
                    INSERT INTO boards(title,user_id,public)
                    VALUES (%(title)s,%(user_id)s,%(public)s);
                    """, {"title": board_title, "user_id": user_id, "public": publicity})
    cursor.execute("""
                    SELECT * FROM boards
                    WHERE title = %(title)s;
                    """, {"title": board_title})

    board = cursor.fetchall()

    def columns_to_new_boards(status_id):
        cursor.execute("""
        INSERT INTO boards_statuses (board_id, status_id) 
        VALUES (%(board_id)s, %(status_id)s);
        """, {'board_id': board[0]['id'], 'status_id': status_id})

    for i in range(1, 5):
        columns_to_new_boards(i)

    return board


# creates new status if it doesnt exist
@connection.connection_handler
def create_status(cursor, statusTitle, boardId):
    cursor.execute("""
    SELECT * FROM statuses
    WHERE title = %(statusTitle)s;
    """, {'statusTitle': statusTitle})
    existing_status = cursor.fetchall()
    status_id = existing_status[0]['id']
    if len(existing_status) == 0:
        cursor.execute("""
        INSERT INTO statuses (title)
        VALUES (%(statusTitle)s);
        """, {'statusTitle': statusTitle})
        cursor.execute("""
        SELECT * FROM statuses
        WHERE title = %(statusTitle)s;
        """, {'statusTitle': statusTitle})
        new_status = cursor.fetchall()
        status_id = new_status[0]['id']

    cursor.execute("""
    INSERT INTO boards_statuses (board_id, status_id)
    VALUES (%(boardId)s, %(status_id)s);
    """, {'boardId': boardId, 'status_id': status_id})


@connection.connection_handler
def get_status_by_board(cursor, boardId):
    cursor.execute("""
    SELECT * FROM boards_statuses
    WHERE board_id = %(boardId)s;
    """, {'boardId': boardId})
    statuses = cursor.fetchall()
    return statuses


@connection.connection_handler
def get_user_id_by_username(cursor, username):
    cursor.execute("""
    SELECT * FROM users
    WHERE user_name = %(username)s;
    """, {'username': username})

    user = cursor.fetchall()
    return user[0]['id']


@connection.connection_handler
def edit_card_title(cursor, cardId, newCardTitle):
    cursor.execute("""
    UPDATE cards
    SET title = %(newCardTitle)s
    WHERE id = %(cardId)s;
    """, {"newCardTitle": newCardTitle, "cardId": cardId})


@connection.connection_handler
def edit_board_title(cursor, boardId, newBoardTitle):
    cursor.execute("""
    UPDATE boards
    SET title = %(newBoardTitle)s
    WHERE id = %(boardId)s;
    """, {"newBoardTitle": newBoardTitle, "boardId": boardId})


@connection.connection_handler
def edit_status_title(cursor, statusId, newStatusTitle):
    cursor.execute("""
    UPDATE statuses
    SET title = %(newStatusTitle)s
    WHERE id = %(statusId)s;
    """, {"newStatusTitle": newStatusTitle, "statusId": statusId})


@connection.connection_handler
def delete_card(cursor, cardId):
    cursor.execute("""
    DELETE FROM cards
    WHERE id = %(cardId)s;
            """, {"cardId": cardId})


@connection.connection_handler
def archive_card(cursor, cardId):
    cursor.execute("""
    UPDATE cards
    SET archived = True
    WHERE id = %(cardId)s
            """, {"cardId": cardId})


@connection.connection_handler
def restore_card(cursor, cardId):
    cursor.execute("""
    UPDATE cards
    SET archived = False
    WHERE id = %(cardId)s
            """, {"cardId": cardId})


@connection.connection_handler
def delete_board(cursor, boardId):
    cursor.execute("""
    DELETE FROM boards
    WHERE id = %(boardId)s;
            """, {"boardId": boardId})


@connection.connection_handler
def delete_status(cursor, statusId):
    cursor.execute("""
    DELETE FROM statuses
    WHERE id = %(statusId)s;
            """, {"statusId": statusId})


@connection.connection_handler
def is_archived(cursor, cardId):
    cursor.execute("""
    SELECT archived FROM cards
    WHERE id = %(cardId)s
    """, {"cardId": cardId})

    archived = cursor.fetchall()

    return archived
