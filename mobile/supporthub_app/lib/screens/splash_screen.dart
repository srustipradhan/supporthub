import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/config/app_config.dart';
import '../core/theme/app_colors.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_logo.dart';
import 'home_screen.dart';
import 'login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    if (AppConfig.bypassStartupDependencies) {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
      return;
    }

    try {
      await Future.delayed(const Duration(seconds: 2));
      if (!mounted) return;
      final auth = context.read<AuthProvider>();
      final isLoggedIn = await auth
          .checkAuth()
          .timeout(const Duration(seconds: 5), onTimeout: () => false);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => isLoggedIn ? const HomeScreen() : const LoginScreen(),
        ),
      );
    } catch (e, st) {
      debugPrint('Splash auth check failed: $e\n$st');
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.zinc950,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AppLogo(subtitle: 'Loading...'),
            SizedBox(height: 40),
            SizedBox(
              width: 32,
              height: 32,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                color: AppColors.indigo600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
