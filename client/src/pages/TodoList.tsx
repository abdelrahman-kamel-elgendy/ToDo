import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
}

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
}

const TodoList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/todos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data.data.todos;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newTodo: Omit<Todo, 'id' | 'completed'>) =>
      axios.post('http://localhost:5000/api/todos', newTodo, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      handleClose();
      setError('');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Failed to add todo.';
      setError(message);
      console.error('Add Todo Error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (todo: Todo) =>
      axios.patch(`http://localhost:5000/api/todos/${todo.id}`, todo, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      handleClose();
      setError('');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Failed to update todo.';
      setError(message);
      console.error('Update Todo Error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTodo(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
    });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todoData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
    };
    if (editingTodo) {
      updateMutation.mutate({ ...editingTodo, ...todoData });
    } else {
      createMutation.mutate(todoData);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Todo List</Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Add Todo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {todos?.map((todo: Todo) => (
          <Card key={todo.id}>
            <CardContent>
              <Typography variant="h6">{todo.title}</Typography>
              <Typography color="textSecondary" gutterBottom>
                {todo.description}
              </Typography>
              <Typography variant="body2">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="primary">
                Priority: {todo.priority}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleEdit(todo)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteMutation.mutate(todo.id)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} PaperProps={{
        sx: { borderRadius: 3, p: 2, boxShadow: 8, minWidth: 400 }
      }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 24, pb: 1 }}>
          {editingTodo ? 'Edit Todo' : 'Add Todo'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              required
              value={formData.title}
              onChange={handleInputChange}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="dense"
              name="dueDate"
              label="Due Date"
              type="datetime-local"
              fullWidth
              required
              value={formData.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 1 }}
            />
            <FormControl fullWidth margin="dense" sx={{ mb: 1 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleSelectChange}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                !formData.title.trim() ||
                !formData.dueDate.trim() ||
                !formData.priority.trim() ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              sx={{ minWidth: 90, fontWeight: 'bold' }}
            >
              {editingTodo ? (updateMutation.isPending ? 'Saving...' : 'Update') : (createMutation.isPending ? 'Adding...' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TodoList; 