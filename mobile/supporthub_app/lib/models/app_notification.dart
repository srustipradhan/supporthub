class AppNotification {
  final String id;
  final String type;
  final String title;
  final String body;
  final String? ticketId;
  final bool read;
  final DateTime createdAt;

  AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    this.ticketId,
    required this.read,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as String,
      type: json['type'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
      ticketId: json['ticketId'] as String?,
      read: json['read'] as bool? ?? false,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  bool get isTicketCreated => type == 'TICKET_CREATED';
  bool get isTicketClosed => type == 'TICKET_CLOSED';
  bool get isTicketReopened => type == 'TICKET_REOPENED';
}
