import { FC } from 'react';
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ActionBar as StyledActionBar, ActionButton, IconWrapper } from './styles';

interface ActionBarProps {
  isCompleted: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionBar: FC<ActionBarProps> = ({
  isCompleted,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  return (
    <StyledActionBar>
      <ActionButton $variant="complete" onClick={onToggleComplete}>
        <IconWrapper>
          <CheckIcon />
        </IconWrapper>
        {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
      </ActionButton>
      <ActionButton $variant="edit" onClick={onEdit}>
        <IconWrapper>
          <PencilIcon />
        </IconWrapper>
        Edit Task
      </ActionButton>
      <ActionButton $variant="delete" onClick={onDelete}>
        <IconWrapper>
          <TrashIcon />
        </IconWrapper>
        Delete Task
      </ActionButton>
    </StyledActionBar>
  );
};
