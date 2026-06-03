import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/theme/app_colors.dart';
import '../models/ticket.dart';
import 'app_panel.dart';
import 'status_badge.dart';

class TicketCard extends StatelessWidget {
  final Ticket ticket;
  final VoidCallback onTap;

  const TicketCard({super.key, required this.ticket, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: AppPanel(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    ticket.title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: AppColors.indigo600,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                StatusBadge(status: ticket.status),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              ticket.description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 14, color: AppColors.zinc400),
            ),
            const SizedBox(height: 10),
            Text(
              DateFormat.yMMMd().add_jm().format(ticket.createdAt),
              style: const TextStyle(fontSize: 12, color: AppColors.zinc500),
            ),
          ],
        ),
      ),
    );
  }
}
