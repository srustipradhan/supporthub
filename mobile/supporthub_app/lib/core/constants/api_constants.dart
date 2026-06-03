class ApiConstants {
  static const authRegister = '/auth/register';
  static const authLogin = '/auth/login';
  static const ticketsMy = '/tickets/my';
  static const tickets = '/tickets';
  static const messages = '/messages';
  static const usersFcmToken = '/users/fcm-token';
  static const notificationsTest = '/notifications/test';
  static const notificationsStatus = '/notifications/status';
  static const notificationsInbox = '/notifications/inbox';
  static const notificationsUnreadCount = '/notifications/unread-count';
  static const notificationsReadAll = '/notifications/read-all';
  static String notificationMarkRead(String id) => '/notifications/$id/read';
  static String ticketById(String id) => '/tickets/$id';
  static String messagesByTicket(String ticketId) =>
      '/messages/ticket/$ticketId';
}
