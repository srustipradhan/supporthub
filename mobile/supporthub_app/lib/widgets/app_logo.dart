import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

class AppLogo extends StatelessWidget {
  final String? subtitle;
  final bool compact;

  const AppLogo({super.key, this.subtitle, this.compact = false});

  @override
  Widget build(BuildContext context) {
    if (compact) {
      return Container(
        width: 36,
        height: 36,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: AppColors.violet600,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Text(
          'S',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w700,
            fontSize: 16,
          ),
        ),
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 48,
          height: 48,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: AppColors.violet600,
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Text(
            'S',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: 20,
            ),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'SupportHub',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.indigo600,
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 8),
          Text(
            subtitle!,
            style: const TextStyle(fontSize: 14, color: AppColors.slate500),
          ),
        ],
      ],
    );
  }
}
