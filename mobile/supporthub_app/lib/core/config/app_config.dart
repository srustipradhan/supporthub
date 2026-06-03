/// Production API (Render). Override at build time if needed:
/// flutter run --dart-define=API_URL=https://...
abstract final class AppConfig {
  static const String productionApiUrl = 'https://supporthub-th9v.onrender.com';

  /// When true, opens LoginScreen directly (skips splash auth check).
  /// Use only for local UI work without API; keep false for normal runs.
  static const bool bypassStartupDependencies = false;

  static const String apiBaseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: productionApiUrl,
  );

  static const String wsBaseUrl = String.fromEnvironment(
    'WS_URL',
    defaultValue: productionApiUrl,
  );
}
