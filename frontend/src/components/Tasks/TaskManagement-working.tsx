import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  Calendar,
  CheckSquare,
  Target,
  Users,
  X
} from 'lucide-react';
import { db } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
  createdAt: Date;
}

const TaskManagement: React.FC = () => {
  const { user: profile } = useAuth();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load data on component mount
  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load team members
      const { data: teamData, error: teamError } = await db.getTeamMembers();
      if (teamError) throw teamError;
      setTeamMembers(teamData || []);

      // Load projects (assuming PM can see all their assigned projects)
      const { data: projectData, error: projectError } = await db.getProjects();
      if (projectError) throw projectError;
      
      // Filter projects assigned to this PM
      const myProjects = projectData?.filter(p => p.project_manager_id === profile?.id) || [];
      setProjects(myProjects);

      // Load all tasks for projects assigned to this PM
      const { data: taskData, error: taskError } = await db.getTasks();
      if (taskError) throw taskError;
      
      // Filter tasks for projects this PM manages
      const myProjectIds = myProjects.map(p => p.id);
      const myTasks = taskData?.filter(t => myProjectIds.includes(t.project_id)) || [];
      
      // Transform the data to match the Task interface
      const transformedTasks = myTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        projectName: task.projects?.name || 'Unknown Project',
        assigneeId: task.assignee_id,
        assigneeName: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : 'Unassigned',
        status: task.status,
        priority: task.priority,
        dueDate: new Date(task.due_date),
        estimatedHours: task.estimated_hours || 0,
        actualHours: task.actual_hours || 0,
        tags: task.tags || [],
        createdAt: new Date(task.created_at)
      }));
      
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    priority: 'medium' as const,
    dueDate: '',
    estimatedHours: 1,
    tags: [] as string[]
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || colors.todo;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-gray-500',
      'medium': 'text-yellow-500',
      'high': 'text-orange-500',
      'critical': 'text-red-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assigneeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.projectId || !newTask.assigneeId || !profile) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        project_id: newTask.projectId,
        assignee_id: newTask.assigneeId,
        created_by: profile.id,
        status: 'todo',
        priority: newTask.priority,
        due_date: newTask.dueDate,
        estimated_hours: newTask.estimatedHours,
        tags: newTask.tags,
        created_at: new Date().toISOString()
      };

      const { data, error } = await db.createTask(taskData);
      
      if (error) throw error;

      if (data) {
        // Create notification for assignee
        await db.createNotification({
          user_id: newTask.assigneeId,
          title: 'New Task Assignment',
          message: `You have been assigned: ${newTask.title}`,
          type: 'task_assignment',
          project_id: newTask.projectId,
          task_id: data.id,
          is_read: false,
          created_at: new Date().toISOString()
        });

        toast.success('Task created successfully!');
        loadData(); // Reload data to show the new task
        
        // Reset form
        setNewTask({
          title: '',
          description: '',
          projectId: '',
          assigneeId: '',
          priority: 'medium',
          dueDate: '',
          estimatedHours: 1,
          tags: []
        });
        setShowCreateTask(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: CheckSquare,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length,
      icon: Clock,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Under Review',
      value: tasks.filter(t => t.status === 'review').length,
      icon: Target,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Team Members',
      value: teamMembers.length,
      icon: Users,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
          <p className="text-gray-600">Break down admin-assigned projects into tasks for your team members</p>
        </div>
        <button
          onClick={() => setShowCreateTask(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Tasks</h2>
            <div className="flex space-x-4">
              {/* Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
              </select>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                          <div className="flex items-center space-x-1">
                            <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.actualHours || 0}h / {task.estimatedHours}h</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">{task.projectName}</span>
                        </div>
                        <div>
                          <span>Assigned to: <strong>{task.assigneeName}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex space-x-2">
                        {task.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-600">
                    {tasks.length === 0 
                      ? 'No tasks created yet. Create your first task to get started.' 
                      : 'No tasks match the selected filter or search criteria.'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
              <button 
                onClick={() => setShowCreateTask(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the task..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to</label>
                <select
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assigneeId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Team Member</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.first_name} {member.last_name} ({member.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours: {newTask.estimatedHours}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateTask(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;