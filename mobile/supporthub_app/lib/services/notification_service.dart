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
  await NotificationService.showPushNotification(message);
  debugPrint('FCM background message: ${message.messageId}');
}

/// Push notifications — must run after [Firebase.initializeApp] in [main].
class NotificationService {
  static final NotificationService _instance = NotificationService._();
  factory NotificationService() => _instance;
  NotificationService._();

  static const String messageChannelId = 'supporthub_channel';
  static const String ticketChannelId = 'supporthub_tickets_channel';

  static bool _backgroundHandlerRegistered = false;

  /// Called when a ticket lifecycle push arrives (created/closed/reopened).
  static VoidCallback? onTicketPush;

  FirebaseMessaging? _messaging;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  bool get isReady => _messaging != null;

  static bool isTicketNotification(RemoteMessage message) {
    final category = message.data['category'];
    if (category == 'ticket') return true;
    final type = message.data['type'] ?? '';
    return type.startsWith('ticket_');
  }

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
        messageChannelId,
        'Chat messages',
        description: 'New replies in support conversations',
        importance: Importance.high,
      ),
    );
    await androidPlugin?.createNotificationChannel(
      const AndroidNotificationChannel(
        ticketChannelId,
        'Ticket updates',
        description: 'Ticket created, closed, or reopened',
        importance: Importance.high,
      ),
    );

    final notificationsGranted =
        await androidPlugin?.requestNotificationsPermission();
    if (kDebugMode) {
      debugPrint('Android POST_NOTIFICATIONS granted: $notificationsGranted');
    }
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
    if (isTicketNotification(message)) {
      onTicketPush?.call();
    }
    unawaited(
      showPushNotification(message, plugin: _localNotifications),
    );
  }

  /// Shared foreground/background display logic.
  static Future<void> showPushNotification(
    RemoteMessage message, {
    FlutterLocalNotificationsPlugin? plugin,
  }) async {
    final notifications = plugin ?? FlutterLocalNotificationsPlugin();
    final isTicket = isTicketNotification(message);
    final channelId = isTicket ? ticketChannelId : messageChannelId;
    final channelName =
        isTicket ? 'Ticket updates' : 'Chat messages';

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
        AndroidNotificationChannel(
          channelId,
          channelName,
          importance: Importance.high,
        ),
      );
    }

    final notification = message.notification;
    final title = notification?.title ??
        message.data['title'] ??
        (isTicket ? 'Ticket update' : 'SupportHub');
    final body = notification?.body ??
        message.data['body'] ??
        message.data['content'] ??
        (isTicket ? 'Your ticket status changed' : 'New message');

    await notifications.show(
      message.hashCode,
      title,
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelId,
          channelName,
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: const DarwinNotificationDetails(),
      ),
    );
  }

  void _handleNotificationTap(RemoteMessage message) {
    debugPrint('Notification tapped: ${message.data}');
    if (isTicketNotification(message)) {
      onTicketPush?.call();
    }
  }
}
