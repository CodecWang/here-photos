import TuneIcon from '~/icons/tune-icon';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty';

interface EmptyUIProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export default function EmptyUI({ title, description, actions }: EmptyUIProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TuneIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">{actions}</div>
      </EmptyContent>
    </Empty>
  );
}
