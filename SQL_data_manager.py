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
