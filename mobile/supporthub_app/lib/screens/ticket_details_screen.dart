import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/ticket.dart';
import '../services/api_service.dart';
import '../services/ticket_service.dart';
import '../widgets/app_panel.dart';
import '../widgets/status_badge.dart';
import 'ticket_chat_screen.dart';

class TicketDetailsScreen extends StatefulWidget {
  final String ticketId;

  const TicketDetailsScreen({super.key, required this.ticketId});

  @override
  State<TicketDetailsScreen> createState() => _TicketDetailsScreenState();
}

class _TicketDetailsScreenState extends State<TicketDetailsScreen> {
  Ticket? _ticket;
  bool _loadingTicket = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadTicket());
  }

  Future<void> _loadTicket() async {
    if (!mounted) return;
    try {
      final ticket = await TicketService(context.read<ApiService>())
          .getTicket(widget.ticketId);
      setState(() {
        _ticket = ticket;
        _loadingTicket = false;
      });
    } catch (e) {
      setState(() => _loadingTicket = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  void _openChat() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => TicketChatScreen(ticketId: widget.ticketId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loadingTicket) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: AppColors.indigo600),
        ),
      );
    }

    if (_ticket == null) {
      return const Scaffold(
        body: Center(
          child: Text(
            'Ticket not found',
            style: TextStyle(color: AppColors.zinc500),
          ),
        ),
      );
    }

    final ticket = _ticket!;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          ticket.title,
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(child: StatusBadge(status: ticket.status)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          AppPanel(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.zinc500,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  ticket.description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.zinc400,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          AppPanel(
            child: Row(
              children: [
                const Icon(Icons.schedule, size: 18, color: AppColors.zinc500),
                const SizedBox(width: 8),
                Text(
                  'Created ${DateFormat.yMMMd().add_jm().format(ticket.createdAt)}',
                  style: const TextStyle(fontSize: 14, color: AppColors.zinc400),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _openChat,
              icon: const Icon(Icons.chat_bubble_outline),
              label: Text(
                ticket.isOpen ? 'Open conversation' : 'View conversation',
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Messages are in the Chat section',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: AppColors.zinc500),
          ),
        ],
      ),
    );
  }
}
