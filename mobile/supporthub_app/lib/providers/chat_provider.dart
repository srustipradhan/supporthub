import 'package:flutter/foundation.dart';
import '../models/message.dart';
import '../services/api_service.dart';
import '../services/message_service.dart';
import '../services/socket_service.dart';

class ChatProvider extends ChangeNotifier {
  final MessageService _messageService;
  final SocketService _socketService;

  List<Message> _messages = [];
  bool _isLoading = false;
  String? _error;
  String? _currentTicketId;

  ChatProvider(ApiService api, this._socketService)
      : _messageService = MessageService(api);

  List<Message> get messages => _messages;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadMessages(String ticketId) async {
    _currentTicketId = ticketId;
    _isLoading = true;
    notifyListeners();
    try {
      _messages = await _messageService.getHistory(ticketId);
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void joinTicket(String ticketId, String token) {
    _socketService.connect(token);
    _socketService.joinTicket(ticketId);
    _socketService.offNewMessage();
    _socketService.onNewMessage((message) {
      if (message.ticketId == ticketId) {
        if (!_messages.any((m) => m.id == message.id)) {
          _messages.add(message);
          notifyListeners();
        }
      }
    });
  }

  void leaveTicket(String ticketId) {
    _socketService.leaveTicket(ticketId);
    _socketService.offNewMessage();
    _currentTicketId = null;
  }

  Future<void> sendMessage(String ticketId, String content) async {
    if (content.trim().isEmpty) return;
    _socketService.sendMessage(ticketId, content.trim());
  }

  @override
  void dispose() {
    if (_currentTicketId != null) {
      _socketService.leaveTicket(_currentTicketId!);
    }
    super.dispose();
  }
}
