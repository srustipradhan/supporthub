import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as admin from 'firebase-admin';

@Injectable()
export class PushNotificationService implements OnModuleInit {
  private readonly logger = new Logger(PushNotificationService.name);
  private enabled = false;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    if (admin.apps.length > 0) {
      this.enabled = true;
      this.logger.log('Firebase Admin already initialized');
      return;
    }

    const serviceAccount = this.loadServiceAccount();
    if (!serviceAccount) {
      this.logger.warn(
        'Push notifications disabled. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH (see .env.example).',
      );
      return;
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.enabled = true;
      this.logger.log(
        `Firebase Admin ready — push enabled for project ${serviceAccount.projectId ?? 'unknown'}`,
      );
    } catch (err) {
      this.logger.error('Failed to initialize Firebase Admin', err);
    }
  }

  private loadServiceAccount(): admin.ServiceAccount | null {
    const jsonInline = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    if (jsonInline) {
      try {
        return JSON.parse(jsonInline) as admin.ServiceAccount;
      } catch {
        this.logger.error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
        return null;
      }
    }

    const pathFromEnv = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
    const candidates = [
      pathFromEnv,
      join(process.cwd(), 'firebase-service-account.json'),
    ].filter(Boolean) as string[];

    for (const filePath of candidates) {
      if (!existsSync(filePath)) continue;
      try {
        const raw = readFileSync(filePath, 'utf8');
        this.logger.log(`Loading Firebase service account from ${filePath}`);
        return JSON.parse(raw) as admin.ServiceAccount;
      } catch (err) {
        this.logger.error(`Failed to read ${filePath}`, err);
      }
    }

    return null;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async sendNewMessageNotification(
    fcmToken: string,
    title: string,
    body: string,
    data: Record<string, string>,
  ): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        'Push skipped — configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH (see .env.example)',
      );
      return;
    }
    if (!fcmToken) return;

    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data,
        android: {
          priority: 'high',
          notification: {
            channelId: 'supporthub_channel',
          },
        },
      });
      this.logger.log(`Push sent: "${title}"`);
    } catch (err) {
      this.logger.warn(`Push failed for token …${fcmToken.slice(-8)}: ${err}`);
    }
  }
}
