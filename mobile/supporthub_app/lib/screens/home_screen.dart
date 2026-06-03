import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../providers/ticket_provider.dart';
import '../widgets/app_logo.dart';
import '../widgets/ticket_card.dart';
import 'create_ticket_screen.dart';
import 'profile_screen.dart';
import 'ticket_details_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
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

    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 8, 0),
              child: Row(
                children: [
                  const AppLogo(compact: true),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'SupportHub',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.foreground,
                          ),
                        ),
                        Text(
                          'My Tickets',
                          style: TextStyle(fontSize: 12, color: AppColors.zinc500),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.person_outline, color: AppColors.zinc400),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const ProfileScreen()),
                      );
                    },
                  ),
                ],
              ),
            ),
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 20, 16, 4),
              child: Text(
                'Tickets',
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
                'Manage your support requests',
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
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final created = await Navigator.of(context).push<bool>(
            MaterialPageRoute(builder: (_) => const CreateTicketScreen()),
          );
          if (created == true && mounted) {
            ticketProvider.fetchTickets();
          }
        },
        icon: const Icon(Icons.add),
        label: const Text('New Ticket'),
      ),
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
              'No tickets found',
              style: TextStyle(color: AppColors.zinc500),
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 88),
      itemCount: ticketProvider.tickets.length,
      itemBuilder: (context, index) {
        final ticket = ticketProvider.tickets[index];
        return TicketCard(
          ticket: ticket,
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => TicketDetailsScreen(ticketId: ticket.id),
              ),
            );
          },
        );
      },
    );
  }
}
