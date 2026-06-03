'use client';

import { useEffect, useRef, useState } from 'react';
import { messagesService } from '@/services/messages.service';
import { socketService } from '@/services/socket.service';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import type { Message, TicketStatus } from '@/types';

interface TicketChatProps {
  ticketId: string;
  status: TicketStatus;
  initialMessages?: Message[];
}

export function TicketChat({
  ticketId,
  status,
  initialMessages = [],
}: TicketChatProps) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesService.getHistory(ticketId).then(setMessages).catch(console.error);
  }, [ticketId]);

  useEffect(() => {
    if (token) socketService.connect(token);
    socketService.joinTicket(ticketId);

    const handleNewMessage = (msg: Message) => {
      if (msg.ticketId === ticketId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socketService.onNewMessage(handleNewMessage);
    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.leaveTicket(ticketId);
    };
  }, [ticketId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || status === 'CLOSED') return;
    setSending(true);
    try {
      socketService.sendMessage(ticketId, content.trim());
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[500px] flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No messages yet</p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white'
                  }`}
                >
                  <p className="text-xs font-medium opacity-70">
                    {msg.sender?.name || 'Unknown'}
                  </p>
                  <p className="mt-0.5 text-sm">{msg.content}</p>
                  <p className="mt-1 text-xs opacity-50">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      {status === 'OPEN' ? (
        <form
          onSubmit={handleSend}
          className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-700"
        >
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
          <Button type="submit" isLoading={sending} disabled={!content.trim()}>
            Send
          </Button>
        </form>
      ) : (
        <p className="border-t border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-700">
          Ticket is closed. Reopen to send messages.
        </p>
      )}
    </div>
  );
}
