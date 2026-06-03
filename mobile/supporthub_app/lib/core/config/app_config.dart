class AppConfig {
  /// Temporary: skip Firebase/notifications and open LoginScreen without auth checks.
  /// Set to false once backend/Firebase are configured.
  static const bool bypassStartupDependencies = true;

  static const String apiBaseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:3000',
  );

  static const String wsBaseUrl = String.fromEnvironment(
    'WS_URL',
    defaultValue: 'http://10.0.2.2:3000',
  );
}
