class ApiConstants {
  static const authRegister = '/auth/register';
  static const authLogin = '/auth/login';
  static const ticketsMy = '/tickets/my';
  static const tickets = '/tickets';
  static const messages = '/messages';
  static String ticketById(String id) => '/tickets/$id';
  static String messagesByTicket(String ticketId) =>
      '/messages/ticket/$ticketId';
}
