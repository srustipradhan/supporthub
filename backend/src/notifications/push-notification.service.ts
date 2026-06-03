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

  /** Exposed for /notifications/status diagnostics (no secrets). */
  getConfigDiagnostics(): {
    hasJsonEnv: boolean;
    hasPathEnv: boolean;
    pathFileExists: boolean;
    defaultFileExists: boolean;
  } {
    const pathFromEnv = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
    const defaultPath = join(process.cwd(), 'firebase-service-account.json');
    const jsonRaw = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    return {
      hasJsonEnv: Boolean(jsonRaw?.trim()),
      hasPathEnv: Boolean(pathFromEnv?.trim()),
      pathFileExists: pathFromEnv ? existsSync(pathFromEnv) : false,
      defaultFileExists: existsSync(defaultPath),
    };
  }

  private parseInlineJson(raw: string): admin.ServiceAccount | null {
    let value = raw.trim();
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"') && value[1] === '{')
    ) {
      value = value.slice(1, -1);
    }
    try {
      return JSON.parse(value) as admin.ServiceAccount;
    } catch {
      // Render sometimes stores base64
      try {
        const decoded = Buffer.from(value, 'base64').toString('utf8');
        return JSON.parse(decoded) as admin.ServiceAccount;
      } catch {
        return null;
      }
    }
  }

  private loadServiceAccount(): admin.ServiceAccount | null {
    const jsonInline = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    if (jsonInline?.trim()) {
      const parsed = this.parseInlineJson(jsonInline);
      if (parsed) return parsed;
      this.logger.error(
        'FIREBASE_SERVICE_ACCOUNT_JSON is set but not valid JSON. Paste one line from: npm run firebase:render-env',
      );
      return null;
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
    return this.sendPushNotification(
      fcmToken,
      title,
      body,
      data,
      'supporthub_channel',
    );
  }

  async sendPushNotification(
    fcmToken: string,
    title: string,
    body: string,
    data: Record<string, string>,
    channelId = 'supporthub_channel',
  ): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        'Push skipped — configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH (see .env.example)',
      );
      return;
    }
    if (!fcmToken) return;

    const dataPayload = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v ?? '')]),
    );

    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: dataPayload,
        android: {
          priority: 'high',
          notification: {
            channelId,
            priority: 'high' as const,
          },
        },
      });
      this.logger.log(`Push sent: "${title}" → …${fcmToken.slice(-8)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Push failed for token …${fcmToken.slice(-8)}: ${message}`);
      throw err;
    }
  }
}
