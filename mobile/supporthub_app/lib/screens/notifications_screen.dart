import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/app_notification.dart';
import '../providers/notification_provider.dart';
import '../widgets/app_panel.dart';
import 'ticket_details_screen.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NotificationProvider>().refresh();
    });
  }

  IconData _iconFor(AppNotification n) {
    if (n.isTicketClosed) return Icons.lock_outline;
    if (n.isTicketReopened) return Icons.lock_open_outlined;
    return Icons.confirmation_number_outlined;
  }

  Color _accentFor(AppNotification n) {
    if (n.isTicketClosed) return AppColors.red600;
    if (n.isTicketReopened) return AppColors.emerald400;
    return AppColors.indigo600;
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<NotificationProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ticket updates'),
        actions: [
          if (provider.unreadCount > 0)
            TextButton(
              onPressed: provider.isLoading ? null : provider.markAllRead,
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.indigo600,
        onRefresh: provider.refresh,
        child: _buildBody(provider),
      ),
    );
  }

  Widget _buildBody(NotificationProvider provider) {
    if (provider.isLoading && provider.items.isEmpty) {
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

    if (provider.error != null && provider.items.isEmpty) {
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
                    provider.error!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.red600),
                  ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: provider.refresh,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    }

    if (provider.items.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 120),
          Center(
            child: Column(
              children: [
                Icon(Icons.notifications_none, size: 48, color: AppColors.zinc500),
                SizedBox(height: 12),
                Text(
                  'No ticket updates yet',
                  style: TextStyle(color: AppColors.zinc500),
                ),
                SizedBox(height: 4),
                Text(
                  'Created, closed, and reopened tickets appear here',
                  style: TextStyle(fontSize: 13, color: AppColors.zinc500),
                ),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.items.length,
      itemBuilder: (context, index) {
        final item = provider.items[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: AppPanel(
            onTap: item.ticketId == null
                ? null
                : () async {
                    if (!item.read) {
                      await provider.markRead(item.id);
                    }
                    if (!context.mounted || item.ticketId == null) return;
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) =>
                            TicketDetailsScreen(ticketId: item.ticketId!),
                      ),
                    );
                  },
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: _accentFor(item).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(_iconFor(item), color: _accentFor(item), size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              item.title,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: item.read
                                    ? FontWeight.w500
                                    : FontWeight.w700,
                                color: AppColors.foreground,
                              ),
                            ),
                          ),
                          if (!item.read)
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.indigo600,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.body,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.zinc400,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        DateFormat.yMMMd().add_jm().format(item.createdAt),
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.zinc500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
