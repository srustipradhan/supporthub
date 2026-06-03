import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../core/utils/validators.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_logo.dart';
import '../widgets/auth_scaffold.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/loading_overlay.dart';
import 'main_shell_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthProvider>();
    auth.clearError();
    final success = await auth.register(
      _nameController.text.trim(),
      _emailController.text.trim(),
      _passwordController.text,
    );
    if (!mounted) return;
    if (success) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const MainShellScreen()),
        (_) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return AuthScaffold(
      showBack: true,
      child: LoadingOverlay(
        isLoading: auth.isLoading,
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const AppLogo(subtitle: 'Create your account'),
              const SizedBox(height: 32),
              CustomTextField(
                label: 'Full Name',
                controller: _nameController,
                validator: (v) => Validators.required(v, 'Name'),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Email',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                validator: Validators.email,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Password',
                controller: _passwordController,
                obscureText: true,
                validator: Validators.password,
              ),
              if (auth.error != null) ...[
                const SizedBox(height: 16),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.red900_20,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    auth.error!,
                    style: const TextStyle(fontSize: 14, color: AppColors.red600),
                  ),
                ),
              ],
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: auth.isLoading ? null : _register,
                  child: const Text('Register'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
