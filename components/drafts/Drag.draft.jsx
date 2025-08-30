
import React, { useState, useRef, useCallback } from 'react';
import { Shuffle, RotateCcw, CheckCircle } from 'lucide-react';

const WordArrangementPuzzle = () => {
  const [puzzles] = useState([
    { id: 1, word: "COMPUTER", scrambled: "REPTUMOC" },
    { id: 2, word: "ELEPHANT", scrambled: "PHENTALE" },
    { id: 3, word: "RAINBOW", scrambled: "WONBAIR" },
    { id: 4, word: "KITCHEN", scrambled: "HENTICK" },
    { id: 5, word: "DRAGON", scrambled: "GONDAR" }
  ]);

  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [arrangedLetters, setArrangedLetters] = useState(Array(puzzles[0].word.length).fill(''));
  const [availableLetters, setAvailableLetters] = useState(puzzles[0].scrambled.split(''));
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const dragCounterRef = useRef(0);

  const checkCompletion = useCallback((letters) => {
    const formed = letters.join('');
    const target = puzzles[currentPuzzle].word;
    if (formed === target) {
      setIsComplete(true);
      setTimeout(() => {
        alert('Congratulations! You solved the puzzle!');
      }, 100);
    }
  }, [currentPuzzle, puzzles]);

  const handleDragStart = (e, letter, index, source) => {
    dragCounterRef.current++;
    setDraggedLetter(letter);
    setDraggedIndex({ index, source });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    setDraggedLetter(null);
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSquare = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedLetter || draggedIndex === null) return;

    const newArrangedLetters = [...arrangedLetters];
    const newAvailableLetters = [...availableLetters];

    if (draggedIndex.source === 'available') {
      // Moving from available letters to grid
      if (newArrangedLetters[targetIndex] !== '') {
        // If target square is occupied, move its letter back to available
        newAvailableLetters.push(newArrangedLetters[targetIndex]);
      }
      newArrangedLetters[targetIndex] = draggedLetter;
      newAvailableLetters.splice(draggedIndex.index, 1);
    } else {
      // Moving from grid to grid
      const oldLetter = newArrangedLetters[targetIndex];
      newArrangedLetters[targetIndex] = draggedLetter;
      newArrangedLetters[draggedIndex.index] = oldLetter;
    }

    setArrangedLetters(newArrangedLetters);
    setAvailableLetters(newAvailableLetters);
    checkCompletion(newArrangedLetters);
  };

  const handleDropOnAvailable = (e) => {
    e.preventDefault();
    if (!draggedLetter || draggedIndex === null || draggedIndex.source === 'available') return;

    const newArrangedLetters = [...arrangedLetters];
    const newAvailableLetters = [...availableLetters];

    newAvailableLetters.push(draggedLetter);
    newArrangedLetters[draggedIndex.index] = '';

    setArrangedLetters(newArrangedLetters);
    setAvailableLetters(newAvailableLetters);
  };

  const resetPuzzle = () => {
    const puzzle = puzzles[currentPuzzle];
    setArrangedLetters(Array(puzzle.word.length).fill(''));
    setAvailableLetters(puzzle.scrambled.split(''));
    setIsComplete(false);
    setShowHint(false);
  };

  const shuffleAvailable = () => {
    const shuffled = [...availableLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
  };

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      const nextIndex = currentPuzzle + 1;
      setCurrentPuzzle(nextIndex);
      const nextPuzzleData = puzzles[nextIndex];
      setArrangedLetters(Array(nextPuzzleData.word.length).fill(''));
      setAvailableLetters(nextPuzzleData.scrambled.split(''));
      setIsComplete(false);
      setShowHint(false);
    }
  };

  const prevPuzzle = () => {
    if (currentPuzzle > 0) {
      const prevIndex = currentPuzzle - 1;
      setCurrentPuzzle(prevIndex);
      const prevPuzzleData = puzzles[prevIndex];
      setArrangedLetters(Array(prevPuzzleData.word.length).fill(''));
      setAvailableLetters(prevPuzzleData.scrambled.split(''));
      setIsComplete(false);
      setShowHint(false);
    }
  };

  const currentWord = puzzles[currentPuzzle];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">Word Arrangement Puzzle</h1>
          <p className="text-gray-600">Drag and drop letters to form the correct word!</p>
          <div className="mt-4">
            <span className="text-lg font-semibold text-purple-700">
              Puzzle {currentPuzzle + 1} of {puzzles.length}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={prevPuzzle}
            disabled={currentPuzzle === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={resetPuzzle}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={shuffleAvailable}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Shuffle size={16} />
            Shuffle
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={nextPuzzle}
            disabled={currentPuzzle === puzzles.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="text-center mb-6">
            <p className="text-lg text-purple-700 font-semibold">
              Hint: The word is "{currentWord.word}"
            </p>
          </div>
        )}

        {/* Word Grid */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {arrangedLetters.map((letter, index) => (
              <div
                key={index}
                className={`w-16 h-16 border-4 border-dashed border-purple-400 bg-white rounded-lg flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-200 ${
                  letter ? 'border-solid border-purple-600 bg-purple-50' : 'hover:bg-purple-50'
                } ${isComplete ? 'border-green-500 bg-green-100' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSquare(e, index)}
                draggable={letter !== ''}
                onDragStart={(e) => handleDragStart(e, letter, index, 'arranged')}
                onDragEnd={handleDragEnd}
              >
                {letter}
                {isComplete && letter && <CheckCircle className="absolute -top-2 -right-2 text-green-500" size={20} />}
              </div>
            ))}
          </div>
        </div>

        {/* Available Letters */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Available Letters</h3>
          <div 
            className="flex justify-center gap-2 flex-wrap min-h-20 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300"
            onDragOver={handleDragOver}
            onDrop={handleDropOnAvailable}
          >
            {availableLetters.map((letter, index) => (
              <div
                key={`${letter}-${index}`}
                className="w-14 h-14 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xl font-bold cursor-move hover:bg-blue-600 transition-colors duration-200 shadow-lg"
                draggable
                onDragStart={(e) => handleDragStart(e, letter, index, 'available')}
                onDragEnd={handleDragEnd}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Drag letters from here to the squares above, or drag them back here to remove them
          </p>
        </div>

        {/* Success Message */}
        {isComplete && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg border border-green-300">
              <CheckCircle size={24} />
              <span className="text-lg font-semibold">Puzzle Completed!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordArrangementPuzzle;
