import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { 
  getLead, 
  updateLead, 
  deleteLead, 
  getLeadNotes, 
  createLeadNote, 
  getLeadTasks, 
  createLeadTask, 
  updateLeadTask 
} from '../../lib/leads'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Modal from '../ui/Modal'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const {
  FiArrowLeft,
  FiEdit3,
  FiSave,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiUser
} = FiIcons

const LeadDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [lead, setLead] = useState(null)
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    status: 'new',
    notes: '',
    lead_source: 'manual_entry'
  })
  
  const [newNote, setNewNote] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: ''
  })

  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'bg-purple-100 text-purple-800' },
    { value: 'follow_up', label: 'Follow-Up', color: 'bg-orange-100 text-orange-800' },
    { value: 'closed_won', label: 'Closed Won', color: 'bg-green-100 text-green-800' },
    { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' }
  ]

  const leadSourceOptions = [
    { value: 'manual_entry', label: 'Manual Entry' },
    { value: 'website_form', label: 'Website Form' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'networking_event', label: 'Networking Event' },
    { value: 'cold_outreach', label: 'Cold Outreach' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    loadLead()
    loadNotes()
    loadTasks()
  }, [id])

  const loadLead = async () => {
    try {
      setLoading(true)
      const data = await getLead(id, user.id)
      setLead(data)
      setFormData({
        full_name: data.full_name,
        email: data.email || '',
        phone: data.phone || '',
        status: data.status,
        notes: data.notes || '',
        lead_source: data.lead_source || 'manual_entry'
      })
    } catch (error) {
      console.error('Error loading lead:', error)
      navigate('/dashboard/leads')
    } finally {
      setLoading(false)
    }
  }

  const loadNotes = async () => {
    try {
      const data = await getLeadNotes(id, user.id)
      setNotes(data)
    } catch (error) {
      console.error('Error loading notes:', error)
    }
  }

  const loadTasks = async () => {
    try {
      const data = await getLeadTasks(id, user.id)
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedLead = await updateLead(id, formData, user.id)
      setLead(updatedLead)
      setEditing(false)
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Failed to update lead')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteLead(id, user.id)
      navigate('/dashboard/leads')
    } catch (error) {
      console.error('Error deleting lead:', error)
      alert('Failed to delete lead')
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    
    try {
      await createLeadNote(id, newNote, user.id)
      setNewNote('')
      setShowNoteModal(false)
      loadNotes()
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Failed to add note')
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return
    
    try {
      await createLeadTask(id, newTask, user.id)
      setNewTask({ title: '', description: '', due_date: '' })
      setShowTaskModal(false)
      loadTasks()
    } catch (error) {
      console.error('Error adding task:', error)
      alert('Failed to add task')
    }
  }

  const handleToggleTask = async (taskId, completed) => {
    try {
      await updateLeadTask(taskId, { completed }, user.id)
      loadTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig?.color || 'bg-gray-100'}`}>
        {statusConfig?.label || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-picton-blue"></div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-polynesian-blue/70">Lead not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/leads')}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>Back to Leads</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          {!editing && (
            <Button
              variant="outline"
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiEdit3} className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Lead Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <SafeIcon icon={FiUser} className="w-6 h-6 text-picton-blue" />
            <h2 className="text-xl font-semibold text-polynesian-blue">Lead Details</h2>
            {!editing && getStatusBadge(lead.status)}
          </div>

          {editing ? (
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-polynesian-blue mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-polynesian-blue mb-2">
                  Lead Source
                </label>
                <select
                  value={formData.lead_source}
                  onChange={(e) => setFormData(prev => ({ ...prev, lead_source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-picton-blue"
                >
                  {leadSourceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-polynesian-blue mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="flex items-center space-x-2 text-polynesian-blue/70">
                      <SafeIcon icon={FiUser} className="w-4 h-4" />
                      <span>{lead.full_name}</span>
                    </p>
                    {lead.email && (
                      <p className="flex items-center space-x-2 text-polynesian-blue/70">
                        <SafeIcon icon={FiMail} className="w-4 h-4" />
                        <span>{lead.email}</span>
                      </p>
                    )}
                    {lead.phone && (
                      <p className="flex items-center space-x-2 text-polynesian-blue/70">
                        <SafeIcon icon={FiPhone} className="w-4 h-4" />
                        <span>{lead.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-polynesian-blue mb-2">Lead Information</h4>
                  <div className="space-y-2">
                    <p className="text-polynesian-blue/70">
                      <span className="font-medium">Source:</span> {leadSourceOptions.find(s => s.value === lead.lead_source)?.label || lead.lead_source}
                    </p>
                    <p className="text-polynesian-blue/70">
                      <span className="font-medium">Created:</span> {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-polynesian-blue/70">
                      <span className="font-medium">Last Updated:</span> {new Date(lead.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              {lead.notes && (
                <div>
                  <h4 className="font-medium text-polynesian-blue mb-2">Initial Notes</h4>
                  <p className="text-polynesian-blue/70 bg-anti-flash-white p-4 rounded-lg">
                    {lead.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Notes and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMessageSquare} className="w-5 h-5 text-picton-blue" />
              <h3 className="text-lg font-medium text-polynesian-blue">Notes</h3>
            </div>
            <Button
              size="sm"
              onClick={() => setShowNoteModal(true)}
              className="flex items-center space-x-1"
            >
              <SafeIcon icon={FiPlus} className="w-3 h-3" />
              <span>Add Note</span>
            </Button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-polynesian-blue/50 italic text-center py-8">No notes yet</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="bg-anti-flash-white p-3 rounded-lg">
                  <p className="text-polynesian-blue/80 text-sm mb-2">{note.content}</p>
                  <p className="text-polynesian-blue/50 text-xs">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="w-5 h-5 text-picton-blue" />
              <h3 className="text-lg font-medium text-polynesian-blue">Tasks</h3>
            </div>
            <Button
              size="sm"
              onClick={() => setShowTaskModal(true)}
              className="flex items-center space-x-1"
            >
              <SafeIcon icon={FiPlus} className="w-3 h-3" />
              <span>Add Task</span>
            </Button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-polynesian-blue/50 italic text-center py-8">No tasks yet</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleToggleTask(task.id, !task.completed)}
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${
                        task.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-picton-blue'
                      }`}
                    >
                      {task.completed && <SafeIcon icon={FiCheckCircle} className="w-3 h-3" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? 'text-green-800 line-through' : 'text-polynesian-blue'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.completed ? 'text-green-600' : 'text-polynesian-blue/70'}`}>
                          {task.description}
                        </p>
                      )}
                      {task.due_date && (
                        <p className={`text-xs mt-1 flex items-center space-x-1 ${task.completed ? 'text-green-500' : 'text-polynesian-blue/50'}`}>
                          <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Lead"
      >
        <div className="space-y-4">
          <p className="text-polynesian-blue/70">
            Are you sure you want to delete this lead? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Note"
      >
        <div className="space-y-4">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            rows={4}
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowNoteModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
            >
              Add Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Add Task"
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Follow up with lead"
            required
          />
          <Textarea
            label="Description (Optional)"
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Additional details..."
            rows={3}
          />
          <Input
            label="Due Date (Optional)"
            type="datetime-local"
            value={newTask.due_date}
            onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowTaskModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
            >
              Add Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LeadDetails