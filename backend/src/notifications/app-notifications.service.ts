import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AppNotification,
  AppNotificationType,
} from './app-notification.entity';

@Injectable()
export class AppNotificationsService {
  constructor(
    @InjectRepository(AppNotification)
    private readonly repo: Repository<AppNotification>,
  ) {}

  async create(params: {
    userId: string;
    type: AppNotificationType;
    title: string;
    body: string;
    ticketId?: string;
  }): Promise<AppNotification> {
    const row = this.repo.create({
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      ticketId: params.ticketId ?? null,
    });
    return this.repo.save(row);
  }

  async findForUser(userId: string, limit = 50): Promise<AppNotification[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.repo.count({ where: { userId, read: false } });
  }

  async markRead(id: string, userId: string): Promise<AppNotification> {
    const row = await this.repo.findOne({ where: { id, userId } });
    if (!row) throw new NotFoundException('Notification not found');
    row.read = true;
    return this.repo.save(row);
  }

  async markAllRead(userId: string): Promise<void> {
    await this.repo.update({ userId, read: false }, { read: true });
  }
}
