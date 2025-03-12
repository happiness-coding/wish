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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        setLoading(true);
        try {
          const taskId = parseInt(id, 10);
          const foundTask = await TaskService.getTask(taskId);
          setTask(foundTask);
          setError(null);
        } catch (err) {
          setError('Failed to load task details. Please try again later.');
          console.error('Error fetching task:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      try {
        const success = await TaskService.deleteTask(task.id);
        if (success) {
          navigate('/tasks');
        } else {
          setError('Failed to delete task');
        }
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleToggleComplete = async () => {
    if (task) {
      try {
        const updatedTask = await TaskService.toggleComplete(task.id);
        if (updatedTask) {
          setTask(updatedTask);
        }
      } catch (err) {
        setError('Failed to update task status. Please try again.');
        console.error('Error toggling task completion:', err);
      }
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
      error={error}
      onBack={handleBack}
      onToggleComplete={handleToggleComplete}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRetry={() => id && setLoading(true)}
    />
  );
};