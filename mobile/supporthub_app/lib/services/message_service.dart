import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../models/message.dart';
import 'api_service.dart';

class MessageService {
  final ApiService _api;

  MessageService(this._api);

  Future<List<Message>> getHistory(String ticketId) async {
    try {
      final response =
          await _api.client.get(ApiConstants.messagesByTicket(ticketId));
      return (response.data as List)
          .map((m) => Message.fromJson(m as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }

  Future<Message> sendMessage({
    required String ticketId,
    required String content,
  }) async {
    try {
      final response = await _api.client.post(
        ApiConstants.messages,
        data: {'ticketId': ticketId, 'content': content},
      );
      return Message.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _api.getErrorMessage(e);
    }
  }
}
