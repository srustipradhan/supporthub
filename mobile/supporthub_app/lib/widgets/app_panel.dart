import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

/// Dashboard/ticket panels: `rounded-2xl border-zinc-800 bg-zinc-900/80`.
class AppPanel extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;

  const AppPanel({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final panel = Container(
      width: double.infinity,
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.zinc900.withValues(alpha: 0.8),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.zinc800.withValues(alpha: 0.8)),
      ),
      child: child,
    );

    if (onTap == null) return panel;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: panel,
      ),
    );
  }
}
