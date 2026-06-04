import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../models/app_notification.dart';
import 'api_service.dart';

class InboxSummary {
  final List<AppNotification> items;
  final int unreadCount;

  InboxSummary({required this.items, required this.unreadCount});
}

class AppNotificationService {
  final ApiService _api;

  AppNotificationService(this._api);

  Future<InboxSummary> fetchInboxSummary() async {
    try {
      final response = await _api.client.get(ApiConstants.notificationsInbox);
      final data = response.data as Map<String, dynamic>;
      final items = (data['items'] as List)
          .map((n) => AppNotification.fromJson(n as Map<String, dynamic>))
          .toList();
      return InboxSummary(
        items: items,
        unreadCount: data['unreadCount'] as int? ?? 0,
      );
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<void> markRead(String id) async {
    try {
      await _api.client.patch(ApiConstants.notificationMarkRead(id));
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<void> markAllRead() async {
    try {
      await _api.client.patch(ApiConstants.notificationsReadAll);
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }
}
