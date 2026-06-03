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
  bool _isSending = false;
  String? _error;
  String? _currentTicketId;

  ChatProvider(ApiService api, this._socketService)
      : _messageService = MessageService(api);

  List<Message> get messages => _messages;
  bool get isLoading => _isLoading;
  bool get isSending => _isSending;
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
    _socketService.whenReady(() {
      _socketService.joinTicket(ticketId);
    });
    _socketService.offNewMessage();
    _socketService.onNewMessage((message) {
      if (message.ticketId == ticketId) {
        _addMessageIfNew(message);
      }
    });
  }

  void leaveTicket(String ticketId) {
    _socketService.leaveTicket(ticketId);
    _socketService.offNewMessage();
    _currentTicketId = null;
  }

  Future<bool> sendMessage(String ticketId, String content) async {
    final trimmed = content.trim();
    if (trimmed.isEmpty) return false;

    _isSending = true;
    _error = null;
    notifyListeners();

    try {
      final message = await _messageService.sendMessage(
        ticketId: ticketId,
        content: trimmed,
      );
      _addMessageIfNew(message);
      _isSending = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isSending = false;
      notifyListeners();
      if (kDebugMode) {
        debugPrint('ChatProvider send failed: $e');
      }
      return false;
    }
  }

  void _addMessageIfNew(Message message) {
    if (!_messages.any((m) => m.id == message.id)) {
      _messages.add(message);
      notifyListeners();
    }
  }

  @override
  void dispose() {
    if (_currentTicketId != null) {
      _socketService.leaveTicket(_currentTicketId!);
      _socketService.offNewMessage();
    }
    super.dispose();
  }
}
