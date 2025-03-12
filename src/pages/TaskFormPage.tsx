import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { TaskForm } from '../components/TaskForm';
import { FormContainer, BackLink, IconWrapper } from '../components/TaskForm/styles';

export const TaskFormPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <FormContainer>
      <BackLink onClick={() => navigate('/tasks')}>
        <IconWrapper>
          <ArrowLeftIcon />
        </IconWrapper>
        Back to Tasks
      </BackLink>

      <TaskForm
        taskId={id ? parseInt(id, 10) : undefined}
        onSubmitSuccess={() => navigate('/tasks')}
        onCancel={() => navigate('/tasks')}
      />
    </FormContainer>
  );
};
