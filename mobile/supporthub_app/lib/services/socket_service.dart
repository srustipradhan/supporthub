import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/config/app_config.dart';
import '../models/message.dart';

class SocketService {
  io.Socket? _socket;

  void connect(String token) {
    if (_socket?.connected == true) return;

    _socket = io.io(
      '${AppConfig.wsBaseUrl}/chat',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .build(),
    );
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }

  void joinTicket(String ticketId) {
    _socket?.emit('join_ticket', {'ticketId': ticketId});
  }

  void leaveTicket(String ticketId) {
    _socket?.emit('leave_ticket', {'ticketId': ticketId});
  }

  void sendMessage(String ticketId, String content) {
    _socket?.emit('send_message', {
      'ticketId': ticketId,
      'content': content,
    });
  }

  void onNewMessage(void Function(Message message) callback) {
    _socket?.on('new_message', (data) {
      if (data is Map<String, dynamic>) {
        callback(Message.fromJson(data));
      } else if (data is Map) {
        callback(Message.fromJson(Map<String, dynamic>.from(data)));
      }
    });
  }

  void offNewMessage() {
    _socket?.off('new_message');
  }
}
