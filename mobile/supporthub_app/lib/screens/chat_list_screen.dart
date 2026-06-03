import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../providers/ticket_provider.dart';
import '../widgets/app_panel.dart';
import '../widgets/status_badge.dart';
import 'ticket_chat_screen.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TicketProvider>().fetchTickets();
    });
  }

  @override
  Widget build(BuildContext context) {
    final ticketProvider = context.watch<TicketProvider>();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 20, 16, 4),
          child: Text(
            'Chat',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: AppColors.foreground,
            ),
          ),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Conversations for your support tickets',
            style: TextStyle(fontSize: 14, color: AppColors.zinc500),
          ),
        ),
        const SizedBox(height: 16),
        Expanded(
          child: RefreshIndicator(
            color: AppColors.indigo600,
            onRefresh: ticketProvider.fetchTickets,
            child: _buildBody(ticketProvider),
          ),
        ),
      ],
    );
  }

  Widget _buildBody(TicketProvider ticketProvider) {
    if (ticketProvider.isLoading && ticketProvider.tickets.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 120),
          Center(
            child: CircularProgressIndicator(color: AppColors.indigo600),
          ),
        ],
      );
    }

    if (ticketProvider.error != null && ticketProvider.tickets.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 80),
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  Text(
                    ticketProvider.error!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.red600),
                  ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: ticketProvider.fetchTickets,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    }

    if (ticketProvider.tickets.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 120),
          Center(
            child: Text(
              'No conversations yet.\nCreate a ticket to start chatting.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.zinc500),
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      itemCount: ticketProvider.tickets.length,
      itemBuilder: (context, index) {
        final ticket = ticketProvider.tickets[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: AppPanel(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => TicketChatScreen(ticketId: ticket.id),
                ),
              );
            },
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.indigo600.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.chat_bubble_outline,
                    color: AppColors.indigo600,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        ticket.title,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppColors.foreground,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        ticket.isOpen
                            ? 'Tap to open conversation'
                            : 'Closed — view history',
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.zinc500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                StatusBadge(status: ticket.status),
                const Icon(Icons.chevron_right, color: AppColors.zinc500),
              ],
            ),
          ),
        );
      },
    );
  }
}
