"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# get user by user name
@api.route('/user/<user_email>', methods=['POST'])
def handle_single_user(user_email):

    request_body = request.json
    request_password = request_body["password"]

    user = User.query.filter_by(email=user_email).first()
    if user is None:
        response_body = "User does not exist"
        return jsonify(response_body), 403
    else:
        user_password = user.password        
        if user_password == request_password:
            response_body = user.serialize()
            return jsonify(response_body), 200
        else:
            response_body = "Invalid password"
            return jsonify(response_body), 403
    
    # sign up new user

@api.route('/user/adduser/<user_email>', methods=['POST'])

def handle_new_user(user_email):

    request_body = request.json

    user = User.query.filter_by(email=user_email).first()
    if user is None:
        new_user = User(
            email = user_email, 
            password = request_body["password"],
            is_active = False
        )
        db.session.add(new_user)
        db.session.commit()

        return_user = User.query.filter_by(email=user_email).first()
        response_body = return_user.serialize()


        return_user = User.query.filter_by(email=user_email).first()
        # return new user created success message, 200
        return jsonify({
                "msg": f'New user {new_user} has been created!',
                "results": response_body                
                }), 200

    else:
        response_body = "User already exists!"
        return jsonify(response_body), 403

# Create new todo task with POST below
    
@api.route('/todos/<int:user_id>', methods=['POST'])

def handle_new_todo(user_id):
    request_body = request.json
    new_task = Task(task = request_body["task"],
                    user_id = user_id,
                    done = request_body["done"]
                    )    
    db.session.add(new_task)
    db.session.commit()

    user_tasks = Task.query.filter_by(user_id=user_id)
    user_updated_tasks = list(map(lambda x: x.serialize(), user_tasks))

    # return jsonify(response_body), 200
    return jsonify(user_updated_tasks), 200

@api.route('/todos/user/<int:user_id>', methods=['GET'])

def handle_single_user_todos(user_id):

    get_user_tasks = Task.query.filter_by(user_id =user_id)
    all_user_tasks = list(map(lambda x: x.serialize(), get_user_tasks))

    response_body = all_user_tasks

    return jsonify(response_body), 200

# Delete a specific todo ID with DELETE method
@api.route('/todos/user/<int:user_id>/<int:todo_id>', methods=['DELETE'])

def handle_delete_todo(user_id, todo_id):
    del_todo = Task.query.get(todo_id)
    db.session.delete(del_todo)
    db.session.commit()

    user_todos = Task.query.filter_by(user_id=user_id)

    updated_todos = list(map(lambda x: x.serialize(), user_todos))

    return jsonify({
                "msg": f'{del_todo} has been deleted',
                "results": updated_todos
                
                }), 200

# Mark a specific todo ID as "Done"
@api.route('/todos/user/<int:user_id>/<int:todo_id>', methods=['PUT'])

def handle_done_toggle(user_id, todo_id):
    request_body = request.json
    done_status = request_body["done"]
    current_todo = Task.query.get(todo_id)
    current_todo.done = done_status
    # potentially a different way to do it below with the "update" method sqlalchemy
    # done_todo = Task.query.filter_by(id=todo_id).update({"done": done_status })
    # done_todo.update({"done": done_status})
    # Task.query.filter_by(todo_id).update({"done": done_status })
    # db.session.done_task.update(done_status)
    db.session.commit()

    user_todos = Task.query.filter_by(user_id=user_id)

    updated_todos = list(map(lambda x: x.serialize(), user_todos))

    return jsonify({
                "msg": f'{current_todo} done status has been updated',
                "results": updated_todos
                
                }), 200


# Looup all todos commented out below Must use the admin backend to see them
# as we shouldn't return all todos for all users to see
# @api.route('/todos', methods=['GET'])
# def lookup_all_todos():

#     all_todos = Task.query.all()

#     response_body = list(map(lambda x: x.serialize(), all_todos))

#     return jsonify(response_body), 200
