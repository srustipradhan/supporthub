// File generated from android/app/google-services.json (project: supporthub-69074).
// Re-run `flutterfire configure` to refresh when Firebase apps change.

import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      throw UnsupportedError(
        'DefaultFirebaseOptions have not been configured for web.',
      );
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for iOS.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for $defaultTargetPlatform.',
        );
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyB8scxTEe6N8YPOXGrk3brQV7WeYdDyXE0',
    appId: '1:242394366079:android:3f1148bd6861bbf403bf4a',
    messagingSenderId: '242394366079',
    projectId: 'supporthub-69074',
    storageBucket: 'supporthub-69074.firebasestorage.app',
  );
}
