// src/pages/TaskDetailPage.tsx
import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import { TaskDetail } from '../components/TaskDetail';

export const TaskDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const taskId = parseInt(id, 10);
      const foundTask = TaskService.getTask(taskId);
      setTask(foundTask);
      setLoading(false);
    }
  }, [id]);

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      TaskService.deleteTask(task.id);
      navigate('/tasks');
    }
  };

  const handleToggleComplete = () => {
    if (task) {
      const updatedTask = TaskService.toggleComplete(task.id);
      setTask(updatedTask);
    }
  };

  const handleBack = () => {
    navigate('/tasks');
  };

  const handleEdit = (id: number) => {
    navigate(`/tasks/edit/${id}`);
  };

  return (
    <TaskDetail
      task={task}
      loading={loading}
      onBack={handleBack}
      onToggleComplete={handleToggleComplete}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};