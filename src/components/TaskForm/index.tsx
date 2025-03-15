import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Label } from '../../models/Task';
import { TaskService } from '../../services/TaskService';
import { LabelService } from '../../services/LabelService';
import { FormFields } from './FormFields';
import { LabelSelector } from '../LabelSelector';
import {
  FormContainer,
  BackLink,
  IconWrapper,
  FormCard,
  FormHeader,
  FormTitle,
  StyledForm,
  FormActions,
  Button,
  StatusIndicator,
  FormSection,
  FormDivider,
} from './styles';

interface TaskFormProps {
  taskId?: number;
  onBack?: () => void;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm: FC<TaskFormProps> = ({ taskId, onBack, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    isCompleted: false,
    labels: [] as Label[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [, setAvailableLabels] = useState<Label[]>([]);
  const isEditMode = taskId !== undefined;

  // Fetch labels
  useEffect(() => {
    const labels = LabelService.listLabels();
    setAvailableLabels(labels);
  }, []);

  // Fetch task data if in edit mode
  useEffect(() => {
    if (isEditMode && taskId) {
      setLoading(true);
      TaskService.getTask(taskId)
        .then(task => {
          if (task) {
            setFormData({
              title: task.title,
              description: task.description,
              dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
              priority: task.priority,
              isCompleted: task.isCompleted,
              labels: task.labels || [],
            });
          }
        })
        .catch(err => {
          console.error('Error fetching task:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEditMode, taskId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const handleLabelChange = (selectedLabels: Label[]) => {
    setFormData(prev => ({ ...prev, labels: selectedLabels }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaveStatus('saving');

    try {
      if (isEditMode && taskId) {
        // Update existing task
        const taskToUpdate = await TaskService.getTask(taskId);
        if (taskToUpdate) {
          await TaskService.updateTask(taskId, {
            ...taskToUpdate,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
            priority: formData.priority,
            isCompleted: formData.isCompleted,
            labels: formData.labels,
          });
        }
      } else {
        // Create new task
        await TaskService.addTask({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
          priority: formData.priority,
          isCompleted: false,
          labels: formData.labels,
        });
      }
      setSaveStatus('success');
      setTimeout(() => {
        onSubmitSuccess();
      }, 500);
    } catch (err) {
      console.error('Error saving task:', err);
      setSaveStatus('error');
    }
  };

  const handleToggleCompleted = () => {
    setFormData(prev => ({ ...prev, isCompleted: !prev.isCompleted }));
  };

  return (
    <FormContainer>
      {onBack && (
        <BackLink onClick={onBack}>
          <IconWrapper>
            <ArrowLeftIcon />
          </IconWrapper>
          Back to Tasks
        </BackLink>
      )}

      <FormCard>
        <FormHeader>
          <FormTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</FormTitle>
          {saveStatus !== 'idle' && (
            <StatusIndicator $status={saveStatus}>
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'success' && 'Saved!'}
              {saveStatus === 'error' && 'Error saving'}
            </StatusIndicator>
          )}
        </FormHeader>

        <StyledForm onSubmit={handleSubmit}>
          <FormSection>
            <FormFields
              formData={formData}
              errors={errors}
              onChange={handleChange}
              onPriorityChange={handlePriorityChange}
            />
          </FormSection>

          <FormDivider />

          <FormSection>
            <LabelSelector selectedLabels={formData.labels} onChange={handleLabelChange} />
          </FormSection>

          {isEditMode && (
            <FormActions>
              <Button
                type="button"
                onClick={handleToggleCompleted}
                $variant={formData.isCompleted ? 'completed' : 'incomplete'}
              >
                {formData.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
              </Button>
            </FormActions>
          )}

          <FormActions>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" $variant="primary" disabled={loading || saveStatus === 'saving'}>
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </Button>
          </FormActions>
        </StyledForm>
      </FormCard>
    </FormContainer>
  );
};
