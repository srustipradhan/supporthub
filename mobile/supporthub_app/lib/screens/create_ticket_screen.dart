import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/utils/validators.dart';
import '../providers/ticket_provider.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/loading_overlay.dart';

class CreateTicketScreen extends StatefulWidget {
  const CreateTicketScreen({super.key});

  @override
  State<CreateTicketScreen> createState() => _CreateTicketScreenState();
}

class _CreateTicketScreenState extends State<CreateTicketScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final provider = context.read<TicketProvider>();
    final ticket = await provider.createTicket(
      _titleController.text.trim(),
      _descriptionController.text.trim(),
    );
    if (!mounted) return;
    if (ticket != null) {
      Navigator.of(context).pop(true);
    } else if (provider.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(provider.error!)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<TicketProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Create Ticket')),
      body: LoadingOverlay(
        isLoading: provider.isLoading,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'New support ticket',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 4),
                const Text('Describe your issue and we will help you.'),
                const SizedBox(height: 24),
                CustomTextField(
                  label: 'Title',
                  controller: _titleController,
                  validator: (v) => Validators.required(v, 'Title'),
                ),
                const SizedBox(height: 16),
                CustomTextField(
                  label: 'Description',
                  controller: _descriptionController,
                  maxLines: 5,
                  validator: (v) {
                    if (v == null || v.trim().length < 10) {
                      return 'Description must be at least 10 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _submit,
                    child: const Text('Submit Ticket'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
