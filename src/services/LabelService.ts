// src/services/LabelService.ts
import { Label } from '../models/Task';

// Initial default labels
let labels: Label[] = [
  { id: 1, name: 'Work', color: '#3b82f6' },
  { id: 2, name: 'Personal', color: '#8b5cf6' },
  { id: 3, name: 'Urgent', color: '#ec4899' },
  { id: 4, name: 'Health', color: '#10b981' },
];

export const LabelService = {
  listLabels: (): Label[] => {
    return [...labels];
  },

  getLabel: (id: number): Label | undefined => {
    return labels.find(label => label.id === id);
  },

  getLabelByName: (name: string): Label | undefined => {
    return labels.find(label => label.name.toLowerCase() === name.toLowerCase());
  },

  addLabel: (label: Omit<Label, 'id'>): Label | null => {
    // Check if label with same name already exists
    if (LabelService.getLabelByName(label.name)) {
      return null; // Label name must be unique
    }

    const newLabel = {
      ...label,
      id: labels.length ? Math.max(...labels.map(l => l.id)) + 1 : 1,
    };

    labels.push(newLabel);
    return newLabel;
  },

  updateLabel: (id: number, updatedLabel: Partial<Label>): Label | null => {
    // Check name uniqueness if name is being updated
    if (updatedLabel.name) {
      const existingLabel = LabelService.getLabelByName(updatedLabel.name);
      if (existingLabel && existingLabel.id !== id) {
        return null;
      }
    }

    const index = labels.findIndex(label => label.id === id);
    if (index !== -1) {
      labels[index] = {
        ...labels[index],
        ...updatedLabel,
      };
      return labels[index];
    }
    return null;
  },

  deleteLabel: (id: number): boolean => {
    const initialLength = labels.length;
    labels = labels.filter(label => label.id !== id);
    return labels.length < initialLength;
  },
};
