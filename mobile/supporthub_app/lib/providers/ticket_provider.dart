import 'package:flutter/foundation.dart';
import '../models/ticket.dart';
import '../services/api_service.dart';
import '../services/ticket_service.dart';

class TicketProvider extends ChangeNotifier {
  final TicketService _ticketService;

  List<Ticket> _tickets = [];
  bool _isLoading = false;
  String? _error;

  TicketProvider(ApiService api) : _ticketService = TicketService(api);

  List<Ticket> get tickets => _tickets;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchTickets({bool force = false}) async {
    if (_isLoading) return;
    if (!force && _tickets.isNotEmpty) return;

    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _tickets = await _ticketService.getMyTickets();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Ticket?> createTicket(String title, String description) async {
    _isLoading = true;
    notifyListeners();
    try {
      final ticket =
          await _ticketService.createTicket(title: title, description: description);
      _tickets.insert(0, ticket);
      _error = null;
      notifyListeners();
      return ticket;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
