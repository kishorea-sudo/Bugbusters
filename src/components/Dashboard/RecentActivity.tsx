import React from 'react';
import { Activity } from '../../types';
import { FileText, Check, X, MessageSquare, Upload } from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'file.uploaded':
        return Upload;
      case 'deliverable.approved':
        return Check;
      case 'deliverable.rejected':
        return X;
      case 'comment.added':
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'file.uploaded':
        return 'text-blue-600 bg-blue-50';
      case 'deliverable.approved':
        return 'text-green-600 bg-green-50';
      case 'deliverable.rejected':
        return 'text-red-600 bg-red-50';
      case 'comment.added':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'file.uploaded':
        return `uploaded ${activity.payload.fileName}`;
      case 'deliverable.approved':
        return `approved deliverable`;
      case 'deliverable.rejected':
        return `rejected deliverable`;
      case 'comment.added':
        return `added a comment`;
      default:
        return 'performed an action';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.slice(0, 6).map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClasses = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${colorClasses}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">User {activity.actorId}</span>{' '}
                  {formatActivityMessage(activity)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;