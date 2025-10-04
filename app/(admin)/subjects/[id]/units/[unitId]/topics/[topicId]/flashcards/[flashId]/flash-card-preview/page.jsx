"use client";
import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  XCircle,
  Clock,
  Trophy,
  Target,
  BookOpen,
  Play,
  Pause,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

// ✅ Thunks from slice
import {
  handleGetFlashcards,            // GET cards for a library (flashId)
  handleCreateCardsOfFlashCards,  // POST create a card
  handleDeleteCardsOfFlashCards,                 // PUT/PATCH edit a card
  handleEditCardsOfFlashCards,               // DELETE a card
} from "../../../../../../../../../../../features/flashcardsSlice";

export default function PreviewFlashCard({ onClose }) {
  const { flashId } = useParams(); // library_id
  const dispatch = useDispatch();
  const { flashcards_list } = useSelector((s) => s?.flashcards);

  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [studyMode, setStudyMode] = useState("manual"); // manual | auto | quiz
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    startTime: Date.now(),
  });
  const [showStats, setShowStats] = useState(false);
  const [cardHistory, setCardHistory] = useState([]);

  // Create/Edit modal state
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardSaving, setCardSaving] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [cardForm, setCardForm] = useState({
    front_text: "",
    back_text: "",
    hint: "",
    difficulty_level: "medium",
    card_order: 1,
    status: "active",
  });
  const [cardErrors, setCardErrors] = useState({});

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load all cards in this library/deck
  useEffect(() => {
    if (flashId) dispatch(handleGetFlashcards({ id: flashId }));
  }, [dispatch, flashId]);

  // Derive topic_id if present (may be null in your payload)
  const derivedTopicId = useMemo(() => {
    const arr = flashcards_list?.data?.flashcards;
    return Array.isArray(arr) && arr.length ? arr[0]?.topic_id ?? null : null;
  }, [flashcards_list]);

  // Normalize API cards for UI (matches your sample payload exactly)
  const cards = useMemo(() => {
    const api = flashcards_list?.data?.flashcards;
    if (Array.isArray(api) && api.length) {
      const libName = flashcards_list?.data?.library?.library_name ?? "Card";
      return api.map((c) => ({
        _raw: c,
        id: c.flashcard_id,                          // backend id
        question: c.front_text ?? "",                // front
        answer: c.back_text ?? "",                   // back
        category: libName,                           // show library name as category
        difficulty: c.difficulty_level ?? "medium",  // badge
        tags: [],                                    // no tags in payload
        created_at: c.created_at,
        difficulty_level: c.difficulty_level ?? "medium",
        status: c.status ?? "active",
        card_order: c.card_order ?? 1,
      }));
    }
    // fallback demo if API returns empty
    return [];
  }, [flashcards_list]);

  // Keep pointer in range if list changes
  useEffect(() => {
    setCurrentCard((idx) => (cards.length === 0 ? 0 : Math.min(idx, cards.length - 1)));
  }, [cards.length]);

  const currentCardData = cards.length ? cards[currentCard] : null;

  const getDifficultyColor = (difficulty = "") => {
    switch ((difficulty || "").toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "—";
    }
  };

  // Flip / nav / stats
  const handleFlip = () => {
    if (!currentCardData) return;
    setIsFlipped((f) => !f);
    if (!isFlipped) {
      setCardHistory((prev) => [
        ...prev,
        {
          cardId: currentCardData.id,
          timestamp: Date.now(),
          timeToFlip: Date.now() - studyStats.startTime,
        },
      ]);
    }
  };

  const handleNext = () => {
    if (!cards.length) return;
    setCurrentCard((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    if (!cards.length) return;
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const handleAnswerFeedback = (isCorrect) => {
    setStudyStats((prev) => ({
      ...prev,
      [isCorrect ? "correct" : "incorrect"]: prev[isCorrect ? "correct" : "incorrect"] + 1,
    }));
    setTimeout(() => handleNext(), 500);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
      setIsAutoPlaying(false);
      return;
    }
    const interval = setInterval(() => {
      if (isFlipped) handleNext();
      else setIsFlipped(true);
    }, 3000);
    setAutoPlayInterval(interval);
    setIsAutoPlaying(true);
  };

  useEffect(() => {
    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
  }, [autoPlayInterval]);

  const getStudyTime = () => {
    const minutes = Math.floor((Date.now() - studyStats.startTime) / 60000);
    return minutes < 1 ? "<1 min" : `${minutes} min`;
  };
  const getAccuracy = () => {
    const total = studyStats.correct + studyStats.incorrect;
    return total === 0 ? 0 : Math.round((studyStats.correct / total) * 100);
  };

  // ── Card CRUD helpers ──────────────────────────────────────────────
  const validateCardForm = () => {
    const e = {};
    if (!cardForm.front_text.trim()) e.front_text = "Front (question) is required.";
    if (!cardForm.back_text.trim()) e.back_text = "Back (answer) is required.";
    if (!["easy", "medium", "hard"].includes(cardForm.difficulty_level.toLowerCase()))
      e.difficulty_level = "Select a valid difficulty.";
    if (!["active", "inactive", "draft"].includes(cardForm.status.toLowerCase()))
      e.status = "Select a valid status.";
    if (!(Number(cardForm.card_order) > 0)) e.card_order = "Card order must be a positive number.";
    setCardErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreateCard = () => {
    setIsEditingCard(false);
    setEditingCardId(null);
    setCardForm({
      front_text: "",
      back_text: "",
      hint: "",
      difficulty_level: "medium",
      card_order: cards.length + 1,
      status: "active",
    });
    setCardErrors({});
    setCardModalOpen(true);
  };

  const openEditCard = () => {
    if (!currentCardData) return;
    setIsEditingCard(true);
    setEditingCardId(currentCardData.id);
    setCardForm({
      front_text: currentCardData.question || "",
      back_text: currentCardData.answer || "",
      hint: currentCardData._raw?.hint || "",
      difficulty_level: (currentCardData.difficulty_level || currentCardData.difficulty || "medium").toLowerCase(),
      card_order: currentCardData.card_order ?? currentCard + 1,
      status: (currentCardData.status || "active").toLowerCase(),
    });
    setCardErrors({});
    setCardModalOpen(true);
  };

  const closeCardModal = () => {
    if (cardSaving) return;
    setCardModalOpen(false);
    setIsEditingCard(false);
    setEditingCardId(null);
    setCardErrors({});
  };

  const submitCard = async () => {
    if (!validateCardForm()) return;
    setCardSaving(true);
    try {
      if (isEditingCard && editingCardId != null) {
        const body = {
          front_text: cardForm.front_text.trim(),
          back_text: cardForm.back_text.trim(),
          hint: cardForm.hint?.trim(),
          difficulty_level: cardForm.difficulty_level.toLowerCase(),
          card_order: Number(cardForm.card_order),
          status: cardForm.status.toLowerCase(),
          library_id: Number(flashId),
          ...(derivedTopicId ? { topic_id: derivedTopicId } : {}),
        };
        const res =
          (await dispatch(handleEditCardsOfFlashCards({ id: editingCardId, library_id: flashId, body })).unwrap?.()) ||
          (await dispatch(handleEditCardsOfFlashCards({ id: editingCardId, library_id: flashId, body })));
        const status = res?.status || res?.data?.status || "success";
        if (status === "success") {
          toast.success(res?.message || "Card updated.");
          closeCardModal();
          await dispatch(handleGetFlashcards({ id: flashId }));
        } else {
          toast.error(res?.message || "Failed to update card.");
        }
      } else {
        const body = {
          library_id: Number(flashId),
          ...(derivedTopicId ? { topic_id: derivedTopicId } : {}),
          front_text: cardForm.front_text.trim(),
          back_text: cardForm.back_text.trim(),
          difficulty_level: cardForm.difficulty_level.toLowerCase(),
          card_order: Number(cardForm.card_order),
          status: cardForm.status.toLowerCase(),
          hint: cardForm.hint?.trim(),
        };
        const res =
          (await dispatch(handleCreateCardsOfFlashCards({ body })).unwrap?.()) ||
          (await dispatch(handleCreateCardsOfFlashCards({ body })));
        const status = res?.status || res?.data?.status || "success";
        if (status === "success") {
          toast.success(res?.message || "Card created.");
          closeCardModal();
          await dispatch(handleGetFlashcards({ id: flashId }));
          setCurrentCard((prev) => Math.max(prev, cards.length)); // jump to new card
          setIsFlipped(false);
        } else {
          toast.error(res?.message || "Failed to create card.");
        }
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred while saving the card.");
    } finally {
      setCardSaving(false);
    }
  };

  const openDeleteCard = () => {
    if (!currentCardData) return;
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteModalOpen(false);
  };

  const performDelete = async () => {
    console.log(currentCardData);
    if (!currentCardData?.id) return;
    setDeleteLoading(true);
    try {
      const res =
        (await dispatch(handleDeleteCardsOfFlashCards({ id: currentCardData.id })).unwrap?.()) ||
        (await dispatch(handleDeleteCardsOfFlashCards({ id: currentCardData.id })));
      const status = res?.status || res?.data?.status || "success";
      if (status === "success") {
        toast.success(res?.message || "Card deleted.");
        closeDeleteModal();
        setCurrentCard((idx) => (idx > 0 ? idx - 1 : 0));
        await dispatch(handleGetFlashcards({ id: flashId }));
        setIsFlipped(false);
      } else {
        toast.error(res?.message || "Failed to delete card.");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred while deleting the card.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────
  return (
    <div className="backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in">
      <div className="rounded-3xl max-w-7xl w-full min-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-teal-600" />
                Card Preview
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>Card {cards.length ? currentCard + 1 : 0} of {cards.length}</span>
                {currentCardData?.difficulty && (
                  <>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentCardData?.difficulty)}`}>
                      {currentCardData?.difficulty}
                    </span>
                  </>
                )}
                {currentCardData?.created_at && (
                  <>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span>Created: {formatDate(currentCardData.created_at)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* CRUD */}
              <button onClick={openCreateCard} className="p-2 rounded-xl bg-white border hover:bg-gray-50 transition" title="New card">
                <Plus className="w-5 h-5 text-teal-700" />
              </button>
              <button
                onClick={openEditCard}
                disabled={!currentCardData}
                className="p-2 rounded-xl bg-white border hover:bg-gray-50 disabled:opacity-50 transition"
                title="Edit current card"
              >
                <Edit3 className="w-5 h-5 text-amber-600" />
              </button>
              <button
                onClick={openDeleteCard}
                disabled={!currentCardData}
                className="p-2 rounded-xl bg-white border hover:bg-gray-50 disabled:opacity-50 transition"
                title="Delete current card"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>

              {/* Stats + autoplay */}
              {/* <button
                onClick={() => setShowStats(!showStats)}
                className={`p-2 rounded-xl transition-all ${showStats ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                title="Toggle stats"
              >
                <Trophy className="w-5 h-5" />
              </button> */}
              <button
                onClick={toggleAutoPlay}
                className={`p-2 rounded-xl transition-all ${isAutoPlaying ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                title="Auto play"
              >
                {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all" title="Close">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="perspective-1000 mb-8">
            <div
              className={`relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? "rotate-y-180" : ""}`}
              onClick={handleFlip}
            >
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-2xl">
                <div
                  className="w-full h-full rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, #0793b0 0%, #075260 100%)` }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12" />
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/20 backdrop-blur-sm">
                      <BookOpen className="w-4 h-4" />
                      {flashcards_list?.data?.library?.library_name ?? "Card"}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-4">
                    <h2 className="text-2xl font-bold text-center leading-relaxed max-w-2xl">
                      {currentCardData?.question || "No question"}
                    </h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm opacity-75 bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Click to reveal answer
                    </div>
                    {isAutoPlaying && <div className="text-sm opacity-75 bg-white/10 px-3 py-2 rounded-full">Auto-playing</div>}
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-2xl">
                <div
                  className="w-full h-full rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, #00d77c 0%, #00b866 100%)` }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12" />
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/20">
                      <CheckCircle className="w-4 h-4" />
                      Answer
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center px-4">
                    <p className="text-xl text-center leading-relaxed max-w-2xl">
                      {currentCardData?.answer || "No answer"}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="text-sm opacity-75 bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Click to flip back
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handlePrevious}
              disabled={currentCard === 0 || cards.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-2xl font-medium transition-all shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-3">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCard(index);
                    setIsFlipped(false);
                  }}
                  className={`transition-all duration-300 rounded-full ${index === currentCard ? "w-12 h-3 bg-teal-500" : "w-3 h-3 bg-gray-300 hover:bg-gray-400"}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={cards.length === 0 || currentCard === cards.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Card Modal */}
      <Modal
        title={isEditingCard ? "Edit Card" : "New Card"}
        open={cardModalOpen}
        onCancel={closeCardModal}
        onOk={submitCard}
        okText={cardSaving ? (isEditingCard ? "Saving..." : "Creating...") : isEditingCard ? "Save Changes" : "Create"}
        okButtonProps={{ className: "!bg-blue-500 text-white", disabled: cardSaving, loading: cardSaving }}
        cancelButtonProps={{ disabled: cardSaving }}
        destroyOnClose
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Front (Question) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={cardForm.front_text}
              onChange={(e) => setCardForm((f) => ({ ...f, front_text: e.target.value }))}
              className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 ${cardErrors.front_text ? "border-red-300" : "border-gray-300"}`}
              placeholder="Type the question..."
            />
            {cardErrors.front_text && <p className="text-xs text-red-500 mt-1">{cardErrors.front_text}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Back (Answer) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={cardForm.back_text}
              onChange={(e) => setCardForm((f) => ({ ...f, back_text: e.target.value }))}
              className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 ${cardErrors.back_text ? "border-red-300" : "border-gray-300"}`}
              placeholder="Type the answer..."
            />
            {cardErrors.back_text && <p className="text-xs text-red-500 mt-1">{cardErrors.back_text}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                value={cardForm.difficulty_level}
                onChange={(e) => setCardForm((f) => ({ ...f, difficulty_level: e.target.value }))}
                className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 ${cardErrors.difficulty_level ? "border-red-300" : "border-gray-300"}`}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {cardErrors.difficulty_level && <p className="text-xs text-red-500 mt-1">{cardErrors.difficulty_level}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input
                type="number"
                min={1}
                value={cardForm.card_order}
                onChange={(e) => setCardForm((f) => ({ ...f, card_order: Number(e.target.value) }))}
                className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 ${cardErrors.card_order ? "border-red-300" : "border-gray-300"}`}
              />
              {cardErrors.card_order && <p className="text-xs text-red-500 mt-1">{cardErrors.card_order}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={cardForm.status}
                onChange={(e) => setCardForm((f) => ({ ...f, status: e.target.value }))}
                className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 ${cardErrors.status ? "border-red-300" : "border-gray-300"}`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              {cardErrors.status && <p className="text-xs text-red-500 mt-1">{cardErrors.status}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hint (optional)</label>
            <input
              value={cardForm.hint}
              onChange={(e) => setCardForm((f) => ({ ...f, hint: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
              placeholder="Short cue to help recall"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Card Modal */}
      <Modal title={null} open={deleteModalOpen} onCancel={closeDeleteModal} destroyOnClose footer={null} className="!top-24">
        <div className="p-1">
          <div className="rounded-2xl overflow-hidden border border-red-100">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Delete Card</h3>
                  <p className="text-white/80 text-xs">This action can’t be undone.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6">
              <div className="text-gray-700">You are about to delete this card:</div>
              <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="text-sm">
                  <span className="text-gray-500 mr-1">Front:</span>
                  <span className="font-medium text-gray-900">{currentCardData?.question?.slice(0, 160) || "—"}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">ID: {currentCardData?.id ?? "—"}</div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={closeDeleteModal} disabled={deleteLoading} className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={performDelete} disabled={deleteLoading} className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50">
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function StatTile({ icon, color, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className={`flex items-center gap-2 ${color} mb-1`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
