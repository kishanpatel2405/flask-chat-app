from flask import Blueprint, jsonify

from models import Message  # Import Message model

chat_api = Blueprint("chat_api", __name__)


@chat_api.route("/messages/<room>", methods=["GET"])
def get_messages(room):
    messages = Message.query.filter_by(room=room).order_by(Message.timestamp.asc()).all()
    if not messages:
        return jsonify([]), 200
    return jsonify([
        {"username": msg.username, "message": msg.message, "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S")}
        for msg in messages
    ])
