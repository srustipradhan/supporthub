import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../firebase_options.dart';
import 'api_service.dart';
import 'fcm_service.dart';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  if (Firebase.apps.isEmpty) {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  }
  await NotificationService.showMessageNotification(message);
  debugPrint('FCM background message: ${message.messageId}');
}

/// Push notifications — must run after [Firebase.initializeApp] in [main].
class NotificationService {
  static final NotificationService _instance = NotificationService._();
  factory NotificationService() => _instance;
  NotificationService._();

  static const String channelId = 'supporthub_channel';

  static bool _backgroundHandlerRegistered = false;

  FirebaseMessaging? _messaging;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  bool get isReady => _messaging != null;

  Future<void> initialize() async {
    if (Firebase.apps.isEmpty) {
      debugPrint(
        'NotificationService: skipped — call Firebase.initializeApp() in main() first',
      );
      return;
    }

    _messaging = FirebaseMessaging.instance;

    if (!_backgroundHandlerRegistered) {
      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
      _backgroundHandlerRegistered = true;
    }

    await _setupLocalNotifications();
    await _requestPermission();

    FirebaseMessaging.onMessage.listen(_showForegroundNotification);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);
    _messaging!.onTokenRefresh.listen((_) {
      debugPrint('FCM token refreshed');
      final api = _pendingApiForTokenSync;
      if (api != null) {
        FcmService(api).syncToken();
      }
    });

    final initial = await _messaging!.getInitialMessage();
    if (initial != null) _handleNotificationTap(initial);

    final token = await getToken();
    if (kDebugMode && token != null) {
      debugPrint('FCM token: ${token.substring(0, 20)}...');
    }
    if (kDebugMode) {
      debugPrint('NotificationService initialized');
    }
  }

  ApiService? _pendingApiForTokenSync;

  void attachApiForTokenSync(ApiService api) {
    _pendingApiForTokenSync = api;
  }

  Future<void> _setupLocalNotifications() async {
    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    await _localNotifications.initialize(
      const InitializationSettings(
        android: androidSettings,
        iOS: iosSettings,
      ),
      onDidReceiveNotificationResponse: (_) {},
    );

    final androidPlugin = _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();
    await androidPlugin?.createNotificationChannel(
      const AndroidNotificationChannel(
        channelId,
        'SupportHub Notifications',
        description: 'Ticket replies and updates',
        importance: Importance.high,
      ),
    );
  }

  Future<void> _requestPermission() async {
    final messaging = _messaging;
    if (messaging == null) return;
    final settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    if (kDebugMode) {
      debugPrint('FCM permission: ${settings.authorizationStatus}');
    }
  }

  Future<String?> getToken() async {
    final messaging = _messaging;
    if (messaging == null) return null;
    return messaging.getToken();
  }

  void _showForegroundNotification(RemoteMessage message) {
    unawaited(
      showMessageNotification(message, plugin: _localNotifications),
    );
  }

  /// Shared foreground/background display logic.
  static Future<void> showMessageNotification(
    RemoteMessage message, {
    FlutterLocalNotificationsPlugin? plugin,
  }) async {
    final notifications = plugin ?? FlutterLocalNotificationsPlugin();

    if (plugin == null) {
      const androidSettings =
          AndroidInitializationSettings('@mipmap/ic_launcher');
      await notifications.initialize(
        const InitializationSettings(android: androidSettings),
      );
      final androidPlugin = notifications
          .resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>();
      await androidPlugin?.createNotificationChannel(
        const AndroidNotificationChannel(
          channelId,
          'SupportHub Notifications',
          importance: Importance.high,
        ),
      );
    }

    final notification = message.notification;
    final title = notification?.title ??
        message.data['title'] ??
        'SupportHub';
    final body = notification?.body ??
        message.data['body'] ??
        message.data['content'] ??
        'New message';

    await notifications.show(
      message.hashCode,
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelId,
          'SupportHub Notifications',
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: const DarwinNotificationDetails(),
      ),
    );
  }

  void _handleNotificationTap(RemoteMessage message) {
    debugPrint('Notification tapped: ${message.data}');
  }
}
