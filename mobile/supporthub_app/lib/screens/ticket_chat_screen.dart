import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../models/ticket.dart';
import '../providers/auth_provider.dart';
import '../providers/chat_provider.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';
import '../services/ticket_service.dart';
import '../widgets/app_panel.dart';
import '../widgets/message_bubble.dart';
import '../widgets/status_badge.dart';

class TicketChatScreen extends StatefulWidget {
  final String ticketId;

  const TicketChatScreen({super.key, required this.ticketId});

  @override
  State<TicketChatScreen> createState() => _TicketChatScreenState();
}

class _TicketChatScreenState extends State<TicketChatScreen> {
  Ticket? _ticket;
  bool _loadingTicket = true;
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  late ChatProvider _chatProvider;

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

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final api = context.read<ApiService>();
    final socket = context.read<SocketService>();

    return ChangeNotifierProvider(
      create: (_) {
        _chatProvider = ChatProvider(api, socket);
        final token = auth.token;
        if (token != null) {
          _chatProvider.loadMessages(widget.ticketId);
          _chatProvider.joinTicket(widget.ticketId, token);
        }
        return _chatProvider;
      },
      child: Builder(
        builder: (context) {
          final chat = context.watch<ChatProvider>();
          if (chat.messages.isNotEmpty) _scrollToBottom();

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
                  'Conversation not found',
                  style: TextStyle(color: AppColors.zinc500),
                ),
              ),
            );
          }

          final canSend = _ticket!.isOpen;

          return Scaffold(
            appBar: AppBar(
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _ticket!.title,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 16),
                  ),
                  const Text(
                    'Support conversation',
                    style: TextStyle(fontSize: 12, color: AppColors.zinc500),
                  ),
                ],
              ),
              actions: [
                Padding(
                  padding: const EdgeInsets.only(right: 16),
                  child: Center(child: StatusBadge(status: _ticket!.status)),
                ),
              ],
            ),
            body: Column(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: AppPanel(
                      padding: const EdgeInsets.all(12),
                      child: chat.isLoading
                          ? const Center(
                              child: CircularProgressIndicator(
                                color: AppColors.indigo600,
                              ),
                            )
                          : chat.messages.isEmpty
                              ? const Center(
                                  child: Text(
                                    'No messages yet. Say hello!',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: AppColors.zinc500,
                                    ),
                                  ),
                                )
                              : ListView.builder(
                                  controller: _scrollController,
                                  itemCount: chat.messages.length,
                                  itemBuilder: (context, index) {
                                    final msg = chat.messages[index];
                                    return MessageBubble(
                                      message: msg,
                                      isOwn: msg.senderId == auth.user?.id,
                                    );
                                  },
                                ),
                    ),
                  ),
                ),
                if (canSend)
                  SafeArea(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        border: Border(top: BorderSide(color: AppColors.zinc800)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _messageController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                hintText: 'Type a message...',
                                contentPadding: EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 12,
                                ),
                              ),
                              onSubmitted: (_) => _send(context),
                            ),
                          ),
                          const SizedBox(width: 8),
                          FilledButton(
                            onPressed: chat.isSending
                                ? null
                                : () => _send(context),
                            child: chat.isSending
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Text('Send'),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  const Padding(
                    padding: EdgeInsets.all(16),
                    child: Text(
                      'Ticket is closed. Reopen to send messages.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 14, color: AppColors.zinc500),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Future<void> _send(BuildContext context) async {
    final text = _messageController.text;
    if (text.trim().isEmpty) return;
    final ok = await context
        .read<ChatProvider>()
        .sendMessage(widget.ticketId, text);
    if (!context.mounted) return;
    if (ok) {
      _messageController.clear();
    } else {
      final err = context.read<ChatProvider>().error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(err ?? 'Failed to send message'),
        ),
      );
    }
  }
}
