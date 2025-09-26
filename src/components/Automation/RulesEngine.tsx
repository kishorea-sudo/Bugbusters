import React, { useState } from 'react';
import { Plus, Trash2, Power, Edit, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Rule, RuleCondition, RuleAction } from '../../types';

interface RulesEngineProps {
  rules: Rule[];
  onCreateRule: (rule: Omit<Rule, 'id' | 'createdAt'>) => void;
  onUpdateRule: (id: string, updates: Partial<Rule>) => void;
  onDeleteRule: (id: string) => void;
}

const RulesEngine: React.FC<RulesEngineProps> = ({
  rules,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const [newRule, setNewRule] = useState<{
    name: string;
    description: string;
    trigger: string;
    conditions: RuleCondition[];
    actions: RuleAction[];
    active: boolean;
  }>({
    name: '',
    description: '',
    trigger: 'file.upload',
    conditions: [{ field: 'requiresReview', operator: 'equals', value: 'true' }],
    actions: [{ type: 'update_status', params: { status: 'review' } }],
    active: true,
  });

  const triggerOptions = [
    { value: 'file.upload', label: 'File Upload' },
    { value: 'deliverable.approved', label: 'Deliverable Approved' },
    { value: 'deliverable.rejected', label: 'Deliverable Rejected' },
    { value: 'project.created', label: 'Project Created' },
    { value: 'comment.added', label: 'Comment Added' },
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
  ];

  const actionTypeOptions = [
    { value: 'update_status', label: 'Update Status' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'assign_user', label: 'Assign User' },
    { value: 'create_activity', label: 'Create Activity' },
  ];

  const addCondition = () => {
    setNewRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: 'equals', value: '' }],
    }));
  };

  const removeCondition = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const updateCondition = (index: number, updates: Partial<RuleCondition>) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, ...updates } : condition
      ),
    }));
  };

  const addAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'update_status', params: {} }],
    }));
  };

  const removeAction = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  const updateAction = (index: number, updates: Partial<RuleAction>) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) =>
        i === index ? { ...action, ...updates } : action
      ),
    }));
  };

  const handleCreateRule = () => {
    if (!newRule.name.trim()) {
      toast.error('Rule name is required');
      return;
    }

    onCreateRule(newRule);
    setNewRule({
      name: '',
      description: '',
      trigger: 'file.upload',
      conditions: [{ field: 'requiresReview', operator: 'equals', value: 'true' }],
      actions: [{ type: 'update_status', params: { status: 'review' } }],
      active: true,
    });
    setShowCreateModal(false);
    toast.success('Rule created successfully!');
  };

  const toggleRuleActive = (rule: Rule) => {
    onUpdateRule(rule.id, { active: !rule.active });
    toast.success(`Rule ${rule.active ? 'deactivated' : 'activated'}`);
  };

  const toggleExpanded = (ruleId: string) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const testRule = (rule: Rule) => {
    toast.success(`Testing rule: ${rule.name}...`);
    setTimeout(() => {
      toast.success('✅ Rule executed successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation Rules</h2>
          <p className="text-gray-600">Create workflow automation rules to streamline your processes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </button>
      </div>

      {/* Existing Rules */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`border rounded-lg transition-all ${
              rule.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleExpanded(rule.id)}
                    className="p-1 hover:bg-white rounded"
                  >
                    {expandedRules.has(rule.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {rule.name}
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          rule.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => testRule(rule)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    title="Test Rule"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Edit Rule"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleRuleActive(rule)}
                    className={`p-2 rounded-lg ${
                      rule.active
                        ? 'text-red-600 hover:bg-red-100'
                        : 'text-green-600 hover:bg-green-100'
                    }`}
                    title={rule.active ? 'Deactivate' : 'Activate'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onDeleteRule(rule.id);
                      toast.success('Rule deleted');
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedRules.has(rule.id) && (
                <div className="mt-4 pt-4 border-t bg-white rounded p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Trigger & Conditions</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">When:</span> {rule.trigger}
                        </div>
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                            {condition.field} {condition.operator} {String(condition.value)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                      <div className="space-y-2">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="text-sm bg-green-50 p-2 rounded">
                            {action.type}: {JSON.stringify(action.params)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No automation rules</h3>
            <p className="text-gray-600 mb-4">Create your first rule to automate workflows</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Rule
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Rule Modal */}
      {(showCreateModal || editingRule) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingRule(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Auto-approve uploads"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger Event
                  </label>
                  <select
                    value={newRule.trigger}
                    onChange={(e) => setNewRule(prev => ({ ...prev, trigger: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {triggerOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Automatically set deliverables to review when uploaded"
                />
              </div>

              {/* Conditions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Conditions</h4>
                  <button
                    onClick={addCondition}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Condition
                  </button>
                </div>

                <div className="space-y-3">
                  {newRule.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        value={condition.field}
                        onChange={(e) => updateCondition(index, { field: e.target.value })}
                        placeholder="Field name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, { operator: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        {operatorOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={String(condition.value)}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      {newRule.conditions.length > 1 && (
                        <button
                          onClick={() => removeCondition(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Actions</h4>
                  <button
                    onClick={addAction}
                    className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Action
                  </button>
                </div>

                <div className="space-y-3">
                  {newRule.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <select
                        value={action.type}
                        onChange={(e) => updateAction(index, { type: e.target.value as any })}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        {actionTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={JSON.stringify(action.params)}
                        onChange={(e) => {
                          try {
                            updateAction(index, { params: JSON.parse(e.target.value) });
                          } catch (error) {
                            // Handle invalid JSON gracefully
                          }
                        }}
                        placeholder='{"status": "review"}'
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                      {newRule.actions.length > 1 && (
                        <button
                          onClick={() => removeAction(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRule(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRule}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesEngine;