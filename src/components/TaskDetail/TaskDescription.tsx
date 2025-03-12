import { FC } from 'react';
import { Description, DescriptionHeader, DescriptionText } from './styles';

interface TaskDescriptionProps {
  description: string;
  isCompleted: boolean;
}

export const TaskDescription: FC<TaskDescriptionProps> = ({ description, isCompleted }) => {
  return (
    <Description>
      <DescriptionHeader>Description</DescriptionHeader>
      <DescriptionText isCompleted={isCompleted}>
        {description || 'No description provided.'}
      </DescriptionText>
    </Description>
  );
};
