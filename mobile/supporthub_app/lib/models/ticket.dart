import 'message.dart';
import 'user.dart';

class Ticket {
  final String id;
  final String title;
  final String description;
  final String status;
  final String userId;
  final DateTime createdAt;
  final User? user;
  final List<Message>? messages;

  Ticket({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.userId,
    required this.createdAt,
    this.user,
    this.messages,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) {
    return Ticket(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      status: json['status'] as String,
      userId: json['userId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      user: json['user'] != null
          ? User.fromJson(json['user'] as Map<String, dynamic>)
          : null,
      messages: json['messages'] != null
          ? (json['messages'] as List)
              .map((m) => Message.fromJson(m as Map<String, dynamic>))
              .toList()
          : null,
    );
  }

  bool get isOpen => status == 'OPEN';
}
