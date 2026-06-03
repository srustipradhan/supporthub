import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../core/constants/api_constants.dart';
import 'api_service.dart';
import 'notification_service.dart';

class FcmService {
  final ApiService _api;

  FcmService(this._api);

  /// Sends device FCM token to backend (requires JWT).
  Future<void> syncToken() async {
    if (!NotificationService().isReady) {
      debugPrint('FcmService: notifications not ready');
      return;
    }

    final fcmToken = await NotificationService().getToken();
    if (fcmToken == null || fcmToken.isEmpty) {
      debugPrint('FcmService: no FCM token from Firebase');
      return;
    }

    try {
      await _api.client.patch(
        ApiConstants.usersFcmToken,
        data: {'token': fcmToken},
      );
      if (kDebugMode) {
        debugPrint('FcmService: token registered with backend');
      }
    } on DioException catch (e) {
      debugPrint('FcmService: register failed — ${_api.getErrorMessage(e)}');
    }
  }

  Future<void> clearToken() async {
    try {
      await _api.client.patch(
        ApiConstants.usersFcmToken,
        data: {'token': null},
      );
    } on DioException catch (e) {
      debugPrint('FcmService: clear failed — ${_api.getErrorMessage(e)}');
    }
  }
}
