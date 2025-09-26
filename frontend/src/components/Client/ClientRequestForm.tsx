import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/SupabaseAuthContext';
import * as db from '../../lib/supabase';
import toast from 'react-hot-toast';

const ClientRequestForm: React.FC = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    budget: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setIsSubmitting(true);
    try {
      // Create client request
      const { data: request, error } = await db.createClientRequest({
        client_id: profile.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        deadline: formData.deadline,
        budget: parseFloat(formData.budget) || null,
        requirements: formData.requirements,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      if (request) {
        // Create notification for all admins
        const { data: admins } = await db.getAdmins();
        
        for (const admin of admins || []) {
          await db.createNotification({
            user_id: admin.id,
            title: 'New Client Request',
            message: `New request: ${formData.title}`,
            type: 'client_request',
            request_id: request.id,
            is_read: false,
            created_at: new Date().toISOString()
          });
        }

        toast.success('Request submitted successfully!');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          deadline: '',
          budget: '',
          requirements: ''
        });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Submit New Request</h2>
        <p className="text-gray-600">Describe your project requirements and we'll get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., E-commerce Website Development"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide detailed description of your project..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget (Optional)
          </label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your budget"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
          </label>
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any specific requirements or features..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientRequestForm;