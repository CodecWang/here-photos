import clsx from 'clsx';

interface IconButtonProps {
  className?: string;
  icon: React.ReactNode;
  tooltip: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function IconButton({
  className,
  icon,
  tooltip,
  active,
  disabled,
  onClick,
}: IconButtonProps) {
  return (
    <div
      className={clsx('tooltip tooltip-bottom', className)}
      data-tip={tooltip}
    >
      <button
        className={clsx(
          'btn btn-circle btn-ghost',
          active && 'btn-active',
          disabled && 'btn-disabled',
        )}
        onClick={onClick}
      >
        {icon}
      </button>
    </div>
  );
}
