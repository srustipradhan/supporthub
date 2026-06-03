import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../models/ticket.dart';
import 'api_service.dart';

class TicketService {
  final ApiService _api;

  TicketService(this._api);

  Future<List<Ticket>> getMyTickets() async {
    try {
      final response = await _api.client.get(ApiConstants.ticketsMy);
      return (response.data as List)
          .map((t) => Ticket.fromJson(t as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<Ticket> getTicket(String id) async {
    try {
      final response = await _api.client.get(ApiConstants.ticketById(id));
      return Ticket.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<Ticket> createTicket({
    required String title,
    required String description,
  }) async {
    try {
      final response = await _api.client.post(
        ApiConstants.tickets,
        data: {'title': title, 'description': description},
      );
      return Ticket.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }
}
