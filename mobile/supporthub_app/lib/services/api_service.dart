import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../core/config/app_config.dart';
import 'api_logging_interceptor.dart';
import 'storage_service.dart';

class ApiService {
  late final Dio _dio;
  final StorageService _storage = StorageService();

  ApiService() {
    if (kDebugMode) {
      debugPrint('SupportHub API: ${AppConfig.apiBaseUrl}');
    }

    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 60),
        receiveTimeout: const Duration(seconds: 60),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    if (kDebugMode) {
      _dio.interceptors.add(ApiLoggingInterceptor());
    }

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          if (kDebugMode) {
            debugPrint('API failed: ${getErrorMessage(error)}');
          }
          handler.next(error);
        },
      ),
    );
  }

  Dio get client => _dio;

  String getErrorMessage(DioException e) {
    if (e.response?.data is Map) {
      final data = e.response!.data as Map<String, dynamic>;
      final message = data['message'];
      if (message is List) return message.join(', ');
      if (message is String) return message;
    }

    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Request timed out (${AppConfig.apiBaseUrl}). Render may be waking up — try again.';
      case DioExceptionType.connectionError:
        return 'Cannot reach ${AppConfig.apiBaseUrl}. Check internet connection.';
      case DioExceptionType.badResponse:
        return 'Server error (${e.response?.statusCode ?? "?"}).';
      default:
        return e.message ?? 'Something went wrong';
    }
  }
}
