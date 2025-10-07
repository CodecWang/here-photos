'use client';

import * as React from 'react';

import { Button, ButtonProps } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

export interface IconButtonProps extends ButtonProps {
  active?: boolean;
  icon: React.ReactNode;
  tooltipContent?: React.ReactNode;
  className?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ active, icon, tooltipContent, className, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full',
              active ? 'bg-secondary' : 'bg-transparent',
              className
            )}
            {...props}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
