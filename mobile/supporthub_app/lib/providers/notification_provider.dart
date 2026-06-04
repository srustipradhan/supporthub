import 'package:flutter/foundation.dart';
import '../models/app_notification.dart';
import '../services/api_service.dart';
import '../services/app_notification_service.dart';

class NotificationProvider extends ChangeNotifier {
  final AppNotificationService _service;

  List<AppNotification> _items = [];
  int _unreadCount = 0;
  bool _loading = false;
  String? _error;

  NotificationProvider(ApiService api)
      : _service = AppNotificationService(api);

  List<AppNotification> get items => _items;
  int get unreadCount => _unreadCount;
  bool get isLoading => _loading;
  String? get error => _error;

  Future<void> refresh() async {
    if (_loading) return;

    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final summary = await _service.fetchInboxSummary();
      _items = summary.items;
      _unreadCount = summary.unreadCount;
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> markRead(String id) async {
    await _service.markRead(id);
    _items = _items
        .map((n) => n.id == id
            ? AppNotification(
                id: n.id,
                type: n.type,
                title: n.title,
                body: n.body,
                ticketId: n.ticketId,
                read: true,
                createdAt: n.createdAt,
              )
            : n)
        .toList();
    _unreadCount = _items.where((n) => !n.read).length;
    notifyListeners();
  }

  Future<void> markAllRead() async {
    await _service.markAllRead();
    _items = _items
        .map(
          (n) => AppNotification(
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.body,
            ticketId: n.ticketId,
            read: true,
            createdAt: n.createdAt,
          ),
        )
        .toList();
    _unreadCount = 0;
    notifyListeners();
  }
}
