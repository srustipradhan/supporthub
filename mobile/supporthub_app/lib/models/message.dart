import 'user.dart';

class Message {
  final String id;
  final String ticketId;
  final String senderId;
  final String content;
  final DateTime createdAt;
  final User? sender;

  Message({
    required this.id,
    required this.ticketId,
    required this.senderId,
    required this.content,
    required this.createdAt,
    this.sender,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] as String,
      ticketId: json['ticketId'] as String,
      senderId: json['senderId'] as String,
      content: json['content'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      sender: json['sender'] != null
          ? User.fromJson(json['sender'] as Map<String, dynamic>)
          : null,
    );
  }
}
