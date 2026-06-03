import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

/// Logs Dio request/response/errors in debug builds.
class ApiLoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (kDebugMode) {
      debugPrint('─── API REQUEST ───');
      debugPrint('${options.method} ${options.uri}');
      if (options.data != null) debugPrint('Body: ${options.data}');
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (kDebugMode) {
      debugPrint('─── API RESPONSE ───');
      debugPrint('${response.statusCode} ${response.requestOptions.uri}');
      debugPrint('Data: ${response.data}');
    }
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (kDebugMode) {
      debugPrint('─── API ERROR ───');
      debugPrint('${err.requestOptions.method} ${err.requestOptions.uri}');
      debugPrint('Type: ${err.type} | Message: ${err.message}');
      if (err.response != null) {
        debugPrint('Status: ${err.response?.statusCode}');
        debugPrint('Body: ${err.response?.data}');
      }
    }
    handler.next(err);
  }
}
