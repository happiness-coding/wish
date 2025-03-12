import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { TaskService } from '../services/TaskService';
import type { Label as LabelType } from '../models/Task';
import { LabelSelector } from '../components/LabelSelector';

const FormContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
`;

const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4f46e5;
  font-weight: 600;
  margin-bottom: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 0.95rem;

  &:hover {
    color: #4338ca;
    text-decoration: underline;
  }
`;

const IconWrapper = styled.span`
  width: 1.25rem;
  height: 1.25rem;
`;

const FormCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const FormHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
`;

const StyledForm = styled.form`
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const RequiredIndicator = styled.span`
  color: #e53e3e;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #2d3748;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #2d3748;
  transition: border-color 0.2s;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label<{ priority: string, checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${props => props.checked ? '600' : '400'};
  transition: all 0.2s;
  
  background-color: ${props => {
    if (!props.checked) return '#f1f5f9';
    switch (props.priority) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      case 'low': return '#d1fae5';
      default: return '#f1f5f9';
    }
  }};
  
  border: 1px solid ${props => {
    if (!props.checked) return '#e2e8f0';
    switch (props.priority) {
      case 'high': return '#fecaca';
      case 'medium': return '#fde68a';
      case 'low': return '#a7f3d0';
      default: return '#e2e8f0';
    }
  }};
  
  color: ${props => {
    if (!props.checked) return '#4a5568';
    switch (props.priority) {
      case 'high': return '#b91c1c';
      case 'medium': return '#b45309';
      case 'low': return '#047857';
      default: return '#4a5568';
    }
  }};
  
  &:hover {
    background-color: ${props => {
      if (!props.checked) return '#e2e8f0';
      switch (props.priority) {
        case 'high': return '#fecaca';
        case 'medium': return '#fde68a';
        case 'low': return '#a7f3d0';
        default: return '#e2e8f0';
      }
    }};
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const PriorityDot = styled.span<{ priority: string, checked: boolean }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  background-color: ${props => {
    if (!props.checked) return '#cbd5e0';
    switch (props.priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#cbd5e0';
    }
  }};
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const FormActions = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${props => props.variant === 'primary' ? '#4f46e5' : '#e2e8f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#4a5568'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#4338ca' : '#cbd5e0'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


type FormData = {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  labels: LabelType[];  // Changed from Label[] to LabelType[]
};

export const TaskFormPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

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
    if (isEditMode && id) {
      const taskId = parseInt(id, 10);
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
        navigate('/tasks');
      }
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    setFormData(prev => ({ ...prev, priority }));
  };


  // Add handler for label changes
  const handleLabelsChange = (labels: LabelType[]) => {
    setFormData(prev => ({ ...prev, labels }));
  };


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.trim().length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
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
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      priority: formData.priority,
      labels: formData.labels,
      isCompleted: isEditMode && id ? TaskService.getTask(parseInt(id, 10))?.isCompleted || false : false
    };

    try {
      if (isEditMode && id) {
        const taskId = parseInt(id, 10);
        TaskService.updateTask(taskId, taskData);
      } else {
        TaskService.addTask(taskData);
      }

      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors(prev => ({ ...prev, form: 'Failed to save task. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <BackLink onClick={() => navigate('/tasks')}>
        <IconWrapper><ArrowLeftIcon /></IconWrapper>
        Back to Tasks
      </BackLink>

      <FormCard>
        <FormHeader>
          <FormTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</FormTitle>
        </FormHeader>

        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              Title <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <Input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Due Date</Label>
            <Input
              type="date"
              name="dueDate"
              placeholder="Select due date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Priority <RequiredIndicator>*</RequiredIndicator>
            </Label>
            <RadioGroup>
              <RadioLabel
                priority="low"
                checked={formData.priority === 'low'}
              >
                <HiddenRadio
                  type="radio"
                  name="priority"
                  value="low"
                  checked={formData.priority === 'low'}
                  onChange={() => handlePriorityChange('low')}
                />
                <PriorityDot priority="low" checked={formData.priority === 'low'} />
                Low
              </RadioLabel>

              <RadioLabel
                priority="medium"
                checked={formData.priority === 'medium'}
              >
                <HiddenRadio
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={formData.priority === 'medium'}
                  onChange={() => handlePriorityChange('medium')}
                />
                <PriorityDot priority="medium" checked={formData.priority === 'medium'} />
                Medium
              </RadioLabel>

              <RadioLabel
                priority="high"
                checked={formData.priority === 'high'}
              >
                <HiddenRadio
                  type="radio"
                  name="priority"
                  value="high"
                  checked={formData.priority === 'high'}
                  onChange={() => handlePriorityChange('high')}
                />
                <PriorityDot priority="high" checked={formData.priority === 'high'} />
                High
              </RadioLabel>
            </RadioGroup>
          </FormGroup>

          <FormGroup>
            <Label>Labels</Label>
            <LabelSelector
                selectedLabels={formData.labels}
                onChange={handleLabelsChange}
            />
          </FormGroup>

          {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}

          <FormActions>
            <Button
              type="button"
              onClick={() => navigate('/tasks')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </Button>
          </FormActions>
        </StyledForm>
      </FormCard>
    </FormContainer>
  );
};