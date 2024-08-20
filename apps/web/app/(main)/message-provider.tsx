import clsx from 'clsx';
import { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Message {
  level: 'info' | 'error' | 'success';
  content: string;
}

const defaultContext = {
  message: {
    info: (content: string) => console.info(content),
    error: (content: string) => console.error(content),
    success: (content: string) => console.log(content),
  },
};
const MessageContext = createContext(defaultContext);

export const MessageProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const message = {
    info: (content: string) => addMessage({ content, level: 'info' }),
    error: (content: string) => addMessage({ content, level: 'error' }),
    success: (content: string) => addMessage({ content, level: 'success' }),
  };

  useEffect(() => {
    messages.forEach((_msg, index) => {
      setTimeout(() => {
        removeMessage(index);
      }, 5000);
    });
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <MessageContext.Provider value={{ message }}>
      {children}

      {createPortal(
        <>
          {messages.map((msg, index) => {
            return (
              <div className="toast toast-top toast-center z-40" key={index}>
                <div
                  className={clsx(
                    'alert',
                    msg.level === 'error' ? 'alert-error' : 'alert-info',
                  )}
                >
                  <span>{msg.content}</span>
                </div>
              </div>
            );
          })}
        </>,
        document.body,
      )}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
