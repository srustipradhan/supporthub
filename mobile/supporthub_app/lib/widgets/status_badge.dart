import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final isOpen = status.toUpperCase() == 'OPEN';
    final bg = isOpen ? AppColors.emerald500.withValues(alpha: 0.15) : AppColors.zinc500.withValues(alpha: 0.15);
    final fg = isOpen ? AppColors.emerald400 : AppColors.zinc400;
    final ring = isOpen ? AppColors.emerald500.withValues(alpha: 0.25) : AppColors.zinc500.withValues(alpha: 0.25);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: ring),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: fg,
        ),
      ),
    );
  }
}
