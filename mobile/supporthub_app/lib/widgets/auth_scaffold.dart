import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

/// Login/register layout matching admin `app/login/page.tsx` (dark variant).
class AuthScaffold extends StatelessWidget {
  final Widget child;
  final bool showBack;

  const AuthScaffold({super.key, required this.child, this.showBack = false});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [AppColors.slate900, AppColors.slate950],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              if (showBack)
                Align(
                  alignment: Alignment.topLeft,
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back, color: AppColors.zinc400),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
              Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 420),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: AppColors.slate800,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.slate700),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x66000000),
                            blurRadius: 24,
                            offset: Offset(0, 8),
                          ),
                        ],
                      ),
                      child: child,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
