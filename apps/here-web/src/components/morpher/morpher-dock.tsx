import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { morpherActionAtom } from '~/atoms';
import { cn } from '~/lib/utils';

type Sheet = {
  layout: {
    width: number;
    height: number;
    radius: number;
  };
  render: React.ReactNode;
  showBackdrop?: boolean;
  backdropClosable?: boolean;
};

interface ComposerProps {
  actions: Record<string, Sheet>;
  onBackdropClick?: () => void;
}

export default function MorpherDock(props: ComposerProps) {
  const { onBackdropClick, actions } = props;
  const [morpherAction, setmorpherAction] = useAtom(morpherActionAtom);
  const layout = actions[morpherAction]?.layout;

  console.log('morpherAction', morpherAction, layout);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && morpherAction !== 'nav-bar')
        setmorpherAction('nav-bar');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [morpherAction]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    // if (info.offset.y > dragThreshold) close();
    if (info.offset.y > 100) setmorpherAction('nav-bar');
  };

  return (
    <div className="absolute bottom-0 flex w-full flex-col items-center">
      <AnimatePresence>
        {actions[morpherAction]?.showBackdrop &&
          morpherAction !== 'nav-bar' && (
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                if (actions[morpherAction]?.backdropClosable) {
                  setmorpherAction('nav-bar');
                  onBackdropClick?.();
                }
              }}
            />
          )}
      </AnimatePresence>

      <motion.div
        layout
        // drag={morpherAction !== 'nav' ? 'y' : false} // nav 模式不可拖拽
        // dragConstraints={{ top: 0, bottom: 300 }}
        // onDragEnd={handleDragEnd}
        // dragElastic={0.3}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'relative z-10 mx-auto mb-4 ar-wrap overflow-hidden max-h-full'
        )}
        style={{
          borderRadius: layout?.radius ?? 32,
          width: layout?.width ?? 300,
          height: layout?.height ?? 80,
        }}
      >
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={morpherAction}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            {actions[morpherAction]?.render}
          </motion.div>
        </AnimatePresence> */}
        <div
          key={morpherAction}
          className="absolute inset-0 flex items-center justify-center"
        >
          {actions[morpherAction]?.render}
        </div>
      </motion.div>
    </div>
  );
}
