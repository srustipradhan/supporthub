import 'package:dio/dio.dart';
import 'api_service.dart';

/// Pings the backend during startup so Render cold starts happen in parallel.
class ApiWarmupService {
  static Future<void> ping(ApiService api) async {
    try {
      await api.client
          .get('/health')
          .timeout(const Duration(seconds: 15));
    } on DioException {
      // Cold start may still be waking; auth/data calls will retry.
    }
  }
}
