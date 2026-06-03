import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import 'api_service.dart';

class NotificationTestService {
  final ApiService _api;

  NotificationTestService(this._api);

  Future<String> sendTestPush() async {
    try {
      final response =
          await _api.client.post(ApiConstants.notificationsTest);
      final data = response.data;
      if (data is Map && data['message'] is String) {
        return data['message'] as String;
      }
      return 'Test notification sent';
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw 'Server is missing the notifications API. Redeploy the latest backend to Render (git push origin main), then try again.';
      }
      if (e.response?.statusCode == 503) {
        throw 'Push is not configured on the server. Add FIREBASE_SERVICE_ACCOUNT_JSON on Render and redeploy.';
      }
      throw _api.getErrorMessage(e);
    }
  }
}
