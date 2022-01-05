import { IUser } from '@arcaffe/common-types';
import { FC, useCallback, useRef, useEffect } from 'react';
import './UserItem.less';

const SCROLL_OPTIONS: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'center',
  inline: 'center',
};

type ownProps = IUser & {
  isSelected: boolean;
  onShowDetails: (user: IUser) => void;
  onDelete: (id: string) => void;
  onSelect: (user: IUser) => void;
};
export const UserItem: FC<ownProps> = (user) => {
  const { name, onSelect, id, onDelete, isSelected, onShowDetails } = user;

  const elm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      elm.current?.scrollIntoView(SCROLL_OPTIONS);
    }
  }, [isSelected]);

  const selectHandler = useCallback((ev) => {
    onSelect(user);
  }, []);

  const showDetails = useCallback((ev) => {
    onShowDetails(user);
  }, []);

  return (
    <div
      ref={elm}
      onClick={selectHandler}
      key={id}
      className={`user-item ${user.isSelected ? 'selected' : ''}`}
    >
      <div className="name">{name}</div>
      <div className="btns">
        <button
          onClick={() => {
            showDetails(id);
          }}
          className="details"
        >
          Details
        </button>
        <button
          onClick={() => {
            onDelete(id);
          }}
          className="delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
