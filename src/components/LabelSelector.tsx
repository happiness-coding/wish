// src/components/LabelSelector.tsx
import { FC, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Label } from '../models/Task';
import { LabelService } from '../services/LabelService';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SelectorContainer = styled.div`
  position: relative;
`;

const SelectedLabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LabelChip = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
  border: 1px solid ${props => `${props.color}50`};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: currentColor;
  width: 16px;
  height: 16px;
`;

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;
  color: #4a5568;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.25rem;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const LabelName = styled.div`
  display: flex;
  align-items: center;
`;

const ColorDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const CreateLabelForm = styled.form`
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
`;

const FormRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LabelInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.2);
  }
`;

const ColorInput = styled.input`
  padding: 0;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background-color: #4338ca;
  }
`;

interface LabelSelectorProps {
  selectedLabels: Label[];
  onChange: (labels: Label[]) => void;
}

export const LabelSelector: FC<LabelSelectorProps> = ({ selectedLabels, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [newLabelName, setNewLabelName] = useState<string>('');
  const [newLabelColor, setNewLabelColor] = useState<string>('#3b82f6');
  const [error, setError] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailableLabels(LabelService.listLabels());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLabelToggle = (label: Label) => {
    const isSelected = selectedLabels.some(l => l.id === label.id);
    let updatedLabels: Label[];

    if (isSelected) {
      updatedLabels = selectedLabels.filter(l => l.id !== label.id);
    } else {
      updatedLabels = [...selectedLabels, label];
    }

    onChange(updatedLabels);
  };

  const handleRemoveLabel = (id: number) => {
    onChange(selectedLabels.filter(label => label.id !== id));
  };

  const handleCreateLabel = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newLabelName.trim()) {
      setError('Label name is required');
      return;
    }

    const result = LabelService.addLabel({
      name: newLabelName.trim(),
      color: newLabelColor
    });

    if (result) {
      setAvailableLabels(LabelService.listLabels());
      setNewLabelName('');
      onChange([...selectedLabels, result]);
    } else {
      setError('Label name must be unique');
    }
  };

  return (
    <SelectorContainer ref={dropdownRef}>
      {selectedLabels.length > 0 && (
        <SelectedLabelsContainer>
          {selectedLabels.map(label => (
            <LabelChip key={label.id} color={label.color}>
              {label.name}
              <RemoveButton onClick={() => handleRemoveLabel(label.id)}>
                <XMarkIcon width={14} height={14} />
              </RemoveButton>
            </LabelChip>
          ))}
        </SelectedLabelsContainer>
      )}

      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        {selectedLabels.length > 0 ? 'Manage labels' : 'Add labels'}
      </SelectorButton>

      {isOpen && (
        <DropdownMenu>
          {availableLabels.map(label => (
            <MenuItem key={label.id} onClick={() => handleLabelToggle(label)}>
              <LabelName>
                <ColorDot color={label.color} />
                {label.name}
              </LabelName>
              {selectedLabels.some(l => l.id === label.id) && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </MenuItem>
          ))}

          <CreateLabelForm onSubmit={handleCreateLabel}>
            <FormRow>
              <LabelInput
                type="text"
                placeholder="New label name"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
              />
              <ColorInput
                type="color"
                value={newLabelColor}
                onChange={(e) => setNewLabelColor(e.target.value)}
              />
            </FormRow>

            {error && <div style={{ color: 'red', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</div>}

            <AddButton type="submit" disabled={!newLabelName.trim()}>
              <PlusIcon width={16} height={16} />
              Create Label
            </AddButton>
          </CreateLabelForm>
        </DropdownMenu>
      )}
    </SelectorContainer>
  );
};