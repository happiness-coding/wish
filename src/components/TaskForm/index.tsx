import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';
import { TaskService } from '../../services/TaskService';
import type { Label as LabelType } from '../../models/Task';
import { LabelSelector } from '../LabelSelector';
import { FormFields } from './FormFields';
import {
  FormCard,
  FormHeader,
  FormTitle,
  StyledForm,
  FormGroup,
  FormActions,
  Button,
} from './styles';

type FormData = {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  labels: LabelType[];
};

interface TaskFormProps {
  taskId?: number;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm: FC<TaskFormProps> = ({
  taskId,
  onSubmitSuccess,
  onCancel
}) => {
  const isEditMode = Boolean(taskId);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    labels: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isEditMode && taskId) {
      const task = TaskService.getTask(taskId);

      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
          priority: task.priority,
          labels: task.labels
        });
      } else {
        onCancel();
      }
    }
  }, [taskId, isEditMode, onCancel]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const handleLabelsChange = (labels: LabelType[]) => {
    setFormData(prev => ({ ...prev, labels }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      priority: formData.priority,
      labels: formData.labels,
      isCompleted: false
    };

    try {
      if (isEditMode && taskId) {
        TaskService.updateTask(taskId, taskData);
      } else {
        TaskService.addTask(taskData);
      }
      onSubmitSuccess();
    } catch (error) {
      console.error('Failed to save task:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard>
      <FormHeader>
        <FormTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</FormTitle>
      </FormHeader>
      <StyledForm onSubmit={handleSubmit}>
        <FormFields
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onPriorityChange={handlePriorityChange}
        />

        <FormGroup>
          <LabelSelector
            selectedLabels={formData.labels}
            onChange={handleLabelsChange}
          />
        </FormGroup>

        <FormActions>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
          </Button>
        </FormActions>
      </StyledForm>
    </FormCard>
  );
};