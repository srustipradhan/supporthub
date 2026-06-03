import { Global, Module } from '@nestjs/common';
import { RealtimeMessagingService } from './realtime-messaging.service';

@Global()
@Module({
  providers: [RealtimeMessagingService],
  exports: [RealtimeMessagingService],
})
export class RealtimeModule {}
