import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../models/auth_response.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService {
  final ApiService _api;
  final StorageService _storage = StorageService();

  AuthService(this._api);

  Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _api.client.post(
        ApiConstants.authRegister,
        data: {'name': name, 'email': email, 'password': password},
      );
      final auth = AuthResponse.fromJson(response.data as Map<String, dynamic>);
      await _persist(auth);
      return auth;
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _api.client.post(
        ApiConstants.authLogin,
        data: {'email': email, 'password': password},
      );
      final auth = AuthResponse.fromJson(response.data as Map<String, dynamic>);
      await _persist(auth);
      return auth;
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<void> logout() async {
    await _storage.clear();
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.getToken();
    return token != null;
  }

  Future<void> _persist(AuthResponse auth) async {
    await _storage.saveToken(auth.accessToken);
    await _storage.saveUser(auth.user);
  }
}
