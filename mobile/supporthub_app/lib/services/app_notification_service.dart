import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../models/app_notification.dart';
import 'api_service.dart';

class AppNotificationService {
  final ApiService _api;

  AppNotificationService(this._api);

  Future<List<AppNotification>> fetchInbox() async {
    try {
      final response = await _api.client.get(ApiConstants.notificationsInbox);
      return (response.data as List)
          .map((n) => AppNotification.fromJson(n as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<int> fetchUnreadCount() async {
    try {
      final response =
          await _api.client.get(ApiConstants.notificationsUnreadCount);
      return (response.data as Map<String, dynamic>)['count'] as int? ?? 0;
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
