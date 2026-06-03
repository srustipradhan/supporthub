import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/config/app_config.dart';
import '../models/message.dart';

class SocketService {
  io.Socket? _socket;
  final List<void Function()> _readyCallbacks = [];

  void connect(String token) {
    if (_socket?.connected == true) return;

    _socket?.dispose();

    _socket = io.io(
      '${AppConfig.wsBaseUrl}/chat',
      io.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .build(),
    );

    _socket!.onConnect((_) {
      if (kDebugMode) {
        debugPrint('Socket connected (${AppConfig.wsBaseUrl}/chat)');
      }
      final pending = List<void Function()>.from(_readyCallbacks);
      _readyCallbacks.clear();
      for (final cb in pending) {
        cb();
      }
    });

    _socket!.onConnectError((err) {
      if (kDebugMode) {
        debugPrint('Socket connect error: $err');
      }
    });

    _socket!.onDisconnect((_) {
      if (kDebugMode) {
        debugPrint('Socket disconnected');
      }
    });
  }

  void whenReady(void Function() callback) {
    if (_socket?.connected == true) {
      callback();
      return;
    }
    _readyCallbacks.add(callback);
  }

  void disconnect() {
    _readyCallbacks.clear();
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
