'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckSquareIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from '@/components/icons/DashboardIcons';
import { Task, TaskStatus, TaskPriority } from '@/types/dashboard';
import { getWorkspaceStore, getDefaultWorkspaceStore, saveWorkspaceStore } from '@/lib/dashboardStore';

function TasksContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const initialId = searchParams.get('id');

  const [workspace, setWorkspace] = useState(getDefaultWorkspaceStore());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Modals & Drawers
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(initialAction === 'new');
  const [detailsDrawerTask, setDetailsDrawerTask] = useState<Task | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Operations');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistItems, setNewChecklistItems] = useState<{ id: string; title: string; completed: boolean }[]>([]);

  // New Comment State in Details Drawer
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    const store = getWorkspaceStore();
    setWorkspace(store);
    setTasks(store.tasks);
    if (store.staff.length > 0 && !newTaskAssignee) {
      setNewTaskAssignee(store.staff[0].name);
    }
    const handleUpdate = () => {
      const updatedStore = getWorkspaceStore();
      setWorkspace(updatedStore);
      setTasks(updatedStore.tasks);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, []);

  // Handle direct link with task ID
  useEffect(() => {
    if (initialId) {
      const found = tasks.find((t) => t.id === initialId);
      if (found) setDetailsDrawerTask(found);
    }
  }, [initialId, tasks]);

  const handleAddChecklistItem = () => {
    if (newChecklistText.trim()) {
      setNewChecklistItems([
        ...newChecklistItems,
        { id: `chk-${Date.now()}`, title: newChecklistText.trim(), completed: false },
      ]);
      setNewChecklistText('');
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const matchedStaff = workspace.staff.find((s) => s.name === newTaskAssignee);

    const created: Task = {
      id: `TSK-${Date.now().toString().slice(-3)}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: 'To Do',
      priority: newTaskPriority,
      assigneeName: newTaskAssignee || workspace.user.name,
      assigneeEmail: matchedStaff?.email || workspace.user.email,
      dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      category: newTaskCategory,
      checklist: newChecklistItems,
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: workspace.user.name,
    };

    const updatedTasks = [created, ...tasks];
    setTasks(updatedTasks);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      tasks: updatedTasks,
      activities: [
        {
          id: `act-${Date.now()}`,
          userName: curStore.user.name,
          userRole: curStore.user.role,
          action: `Created task: "${created.title}"`,
          recordAffected: `Task ${created.id}`,
          module: 'Tasks',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
        ...curStore.activities,
      ],
    });

    setCreateModalOpen(false);
    // Reset form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewChecklistItems([]);
  };

  const handleToggleChecklistInDrawer = (chkId: string) => {
    if (!detailsDrawerTask) return;
    const updatedChecklist = detailsDrawerTask.checklist.map((item) =>
      item.id === chkId ? { ...item, completed: !item.completed } : item
    );
    const updatedTask = { ...detailsDrawerTask, checklist: updatedChecklist };
    setDetailsDrawerTask(updatedTask);
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updatedTasks);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({ ...curStore, tasks: updatedTasks });
  };

  const handleStatusChangeInDrawer = (newStatus: TaskStatus) => {
    if (!detailsDrawerTask) return;
    const updatedTask = { ...detailsDrawerTask, status: newStatus };
    setDetailsDrawerTask(updatedTask);
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updatedTasks);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({ ...curStore, tasks: updatedTasks });
  };

  const handleAddComment = () => {
    if (!detailsDrawerTask || !commentInput.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: workspace.user.name,
      content: commentInput.trim(),
      createdAt: 'Just now',
    };
    const updatedTask = {
      ...detailsDrawerTask,
      comments: [...detailsDrawerTask.comments, newComment],
    };
    setDetailsDrawerTask(updatedTask);
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updatedTasks);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({ ...curStore, tasks: updatedTasks });
    setCommentInput('');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({ ...curStore, tasks: updatedTasks });
    if (detailsDrawerTask?.id === taskId) setDetailsDrawerTask(null);
    setConfirmDeleteId(null);
  };

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    const matchesTab = activeTab === 'All' || t.status === activeTab;
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchesQuery =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesPriority && matchesQuery;
  });

  const tabs: (TaskStatus | 'All')[] = ['All', 'To Do', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case 'To Do': return 'todo';
      case 'In Progress': return 'progress';
      case 'Completed': return 'completed';
      case 'Overdue': return 'overdue';
      case 'Cancelled': return 'cancelled';
      default: return 'todo';
    }
  };

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <CheckSquareIcon size={24} style={{ color: '#2563eb' }} />
            Task Management
          </h1>
          <p>Organize, assign, and track workflows and assignments across departments.</p>
        </div>

        <div className="page-controls-group">
          <button type="button" className="btn-primary" onClick={() => setCreateModalOpen(true)}>
            <PlusIcon size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* ---------- STATUS TABS ---------- */}
      <div className="dash-tabs-bar">
        {tabs.map((tab) => {
          const count = tab === 'All' ? tasks.length : tasks.filter((t) => t.status === tab).length;
          return (
            <button
              key={tab}
              type="button"
              className={`dash-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
              <span className="tab-counter">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- SEARCH & FILTERS BAR ---------- */}
      <div className="table-filter-bar">
        <div className="search-input-wrap">
          <SearchIcon size={16} />
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search tasks, assignees, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls-wrap">
          <select
            className="dash-select-filter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* ---------- TASKS DATA TABLE (PAGE 15) ---------- */}
      <div className="dash-table-wrapper">
        {filteredTasks.length > 0 ? (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} style={{ cursor: 'pointer' }} onClick={() => setDetailsDrawerTask(task)}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="table-primary-text">{task.title}</span>
                      <span className="table-sub-text">{task.id} {task.projectName ? `• ${task.projectName}` : ''}</span>
                    </div>
                  </td>
                  <td>
                    <span className="table-primary-text" style={{ fontSize: '13px' }}>{task.assigneeName}</span>
                  </td>
                  <td>
                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${getStatusClass(task.status)}`}>
                      <span className={`task-status-dot dot-${getStatusClass(task.status)}`}></span>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className="table-sub-text" style={{ fontWeight: 600, color: task.status === 'Overdue' ? '#dc2626' : '#475569' }}>
                      {task.dueDate}
                    </span>
                  </td>
                  <td>
                    <span className="status-pill todo" style={{ fontSize: '11.5px' }}>{task.category}</span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-table-icon"
                        onClick={() => setDetailsDrawerTask(task)}
                        title="View Details"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-table-icon delete"
                        onClick={() => setConfirmDeleteId(task.id)}
                        title="Delete Task"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="dash-empty-state">
            <div className="empty-icon-circle">
              <CheckSquareIcon size={26} />
            </div>
            <h3>No tasks found in this view</h3>
            <p>Create your first task or change your active filters to view existing tasks.</p>
            <button type="button" className="btn-primary" onClick={() => setCreateModalOpen(true)}>
              <PlusIcon size={16} />
              <span>Create Task</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          PAGE 16: CREATE TASK MODAL
         ============================================================ */}
      {createModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setCreateModalOpen(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>
                <PlusIcon size={20} style={{ color: '#2563eb' }} />
                Create New Task
              </h3>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setCreateModalOpen(false)}
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="dash-modal-body">
                <div className="dash-form-group">
                  <label htmlFor="task-title">
                    Task Title <span className="req">*</span>
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    className="dash-input"
                    placeholder="e.g. Audit Q3 Inventory Levels"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="dash-form-group">
                  <label htmlFor="task-desc">Description</label>
                  <textarea
                    id="task-desc"
                    className="dash-textarea"
                    placeholder="Provide clear details and objectives for this assignment..."
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="dash-form-group">
                    <label htmlFor="task-assignee">Assignee</label>
                    <select
                      id="task-assignee"
                      className="dash-select"
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                    >
                      {workspace.staff.length === 0 ? (
                        <option value={workspace.user.name}>{workspace.user.name} ({workspace.user.role})</option>
                      ) : (
                        workspace.staff.map((staff) => (
                          <option key={staff.id} value={staff.name}>
                            {staff.name} ({staff.role})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="task-priority">Priority</label>
                    <select
                      id="task-priority"
                      className="dash-select"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="task-due-date">Due Date</label>
                    <input
                      id="task-due-date"
                      type="date"
                      className="dash-input"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="task-category">Category</label>
                    <select
                      id="task-category"
                      className="dash-select"
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                    >
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Customers">Customers</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>

                {/* Checklist Builder */}
                <div className="dash-form-group">
                  <label>Checklist Items</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="dash-input"
                      placeholder="Add step/item..."
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddChecklistItem();
                        }
                      }}
                    />
                    <button type="button" className="btn-secondary" onClick={handleAddChecklistItem}>
                      Add
                    </button>
                  </div>

                  {newChecklistItems.map((chk, i) => (
                    <div
                      key={chk.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '4px',
                        fontSize: '13px',
                      }}
                    >
                      <span>{i + 1}. {chk.title}</span>
                      <button
                        type="button"
                        onClick={() => setNewChecklistItems(newChecklistItems.filter((_, idx) => idx !== i))}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dash-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save &amp; Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 17: TASK DETAILS DRAWER
         ============================================================ */}
      {detailsDrawerTask && (
        <div className="dash-drawer-backdrop" onClick={() => setDetailsDrawerTask(null)}>
          <div className="dash-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="dash-drawer-header">
              <div>
                <span className="status-pill progress" style={{ fontSize: '11px', marginBottom: '4px' }}>
                  {detailsDrawerTask.id}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {detailsDrawerTask.title}
                </h3>
              </div>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setDetailsDrawerTask(null)}
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className="dash-drawer-body">
              {/* Status Selector & Priority */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Status
                  </label>
                  <select
                    className="dash-select"
                    value={detailsDrawerTask.status}
                    onChange={(e) => handleStatusChangeInDrawer(e.target.value as TaskStatus)}
                    style={{ marginTop: '4px' }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Priority
                  </label>
                  <div style={{ marginTop: '8px' }}>
                    <span className={`priority-tag ${detailsDrawerTask.priority.toLowerCase()}`}>
                      {detailsDrawerTask.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Description
                </label>
                <p style={{ fontSize: '13.5px', color: '#1e293b', marginTop: '6px', lineHeight: 1.6, background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  {detailsDrawerTask.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Metadata details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block' }}>Assignee</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{detailsDrawerTask.assigneeName}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block' }}>Due Date</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{detailsDrawerTask.dueDate}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block' }}>Created By</span>
                  <span style={{ fontSize: '13px', color: '#0f172a' }}>{detailsDrawerTask.createdBy}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block' }}>Category</span>
                  <span style={{ fontSize: '13px', color: '#0f172a' }}>{detailsDrawerTask.category}</span>
                </div>
              </div>

              {/* Checklist */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Checklist ({detailsDrawerTask.checklist.filter((c) => c.completed).length}/{detailsDrawerTask.checklist.length})
                  </label>
                </div>
                {detailsDrawerTask.checklist.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {detailsDrawerTask.checklist.map((item) => (
                      <label
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          background: item.completed ? '#f0fdf4' : '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklistInDrawer(item.id)}
                        />
                        <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#15803d' : '#0f172a' }}>
                          {item.title}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12.5px', color: '#94a3b8' }}>No checklist items for this task.</p>
                )}
              </div>

              {/* Comments Thread */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Activity &amp; Comments ({detailsDrawerTask.comments.length})
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  {detailsDrawerTask.comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: '10px 14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                        <span>{comment.author}</span>
                        <span style={{ fontWeight: 400, color: '#94a3b8' }}>{comment.createdAt}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="dash-input"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <button type="button" className="btn-secondary" onClick={handleAddComment}>
                    Send
                  </button>
                </div>
              </div>
            </div>

            <div className="dash-drawer-footer">
              <button
                type="button"
                className="btn-danger"
                style={{ fontSize: '13px', padding: '8px 14px' }}
                onClick={() => setConfirmDeleteId(detailsDrawerTask.id)}
              >
                Delete Task
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setDetailsDrawerTask(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- CONFIRMATION MODAL (PAGE 45) ---------- */}
      {confirmDeleteId && (
        <div className="dash-modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="dash-modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-body">
              <div className="confirm-icon-box">
                <AlertTriangleIcon size={28} />
              </div>
              <h3 className="confirm-title">Delete Task?</h3>
              <p className="confirm-desc">
                Are you sure you want to delete task <strong>#{confirmDeleteId}</strong>? This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button type="button" className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </button>
                <button type="button" className="btn-danger" onClick={() => handleDeleteTask(confirmDeleteId)}>
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="dash-panel-card" style={{ padding: '24px', textAlign: 'center' }}>Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}
