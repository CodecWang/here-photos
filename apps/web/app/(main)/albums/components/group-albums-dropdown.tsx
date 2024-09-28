import { MouseEventHandler } from 'react';

import { GroupAlbumsBy } from '~/config/enums';
import AdGroupIcon from '~/icons/ad-group-icon';
import AdGroupOffIcon from '~/icons/ad-group-off-icon';

interface GroupAlbumsDropdownProps {
  groupBy: GroupAlbumsBy;
  onChange: (value: GroupAlbumsBy) => void;
}

export function GroupAlbumsDropdown({
  groupBy,
  onChange,
}: GroupAlbumsDropdownProps) {
  const handleGroupByChange: MouseEventHandler<HTMLUListElement> = (e) => {
    const value = (e.target as HTMLAnchorElement).getAttribute('data-value');
    value && onChange(value as GroupAlbumsBy);
    e.currentTarget.blur();
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost m-1">
        {groupBy === GroupAlbumsBy.None ? (
          <AdGroupOffIcon className="size-6 md:size-5" />
        ) : (
          <AdGroupIcon className="size-6 md:size-5" />
        )}

        {groupBy}
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box bg-base-200 z-[1] w-52 p-2 shadow"
        onClick={handleGroupByChange}
      >
        {Object.values(GroupAlbumsBy).map((value) => (
          <li key={value}>
            <a className={groupBy === value ? 'active' : ''} data-value={value}>
              {value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
