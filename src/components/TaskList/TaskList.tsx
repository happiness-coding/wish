// src/components/TaskList/TaskList.tsx - Modified version
import { FC } from 'react';
import { Task } from '../../models/Task';
import { format } from 'date-fns';
import { ClockIcon, TagIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

import {
  CheckboxContainer,
  StyledCheckbox,
  Content,
  Title,
  MetaInfo,
  PriorityBadge,
  LabelsContainer,
  LabelTag,
  Actions,
  ActionButton,
  EmptyState,
  Container,
  TaskCard,
  MetaItem,
  PageContainer,
  TaskListContainer,
  FilterBar,
  FilterButton,
} from './taskListStyles';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onFilterChange?: (filter: string) => void;
  currentFilter?: string;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
  onFilterChange,
  currentFilter = 'all',
}) => {
  return (
    <PageContainer>
      <Container className={isLoading ? 'loading' : ''}>
        <FilterBar>
          <FilterButton
            $active={currentFilter === 'all'}
            onClick={() => onFilterChange && onFilterChange('all')}
          >
            All
          </FilterButton>
          <FilterButton
            $active={currentFilter === 'active'}
            onClick={() => onFilterChange && onFilterChange('active')}
          >
            Active
          </FilterButton>
          <FilterButton
            $active={currentFilter === 'completed'}
            onClick={() => onFilterChange && onFilterChange('completed')}
          >
            Completed
          </FilterButton>
        </FilterBar>

        <TaskListContainer>
          {tasks.length === 0 ? (
            <EmptyState>
              <ClockIcon width={48} height={48} />
              <h4>No tasks match your filters</h4>
              <p>Try adjusting your filters or create a new task</p>
            </EmptyState>
          ) : (
            tasks.map(task => (
              <TaskCard key={task.id} $completed={task.isCompleted} $priority={task.priority}>
                <CheckboxContainer>
                  <StyledCheckbox
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => onToggleComplete(task.id)}
                  />
                </CheckboxContainer>

                <Content onClick={() => onView(task.id)}>
                  <Title $completed={task.isCompleted}>{task.title}</Title>

                  <MetaInfo>
                    {task.dueDate && (
                      <MetaItem>
                        <ClockIcon width={16} height={16} />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </MetaItem>
                    )}

                    <PriorityBadge $priority={task.priority}>{task.priority}</PriorityBadge>

                    {task.labels.length > 0 && (
                      <MetaItem>
                        <TagIcon width={16} height={16} />
                        {task.labels.length} {task.labels.length === 1 ? 'label' : 'labels'}
                      </MetaItem>
                    )}
                  </MetaInfo>

                  {task.labels.length > 0 && (
                    <LabelsContainer>
                      {task.labels.map(label => (
                        <LabelTag
                          key={label.id}
                          style={{
                            backgroundColor: `${label.color}15`,
                            color: label.color,
                          }}
                        >
                          {label.name}
                        </LabelTag>
                      ))}
                    </LabelsContainer>
                  )}
                </Content>

                <Actions>
                  <ActionButton onClick={() => onEdit(task.id)} title="Edit">
                    <PencilIcon width={18} height={18} />
                  </ActionButton>
                  <ActionButton onClick={() => onDelete(task.id)} title="Delete">
                    <TrashIcon width={18} height={18} />
                  </ActionButton>
                </Actions>
              </TaskCard>
            ))
          )}
        </TaskListContainer>
      </Container>
    </PageContainer>
  );
};
