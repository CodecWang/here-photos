'use client';

import { useEffect, useState } from 'react';

import { eventBus } from '~/utils/event-bus';

import { MessageProvider, useMessage } from './message-provider';
import { NavProvider } from './nav-provider';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <NavProvider>
      <MessageProvider>
        {children}
        <Empty />
      </MessageProvider>
    </NavProvider>
  );
}

const Empty = () => {
  const { message } = useMessage();

  useEffect(() => {
    const handleMessage = (msg: string) => message.error(msg);

    eventBus.on('request.error', handleMessage);
    return () => {
      eventBus.off('request.error', handleMessage);
    };
  }, [message]);

  return null;
};
