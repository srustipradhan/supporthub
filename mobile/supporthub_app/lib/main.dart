import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/config/app_config.dart';
import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/ticket_provider.dart';
import 'screens/login_screen.dart';
import 'screens/splash_screen.dart';
import 'services/api_service.dart';
import 'services/notification_service.dart';
import 'services/socket_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (!AppConfig.bypassStartupDependencies) {
    await NotificationService().initialize();
  }
  runApp(const SupportHubApp());
}

class SupportHubApp extends StatelessWidget {
  const SupportHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    final apiService = ApiService();
    final socketService = SocketService();

    return MultiProvider(
      providers: [
        Provider<ApiService>.value(value: apiService),
        Provider<SocketService>.value(value: socketService),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(apiService, socketService),
        ),
        ChangeNotifierProvider(
          create: (_) => TicketProvider(apiService),
        ),
      ],
      child: MaterialApp(
        title: 'SupportHub',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark,
        darkTheme: AppTheme.dark,
        themeMode: ThemeMode.dark,
        home: AppConfig.bypassStartupDependencies
            ? const LoginScreen()
            : const SplashScreen(),
      ),
    );
  }
}
