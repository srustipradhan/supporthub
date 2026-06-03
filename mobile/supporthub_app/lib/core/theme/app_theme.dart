import 'package:flutter/material.dart';
import 'app_colors.dart';

abstract final class AppTheme {
  static ThemeData get dark {
    const radiusLg = 8.0;
    const radiusXl = 12.0;

    final colorScheme = ColorScheme.dark(
      surface: AppColors.zinc950,
      onSurface: AppColors.foreground,
      primary: AppColors.indigo600,
      onPrimary: Colors.white,
      secondary: AppColors.violet600,
      onSecondary: Colors.white,
      error: AppColors.red600,
      onError: Colors.white,
      outline: AppColors.zinc700,
      surfaceContainerHighest: AppColors.zinc800,
      surfaceContainerLow: AppColors.zinc900,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.zinc950,
      colorScheme: colorScheme,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.zinc950,
        foregroundColor: AppColors.foreground,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: AppColors.foreground,
          letterSpacing: -0.25,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.zinc900.withValues(alpha: 0.8),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.zinc800),
        ),
        margin: EdgeInsets.zero,
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.zinc800,
        thickness: 1,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.slate800,
        labelStyle: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppColors.slate300,
        ),
        hintStyle: const TextStyle(color: AppColors.slate500),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLg),
          borderSide: const BorderSide(color: AppColors.slate600),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLg),
          borderSide: const BorderSide(color: AppColors.slate600),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLg),
          borderSide: const BorderSide(color: AppColors.indigo600, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLg),
          borderSide: const BorderSide(color: AppColors.red600),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.indigo600,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.indigo600.withValues(alpha: 0.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusLg),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.violet300,
          textStyle: const TextStyle(fontWeight: FontWeight.w500),
        ),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.indigo600,
        foregroundColor: Colors.white,
        elevation: 2,
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.indigo600,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.zinc800,
        contentTextStyle: const TextStyle(color: AppColors.foreground),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusXl)),
        behavior: SnackBarBehavior.floating,
      ),
      textTheme: const TextTheme(
        headlineSmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: AppColors.foreground,
          letterSpacing: -0.25,
        ),
        titleLarge: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: AppColors.foreground,
        ),
        titleMedium: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: AppColors.foreground,
        ),
        bodyMedium: TextStyle(fontSize: 14, color: AppColors.zinc400),
        bodySmall: TextStyle(fontSize: 12, color: AppColors.zinc500),
        labelMedium: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AppColors.zinc500,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
