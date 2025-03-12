import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { TaskService } from '../../services/TaskService';
import type { Label as LabelType } from '../../models/Task';
import { LabelSelector } from '../LabelSelector';
import {
  FormCard,
  FormHeader,
  FormTitle,
  StyledForm,
  FormGroup,
  FormActions,
  Button,
} from './styles';

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  labels: LabelType[];
  isCompleted: boolean;
}

interface TaskFormProps {
  taskId?: number;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm: FC<TaskFormProps> = ({ taskId, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    labels: [],
    isCompleted: false
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fetchingTask, setFetchingTask] = useState(!!taskId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditMode = !!taskId;

  // Fetch task if in edit mode
  useEffect(() => {
    const fetchTask = async () => {
      if (taskId) {
        try {
          const task = await TaskService.getTask(taskId);
          if (task) {
            setFormData({
              title: task.title,
              description: task.description,
              dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
              priority: task.priority,
              labels: task.labels,
              isCompleted: task.isCompleted
            });
          } else {
            setFormError('Task not found');
          }
        } catch (err) {
          setFormError('Error loading task');
          console.error('Error fetching task:', err);
        } finally {
          setFetchingTask(false);
        }
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setFormError(null);

    try {
      if (isEditMode && taskId) {
        // Update existing task
        const updatedTask = await TaskService.updateTask(taskId, {
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : null
        });
        if (updatedTask) {
          onSubmitSuccess();
        }
      } else {
        // Create new task
        const newTask = await TaskService.addTask({
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : null
        });
        if (newTask) {
          onSubmitSuccess();
        }
      }
    } catch (err) {
      setFormError('Failed to save task. Please try again.');
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    setFormData(prevData => ({ ...prevData, priority }));
  };

  const handleLabelsChange = (labels: LabelType[]) => {
    setFormData(prevData => ({ ...prevData, labels }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <FormCard>
      <FormHeader>
        <FormTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</FormTitle>
      </FormHeader>

      {fetchingTask && <div className="loading">Loading task data...</div>}

      {formError && <div className="error-message">{formError}</div>}

      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={fetchingTask || loading}
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </FormGroup>

        <FormGroup>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={fetchingTask || loading}
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={fetchingTask || loading}
          />
        </FormGroup>

        <FormGroup>
          <label>Priority</label>
          <div className="priority-buttons">
            <Button
              type="button"
              variant={formData.priority === 'low' ? 'selected' : 'default'}
              onClick={() => handlePriorityChange('low')}
              disabled={fetchingTask || loading}
            >
              Low
            </Button>
            <Button
              type="button"
              variant={formData.priority === 'medium' ? 'selected' : 'default'}
              onClick={() => handlePriorityChange('medium')}
              disabled={fetchingTask || loading}
            >
              Medium
            </Button>
            <Button
              type="button"
              variant={formData.priority === 'high' ? 'selected' : 'default'}
              onClick={() => handlePriorityChange('high')}
              disabled={fetchingTask || loading}
            >
              High
            </Button>
          </div>
        </FormGroup>

        <FormGroup>
          <label>Labels</label>
          <LabelSelector
            selectedLabels={formData.labels}
            onChange={handleLabelsChange}
          />
        </FormGroup>

        <FormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading || fetchingTask}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || fetchingTask}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
          </Button>
        </FormActions>
      </StyledForm>
    </FormCard>
  );
};