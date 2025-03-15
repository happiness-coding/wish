import { FC, ChangeEvent } from 'react';
import type { Label as LabelType } from '../../models/Task';
import {
  FormGroup,
  Label,
  RequiredIndicator,
  Input,
  Textarea,
  RadioGroup,
  RadioLabel,
  HiddenRadio,
  PriorityDot,
  ErrorMessage,
} from './styles';

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  labels: LabelType[];
}

interface FormFieldsProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPriorityChange: (priority: 'low' | 'medium' | 'high') => void;
}

export const FormFields: FC<FormFieldsProps> = ({
  formData,
  errors,
  onChange,
  onPriorityChange,
}) => {
  return (
    <>
      <FormGroup>
        <Label htmlFor="title">
          Task Title <RequiredIndicator>*</RequiredIndicator>
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={onChange}
          placeholder="Enter task title"
        />
        {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Enter task description"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={onChange}
        />
      </FormGroup>

      <FormGroup>
        <Label>Priority</Label>
        <RadioGroup>
          {(['low', 'medium', 'high'] as const).map(priority => (
            <RadioLabel key={priority} priority={priority} checked={formData.priority === priority}>
              <HiddenRadio
                type="radio"
                name="priority"
                value={priority}
                checked={formData.priority === priority}
                onChange={() => onPriorityChange(priority)}
              />
              <PriorityDot priority={priority} checked={formData.priority === priority} />
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </RadioLabel>
          ))}
        </RadioGroup>
      </FormGroup>
    </>
  );
};
