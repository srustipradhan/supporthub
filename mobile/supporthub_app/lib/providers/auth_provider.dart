import 'package:flutter/foundation.dart';
import '../core/config/app_config.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/fcm_service.dart';
import '../services/notification_service.dart';
import '../services/socket_service.dart';
import '../services/storage_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;
  final StorageService _storage = StorageService();
  final SocketService _socketService;

  User? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;

  AuthProvider(ApiService api, this._socketService)
      : _authService = AuthService(api),
        _api = api,
        _fcmService = FcmService(api) {
    _syncPushIfLoggedIn();
  }

  final ApiService _api;
  final FcmService _fcmService;

  /// Register FCM token when app restarts with a stored JWT.
  Future<void> _syncPushIfLoggedIn() async {
    final storedToken = await _storage.getToken();
    if (storedToken == null) return;
    NotificationService().attachApiForTokenSync(_api);
    await _fcmService.syncToken();
  }

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _token != null;

  Future<bool> checkAuth() async {
    if (AppConfig.bypassStartupDependencies) {
      return false;
    }

    _isLoading = true;
    notifyListeners();
    try {
      final storedToken = await _storage.getToken();
      if (storedToken == null) return false;

      final storedUser = await _storage.getUser();
      _token = storedToken;
      _user = storedUser;
      _socketService.connect(storedToken);
      await _registerPush();
    } catch (e, st) {
      debugPrint('checkAuth failed: $e\n$st');
      _token = null;
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return _token != null;
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    try {
      final auth = await _authService.login(email: email, password: password);
      _token = auth.accessToken;
      _user = auth.user;
      _socketService.connect(auth.accessToken);
      await _registerPush();
      _error = null;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _setLoading(true);
    try {
      final auth =
          await _authService.register(name: name, email: email, password: password);
      _token = auth.accessToken;
      _user = auth.user;
      _socketService.connect(auth.accessToken);
      await _registerPush();
      _error = null;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    await _fcmService.clearToken();
    await _authService.logout();
    _socketService.disconnect();
    _token = null;
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  Future<void> _registerPush() async {
    NotificationService().attachApiForTokenSync(_api);
    await _fcmService.syncToken();
  }
}
