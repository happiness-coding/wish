import styled from 'styled-components';

export const FormContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
`;

export const BackLink = styled.button`
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

export const IconWrapper = styled.span`
  width: 1.25rem;
  height: 1.25rem;
`;

export const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const FormHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #edf2f7;
`;

export const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

export const StyledForm = styled.form`
  padding: 2rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

export const RequiredIndicator = styled.span`
  color: #e53e3e;
  margin-left: 0.25rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const RadioLabel = styled.label<{ priority: 'low' | 'medium' | 'high'; checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  background-color: ${props =>
    props.checked
      ? props.priority === 'high'
        ? '#fed7d7'
        : props.priority === 'medium'
          ? '#feebc8'
          : '#c6f6d5'
      : 'transparent'};

  &:hover {
    background-color: ${props =>
      props.priority === 'high' ? '#fed7d7' : props.priority === 'medium' ? '#feebc8' : '#c6f6d5'};
  }
`;

export const HiddenRadio = styled.input`
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
`;

export const PriorityDot = styled.span<{ priority: 'low' | 'medium' | 'high'; checked: boolean }>`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.priority) {
      case 'high':
        return '#e53e3e';
      case 'medium':
        return '#dd6b20';
      case 'low':
        return '#38a169';
      default:
        return '#a0aec0';
    }
  }};
  border: 2px solid
    ${props =>
      props.checked
        ? props.priority === 'high'
          ? '#e53e3e'
          : props.priority === 'medium'
            ? '#dd6b20'
            : '#38a169'
        : '#cbd5e0'};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #edf2f7;
`;

export const Button = styled.button<{ variant?: string }>`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${props => (props.variant === 'primary' ? '#4f46e5' : 'transparent')};
  color: ${props => (props.variant === 'primary' ? 'white' : '#4a5568')};
  border: ${props => (props.variant === 'primary' ? 'none' : '1px solid #e2e8f0')};

  &:hover {
    background-color: ${props => (props.variant === 'primary' ? '#4338ca' : '#f7fafc')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.375rem;
`;
