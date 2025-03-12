// src/components/LabelSelector.tsx
import { FC, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Label } from '../models/Task';
import { LabelService } from '../services/LabelService';

const SelectorContainer = styled.div`
  position: relative;
`;

const LabelTitle = styled.div`
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const SelectedLabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-height: 36px;
`;

const LabelChip = styled.div<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
  font-size: 0.875rem;
  font-weight: 600;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  color: currentColor;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const IconWrapper = styled.span`
  width: 0.875rem;
  height: 0.875rem;
`;

const LabelInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.625rem 0.75rem;
  cursor: text;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  background: transparent;
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Dropdown = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  display: ${props => props.show ? 'block' : 'none'};
`;

const LabelOption = styled.div<{ isSelected: boolean, color: string }>`
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  background-color: ${props => props.isSelected ? `${props.color}10` : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isSelected ? `${props.color}20` : '#f7fafc'};
  }
`;

const ColorDot = styled.span<{ color: string }>`
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const LabelName = styled.span`
  flex: 1;
  font-size: 0.95rem;
`;

const AddLabelForm = styled.form`
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AddLabelHeader = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
`;

const LabelInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const NewLabelInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  outline: none;
  
  &:focus {
    border-color: #4f46e5;
  }
`;

const ColorInput = styled.input`
  padding: 0.25rem;
  width: 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 3px;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background-color: #4f46e5;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    background-color: #a0aec0;
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
  const [isOpen, setIsOpen] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [labelColor, setLabelColor] = useState('#4f46e5');
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLabels = () => {
      const allLabels = LabelService.listLabels();
      setLabels(allLabels);
    };

    fetchLabels();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredLabels = labels.filter(label =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleDeleteLabel = (l: Label) => {
    const updated = selectedLabels.filter(label => label.id !== l.id);
    onChange(updated);
  };

  const handleSelectLabel = (label: Label) => {
    // If already selected, remove it
    if (isSelected(label)) {
      handleDeleteLabel(label);
      return;
    }

    // Otherwise add it
    onChange([...selectedLabels, label]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();

    if (newLabel) {
      const label = LabelService.addLabel({
        name: newLabel,
        color: labelColor
      });

      if (label) {
        setLabels([...labels, label]);
        handleSelectLabel(label);
        setNewLabel('');
        setLabelColor('#4f46e5'); // Reset to default color
      }
    }
  };

  const isSelected = (selected: Label) => {
    return selectedLabels.some(label => label.id === selected.id);
  };

  return (
    <SelectorContainer ref={selectorRef}>
      <LabelTitle>Labels</LabelTitle>
      <SelectedLabelsContainer>
        {selectedLabels.map(label => (
          <LabelChip key={label.id} color={label.color}>
            {label.name}
            <DeleteButton onClick={() => handleDeleteLabel(label)}>
              <IconWrapper>
                <XMarkIcon />
              </IconWrapper>
            </DeleteButton>
          </LabelChip>
        ))}
      </SelectedLabelsContainer>

      <LabelInput onClick={handleInputClick}>
        <Input
          type="text"
          placeholder="Search labels..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </LabelInput>

      <Dropdown show={isOpen}>
        {filteredLabels.length > 0 ? (
          filteredLabels.map(label => (
            <LabelOption
              key={label.id}
              isSelected={isSelected(label)}
              color={label.color}
              onClick={() => handleSelectLabel(label)}
            >
              <ColorDot color={label.color} />
              <LabelName>{label.name}</LabelName>
            </LabelOption>
          ))
        ) : searchTerm && !isAddingNew ? (
          <AddLabelForm onSubmit={e => {
            e.preventDefault();
            setIsAddingNew(true);
            setNewLabel(searchTerm);
          }}>
            <AddButton type="submit">
              <IconWrapper style={{ marginRight: '0.25rem' }}>
                <PlusIcon />
              </IconWrapper>
              Create "{searchTerm}"
            </AddButton>
          </AddLabelForm>
        ) : null}

        {isAddingNew || (!filteredLabels.length && !searchTerm) ? (
          <AddLabelForm onSubmit={handleAddLabel}>
            <AddLabelHeader>Add new label</AddLabelHeader>
            <LabelInputGroup>
              <NewLabelInput
                type="text"
                placeholder="Label name"
                value={newLabel || searchTerm}
                onChange={e => setNewLabel(e.target.value)}
                autoFocus
              />
              <ColorInput
                type="color"
                value={labelColor}
                onChange={e => setLabelColor(e.target.value)}
              />
            </LabelInputGroup>
            <AddButton
              type="submit"
              disabled={!newLabel}
            >
              <IconWrapper style={{ marginRight: '0.25rem' }}>
                <PlusIcon />
              </IconWrapper>
              Add Label
            </AddButton>
          </AddLabelForm>
        ) : null}
      </Dropdown>
    </SelectorContainer>
  );
};