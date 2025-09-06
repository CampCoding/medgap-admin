import React, { useState } from 'react';
import { 
  BookOpen, 
  Eye, 
  Edit3, 
  MoreVertical, 
  Plus, 
  X, 
  Save, 
  Trash2, 
  Copy, 
  Move,
  AlertTriangle,
  Check,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';

export default function InteractiveQuestionsTab() {
  const [activeTab, setActiveTab] = useState("questions");
  const [questionsData, setQuestionsData] = useState([
    {
      id: 1,
      question: 'Solve for x: 2x + 5 = 17',
      type: 'Multiple Choice',
      points: 5,
      difficulty: 'Easy',
      correctAnswer: 'x = 6',
      options: ['x = 4', 'x = 6', 'x = 8', 'x = 10'],
      correctRate: 85
    },
    {
      id: 2,
      question: 'Factor the expression: x² - 9x + 14',
      type: 'Short Answer',
      points: 8,
      difficulty: 'Medium',
      correctAnswer: '(x - 2)(x - 7)',
      correctRate: 68
    },
    {
      id: 3,
      question: 'Graph the inequality: y ≤ 2x + 3',
      type: 'Essay',
      points: 12,
      difficulty: 'Hard',
      correctAnswer: 'Graph with shaded region below the line',
      correctRate: 45
    }
  ]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    question: '',
    type: 'Multiple Choice',
    points: 5,
    difficulty: 'Easy',
    correctAnswer: '',
    options: ['', '', '', ''],
    explanation: ''
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handleAddQuestion = () => {
    setFormData({
      question: '',
      type: 'Multiple Choice',
      points: 5,
      difficulty: 'Easy',
      correctAnswer: '',
      options: ['', '', '', ''],
      explanation: ''
    });
    setShowAddModal(true);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setFormData({
      question: question.question,
      type: question.type,
      points: question.points,
      difficulty: question.difficulty,
      correctAnswer: question.correctAnswer,
      options: question.options || ['', '', '', ''],
      explanation: question.explanation || ''
    });
    setShowEditModal(true);
    setDropdownOpen(null);
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setShowViewModal(true);
    setDropdownOpen(null);
  };

  const handleDeleteQuestion = (question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
    setDropdownOpen(null);
  };

  const handleDuplicateQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: Math.max(...questionsData.map(q => q.id)) + 1,
      question: `${question.question} (Copy)`
    };
    setQuestionsData([...questionsData, newQuestion]);
    setDropdownOpen(null);
  };

  const confirmDelete = () => {
    setQuestionsData(questionsData.filter(q => q.id !== selectedQuestion.id));
    setShowDeleteModal(false);
    setSelectedQuestion(null);
  };

  const handleSaveQuestion = () => {
    if (selectedQuestion) {
      // Edit existing question
      setQuestionsData(questionsData.map(q => 
        q.id === selectedQuestion.id 
          ? { ...q, ...formData, id: selectedQuestion.id }
          : q
      ));
      setShowEditModal(false);
    } else {
      // Add new question
      const newQuestion = {
        ...formData,
        id: Math.max(...questionsData.map(q => q.id)) + 1,
        correctRate: 0
      };
      setQuestionsData([...questionsData, newQuestion]);
      setShowAddModal(false);
    }
    setSelectedQuestion(null);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const filteredQuestions = questionsData.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || question.type === typeFilter;
    return matchesSearch && matchesDifficulty && matchesType;
  });

   const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#202938]">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const QuestionForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#202938] mb-2">Question</label>
        <textarea
          value={formData.question}
          onChange={(e) => handleFormChange('question', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none"
          placeholder="Enter your question here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#202938] mb-2">Question Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleFormChange('type', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none bg-white"
          >
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Short Answer">Short Answer</option>
            <option value="Essay">Essay</option>
            <option value="True/False">True/False</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#202938] mb-2">Points</label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => handleFormChange('points', parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#202938] mb-2">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => handleFormChange('difficulty', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none bg-white"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {formData.type === 'Multiple Choice' && (
        <div>
          <label className="block text-sm font-medium text-[#202938] mb-2">Answer Options</label>
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {String.fromCharCode(65 + index)}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none"
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === option}
                  onChange={() => handleFormChange('correctAnswer', option)}
                  className="w-4 h-4 text-[#0F7490] focus:ring-[#0F7490]"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Select the radio button next to the correct answer</p>
        </div>
      )}

      {formData.type !== 'Multiple Choice' && (
        <div>
          <label className="block text-sm font-medium text-[#202938] mb-2">Correct Answer</label>
          <textarea
            value={formData.correctAnswer}
            onChange={(e) => handleFormChange('correctAnswer', e.target.value)}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none"
            placeholder="Enter the correct answer..."
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#202938] mb-2">Explanation (Optional)</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => handleFormChange('explanation', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none"
          placeholder="Provide an explanation for the correct answer..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          className="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveQuestion}
          className="px-6 py-3 bg-[#0F7490] text-white rounded-lg hover:bg-[#0D6680] transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {selectedQuestion ? 'Update Question' : 'Add Question'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        {activeTab === "questions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#202938]">
                  Questions ({filteredQuestions.length})
                </h3>
                <button 
                  onClick={handleAddQuestion}
                  className="bg-[#0F7490] text-white px-4 py-2 rounded-lg hover:bg-[#0D6680] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none bg-white"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Essay">Essay</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="divide-y divide-gray-100">
              {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No questions found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || difficultyFilter !== 'all' || typeFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Get started by adding your first question'
                    }
                  </p>
                  <button 
                    onClick={handleAddQuestion}
                    className="bg-[#0F7490] text-white px-4 py-2 rounded-lg hover:bg-[#0D6680] transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </button>
                </div>
              ) : (
                filteredQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#0F7490] text-white text-sm font-medium px-2 py-1 rounded">
                            Q{questionsData.findIndex(q => q.id === question.id) + 1}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </span>
                          <span className="text-sm text-gray-600">
                            {question.type}
                          </span>
                          <span className="text-sm font-medium text-[#202938]">
                            {question.points} pts
                          </span>
                        </div>
                        <h4 className="text-[#202938] font-medium mb-3">
                          {question.question}
                        </h4>
                        {question.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded border text-sm ${
                                  option === question.correctAnswer
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {option === question.correctAnswer && (
                                  <Check className="w-3 h-3 inline ml-2 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            Correct Rate:{" "}
                            <strong className="text-[#0F7490]">
                              {question.correctRate}%
                            </strong>
                          </span>
                          {!question.options && (
                            <span>
                              Answer:{" "}
                              <strong className="text-green-600">
                                {question.correctAnswer}
                              </strong>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button 
                          onClick={() => handleViewQuestion(question)}
                          className="p-2 text-gray-400 hover:text-[#0F7490] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Question"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditQuestion(question)}
                          className="p-2 text-gray-400 hover:text-[#C9AE6C] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Question"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setDropdownOpen(dropdownOpen === question.id ? null : question.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {dropdownOpen === question.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleDuplicateQuestion(question)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                              >
                                <Copy className="w-4 h-4" />
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add Question Modal */}
        <Modal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          title="Add New Question"
          size="lg"
        >
          <QuestionForm />
        </Modal>

        {/* Edit Question Modal */}
        <Modal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          title="Edit Question"
          size="lg"
        >
          <QuestionForm />
        </Modal>

        {/* View Question Modal */}
        <Modal 
          isOpen={showViewModal} 
          onClose={() => setShowViewModal(false)} 
          title="Question Details"
          size="md"
        >
          {selectedQuestion && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#0F7490] text-white text-sm font-medium px-3 py-1 rounded">
                    Question {questionsData.findIndex(q => q.id === selectedQuestion.id) + 1}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                    {selectedQuestion.difficulty}
                  </span>
                  <span className="text-sm text-gray-600">{selectedQuestion.type}</span>
                  <span className="text-sm font-medium text-[#202938]">{selectedQuestion.points} pts</span>
                </div>
                <h3 className="text-lg font-medium text-[#202938] mb-4">{selectedQuestion.question}</h3>
                
                {selectedQuestion.options && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-[#202938]">Answer Options:</h4>
                    {selectedQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          option === selectedQuestion.correctAnswer
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{String.fromCharCode(65 + index)}. {option}</span>
                          {option === selectedQuestion.correctAnswer && (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                              <Check className="w-4 h-4" />
                              Correct
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!selectedQuestion.options && (
                  <div className="mb-4">
                    <h4 className="font-medium text-[#202938] mb-2">Correct Answer:</h4>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      {selectedQuestion.correctAnswer}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Correct Rate:</span>
                      <span className="font-semibold text-blue-900 ml-2">{selectedQuestion.correctRate}%</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Points:</span>
                      <span className="font-semibold text-blue-900 ml-2">{selectedQuestion.points}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)} 
          title="Delete Question"
          size="sm"
        >
          {selectedQuestion && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-900">Are you sure?</h4>
                  <p className="text-sm text-red-700">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Question to be deleted:</p>
                <p className="font-medium text-[#202938]">{selectedQuestion.question}</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Question
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Click outside to close dropdowns */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setDropdownOpen(null)}
        />
      )}
    </div>
  );
}