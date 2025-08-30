
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle, RotateCcw, Eye, EyeOff, Trash2 } from 'lucide-react';

const LineMatchingGame = () => {
  const [matchingSets] = useState([
    {
      id: 1,
      title: "Match Countries to Capitals",
      column1: [
        { id: 'c1', text: 'France', matchId: 'm1' },
        { id: 'c2', text: 'Japan', matchId: 'm2' },
        { id: 'c3', text: 'Brazil', matchId: 'm3' },
        { id: 'c4', text: 'Egypt', matchId: 'm4' },
        { id: 'c5', text: 'Australia', matchId: 'm5' }
      ],
      column2: [
        { id: 'c6', text: 'Brasília', matchId: 'm3' },
        { id: 'c7', text: 'Paris', matchId: 'm1' },
        { id: 'c8', text: 'Canberra', matchId: 'm5' },
        { id: 'c9', text: 'Cairo', matchId: 'm4' },
        { id: 'c10', text: 'Tokyo', matchId: 'm2' }
      ]
    },
    {
      id: 2,
      title: "Match Animals to Their Sounds",
      column1: [
        { id: 'a1', text: 'Dog', matchId: 'am1' },
        { id: 'a2', text: 'Cat', matchId: 'am2' },
        { id: 'a3', text: 'Cow', matchId: 'am3' },
        { id: 'a4', text: 'Lion', matchId: 'am4' },
        { id: 'a5', text: 'Duck', matchId: 'am5' }
      ],
      column2: [
        { id: 'a6', text: 'Roar', matchId: 'am4' },
        { id: 'a7', text: 'Meow', matchId: 'am2' },
        { id: 'a8', text: 'Bark', matchId: 'am1' },
        { id: 'a9', text: 'Quack', matchId: 'am5' },
        { id: 'a10', text: 'Moo', matchId: 'am3' }
      ]
    },
    {
      id: 3,
      title: "Match Programming Languages to Extensions",
      column1: [
        { id: 'p1', text: 'Python', matchId: 'pm1' },
        { id: 'p2', text: 'JavaScript', matchId: 'pm2' },
        { id: 'p3', text: 'Java', matchId: 'pm3' },
        { id: 'p4', text: 'C++', matchId: 'pm4' },
        { id: 'p5', text: 'CSS', matchId: 'pm5' }
      ],
      column2: [
        { id: 'p6', text: '.java', matchId: 'pm3' },
        { id: 'p7', text: '.css', matchId: 'pm5' },
        { id: 'p8', text: '.py', matchId: 'pm1' },
        { id: 'p9', text: '.cpp', matchId: 'pm4' },
        { id: 'p10', text: '.js', matchId: 'pm2' }
      ]
    }
  ]);

  const [currentSet, setCurrentSet] = useState(0);
  const [connections, setConnections] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingLine, setDrawingLine] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const itemRefs = useRef({});

  const currentData = matchingSets[currentSet];

  // Get element center position relative to container
  const getElementCenter = useCallback((elementId) => {
    const element = itemRefs.current[elementId];
    const container = containerRef.current;
    
    if (!element || !container) return { x: 0, y: 0 };

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    return {
      x: elementRect.left - containerRect.left + elementRect.width / 2,
      y: elementRect.top - containerRect.top + elementRect.height / 2
    };
  }, []);

  // Get mouse position relative to container
  const getMousePosition = useCallback((event) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    return {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    };
  }, []);

  // Start drawing line
  const startDrawing = (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Allow starting from any column
    const startPos = getElementCenter(item.id);
    const currentMousePos = getMousePosition(event);
    
    // Check if item already has a connection
    const existingConnection = connections.find(conn => 
      conn.from.id === item.id || conn.to.id === item.id
    );
    if (existingConnection) return;

    setIsDrawing(true);
    setMousePos(currentMousePos);
    setDrawingLine({
      from: item,
      startPos,
      currentPos: currentMousePos
    });
  };

  // Update drawing line position smoothly
  const updateDrawing = useCallback((e) => {
    if (!isDrawing || !drawingLine || !containerRef.current) return;

    e.preventDefault();
    const currentMousePos = getMousePosition(e);
    setMousePos(currentMousePos);

    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
      setDrawingLine(prev => ({
        ...prev,
        currentPos: currentMousePos
      }));
    });
  }, [isDrawing, drawingLine, getMousePosition]);

  // Complete connection
  const completeConnection = (toItem, event) => {
    if (!isDrawing || !drawingLine) return;

    event.preventDefault();
    event.stopPropagation();

    // Check if trying to connect to the same item
    if (drawingLine.from.id === toItem.id) return;

    // Check if both items are from the same column
    const fromColumn1 = currentData.column1.some(item => item.id === drawingLine.from.id);
    const fromColumn2 = currentData.column2.some(item => item.id === drawingLine.from.id);
    const toColumn1 = currentData.column1.some(item => item.id === toItem.id);
    const toColumn2 = currentData.column2.some(item => item.id === toItem.id);

    // Only allow connections between different columns
    if ((fromColumn1 && toColumn1) || (fromColumn2 && toColumn2)) return;

    // Check if target already has a connection
    const existingToConnection = connections.find(conn => 
      conn.to.id === toItem.id || conn.from.id === toItem.id
    );
    if (existingToConnection) return;

    const endPos = getElementCenter(toItem.id);
    const isCorrect = drawingLine.from.matchId === toItem.matchId;

    const newConnection = {
      id: `${drawingLine.from.id}-${toItem.id}`,
      from: drawingLine.from,
      to: toItem,
      startPos: drawingLine.startPos,
      endPos,
      isCorrect
    };

    // Add connection with smooth transition
    setConnections(prev => [...prev, newConnection]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Clear drawing state
    setIsDrawing(false);
    setDrawingLine(null);
  };

  // Cancel drawing
  const cancelDrawing = (event) => {
    if (event && event.target === containerRef.current) {
      setIsDrawing(false);
      setDrawingLine(null);
    }
  };

  // Handle mouse up anywhere to cancel drawing
  const handleMouseUp = useCallback((event) => {
    if (isDrawing) {
      // Only cancel if not over a valid target
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const isOverItem = target && target.closest('[data-item-id]');
      
      if (!isOverItem) {
        setIsDrawing(false);
        setDrawingLine(null);
      }
    }
  }, [isDrawing]);

  // Remove a specific connection
  const removeConnection = (connectionId) => {
    const connection = connections.find(conn => conn.id === connectionId);
    if (connection?.isCorrect) {
      setScore(prev => Math.max(0, prev - 1));
    }
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  // Reset current game
  const resetGame = () => {
    setConnections([]);
    setScore(0);
    setIsComplete(false);
    setShowAnswers(false);
    setIsDrawing(false);
    setDrawingLine(null);
  };

  // Change to next/previous set
  const changeSet = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(currentSet + 1, matchingSets.length - 1)
      : Math.max(currentSet - 1, 0);
    
    if (newIndex !== currentSet) {
      setCurrentSet(newIndex);
      resetGame();
    }
  };

  // Check for completion
  useEffect(() => {
    const correctConnections = connections.filter(conn => conn.isCorrect).length;
    const totalRequired = currentData.column1.length;
    
    if (correctConnections === totalRequired && totalRequired > 0) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [connections, currentData.column1.length]);

  // Update connection positions on resize
  useEffect(() => {
    const updatePositions = () => {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        startPos: getElementCenter(conn.from.id),
        endPos: getElementCenter(conn.to.id)
      })));
    };

    const timeoutId = setTimeout(updatePositions, 100);
    window.addEventListener('resize', updatePositions);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePositions);
    };
  }, [getElementCenter, currentSet]);

  // Add global mouse up listener
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  // Get item status for styling
  const getItemStatus = (item, column) => {
    const connection = connections.find(conn => 
      conn.from.id === item.id || conn.to.id === item.id
    );
    
    if (connection) {
      return connection.isCorrect ? 'correct' : 'incorrect';
    }
    return 'unconnected';
  };

  // Get item styling classes
  const getItemClasses = (item, column) => {
    const status = getItemStatus(item, column);
    const baseClasses = "relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer select-none min-h-[60px] flex items-center justify-center text-center font-medium";
    
    switch (status) {
      case 'correct':
        return `${baseClasses} bg-green-100 border-green-400 text-green-800 shadow-md`;
      case 'incorrect':
        return `${baseClasses} bg-red-100 border-red-400 text-red-800 shadow-md`;
      default:
        return column === 1 
          ? `${baseClasses} bg-blue-50 border-blue-300 hover:bg-blue-100 hover:border-blue-400 hover:shadow-lg`
          : `${baseClasses} bg-purple-50 border-purple-300 hover:bg-purple-100 hover:border-purple-400 hover:shadow-lg`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Line Matching Game</h1>
          <p className="text-slate-600 text-lg mb-4">Draw lines to connect matching items between columns</p>
          <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              {currentData.title}
            </h2>
            <div className="text-sm text-slate-500">
              Set {currentSet + 1} of {matchingSets.length} • Score: {score}/{currentData.column1.length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => changeSet('prev')}
            disabled={currentSet === 0}
            className="px-5 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ← Previous
          </button>
          
          <button
            onClick={resetGame}
            className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
          >
            {showAnswers ? <EyeOff size={18} /> : <Eye size={18} />}
            {showAnswers ? 'Hide' : 'Show'} Answers
          </button>
          
          <button
            onClick={() => changeSet('next')}
            disabled={currentSet === matchingSets.length - 1}
            className="px-5 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Next →
          </button>
        </div>

        {/* Game Area */}
        <div 
          ref={containerRef}
          className="relative bg-white rounded-2xl shadow-xl p-8 min-h-[500px] overflow-hidden"
          onMouseMove={updateDrawing}
          onMouseUp={cancelDrawing}
          onMouseLeave={cancelDrawing}
        >
          <style jsx>{`
            @keyframes drawLine {
              from {
                stroke-dashoffset: var(--line-length);
              }
              to {
                stroke-dashoffset: 0;
              }
            }
            
            @keyframes dashMove {
              0% {
                stroke-dashoffset: 0;
              }
              100% {
                stroke-dashoffset: 18;
              }
            }
            
            @keyframes fade-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            .animate-fade-in {
              animation: fade-in 0.3s ease-in-out;
            }
          `}</style>
          {/* SVG for lines */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {/* Existing connections with smooth animations */}
            {connections.map(conn => (
              <g key={conn.id} className="animate-fade-in">
                <defs>
                  <filter id={`glow-${conn.id}`}>
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1={conn.startPos.x}
                  y1={conn.startPos.y}
                  x2={conn.endPos.x}
                  y2={conn.endPos.y}
                  stroke={conn.isCorrect ? '#10B981' : '#EF4444'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter={`url(#glow-${conn.id})`}
                  className="transition-all duration-300"
                  style={{
                    animation: 'drawLine 0.3s ease-out forwards',
                    strokeDasharray: `${Math.sqrt(Math.pow(conn.endPos.x - conn.startPos.x, 2) + Math.pow(conn.endPos.y - conn.startPos.y, 2))}`,
                    strokeDashoffset: `${Math.sqrt(Math.pow(conn.endPos.x - conn.startPos.x, 2) + Math.pow(conn.endPos.y - conn.startPos.y, 2))}`
                  }}
                />
                <circle
                  cx={(conn.startPos.x + conn.endPos.x) / 2}
                  cy={(conn.startPos.y + conn.endPos.y) / 2}
                  r="14"
                  fill="white"
                  stroke={conn.isCorrect ? '#10B981' : '#EF4444'}
                  strokeWidth="3"
                  className="cursor-pointer pointer-events-auto hover:scale-110 transition-transform duration-200 drop-shadow-md"
                  onClick={() => removeConnection(conn.id)}
                />
                <foreignObject
                  x={(conn.startPos.x + conn.endPos.x) / 2 - 8}
                  y={(conn.startPos.y + conn.endPos.y) / 2 - 8}
                  width="16"
                  height="16"
                  className="pointer-events-none"
                >
                  <Trash2 
                    size={16}
                    className="pointer-events-none"
                    color={conn.isCorrect ? '#10B981' : '#EF4444'}
                  />
                </foreignObject>
              </g>
            ))}

            {/* Drawing line with natural direction following */}
            {drawingLine && (
              <g className="pointer-events-none">
                <defs>
                  <filter id="drawingGlow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1={drawingLine.startPos.x}
                  y1={drawingLine.startPos.y}
                  x2={drawingLine.currentPos.x}
                  y2={drawingLine.currentPos.y}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="12,6"
                  strokeLinecap="round"
                  filter="url(#drawingGlow)"
                  opacity="0.9"
                  style={{
                    animation: 'dashMove 1s linear infinite'
                  }}
                />
                <circle
                  cx={drawingLine.currentPos.x}
                  cy={drawingLine.currentPos.y}
                  r="6"
                  fill="#3B82F6"
                  opacity="0.8"
                  className="animate-ping"
                />
                {/* Arrow indicating direction */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#3B82F6"
                      opacity="0.8"
                    />
                  </marker>
                </defs>
                <line
                  x1={drawingLine.startPos.x}
                  y1={drawingLine.startPos.y}
                  x2={drawingLine.currentPos.x}
                  y2={drawingLine.currentPos.y}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  opacity="0.5"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            )}

            {/* Answer hints */}
            {showAnswers && currentData.column1.map(item1 => {
              const item2 = currentData.column2.find(item => item.matchId === item1.matchId);
              if (!item2) return null;
              
              const pos1 = getElementCenter(item1.id);
              const pos2 = getElementCenter(item2.id);
              
              return (
                <line
                  key={`hint-${item1.id}`}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="10,5"
                  opacity="0.6"
                />
              );
            })}
          </svg>

          {/* Columns Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full relative z-20">
            {/* Column 1 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-700 text-center mb-6 py-3 bg-blue-50 rounded-lg">
                Column 1
              </h3>
              <div className="space-y-4">
                {currentData.column1.map((item, index) => (
                  <div
                    key={item.id}
                    ref={el => itemRefs.current[item.id] = el}
                    className={getItemClasses(item, 1)}
                    data-item-id={item.id}
                    onMouseDown={(e) => startDrawing(item, e)}
                    onMouseUp={(e) => completeConnection(item, e)}
                    onMouseEnter={(e) => {
                      if (isDrawing && drawingLine?.from.id !== item.id) {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '';
                    }}
                    style={{ zIndex: 30, touchAction: 'none' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex-1">{item.text}</span>
                      {getItemStatus(item, 1) === 'correct' && (
                        <CheckCircle size={20} className="text-green-600 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-700 text-center mb-6 py-3 bg-purple-50 rounded-lg">
                Column 2
              </h3>
              <div className="space-y-4">
                {currentData.column2.map((item, index) => (
                  <div
                    key={item.id}
                    ref={el => itemRefs.current[item.id] = el}
                    className={getItemClasses(item, 2)}
                    data-item-id={item.id}
                    onMouseDown={(e) => startDrawing(item, e)}
                    onMouseUp={(e) => completeConnection(item, e)}
                    onMouseEnter={(e) => {
                      if (isDrawing && drawingLine?.from.id !== item.id) {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '';
                    }}
                    style={{ zIndex: 30, touchAction: 'none' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex-1">{item.text}</span>
                      {getItemStatus(item, 2) === 'correct' && (
                        <CheckCircle size={20} className="text-green-600 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center bg-slate-100 rounded-lg p-3 max-w-md">
            <p className="text-sm text-slate-600 font-medium">
              Click and drag from any item to connect with another column
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Click the trash icon on lines to remove connections
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          {isComplete ? (
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-green-100 text-green-800 rounded-xl border border-green-300 shadow-lg">
              <CheckCircle size={32} />
              <div>
                <div className="text-xl font-bold">Perfect Score!</div>
                <div className="text-sm">All {score} matches are correct!</div>
              </div>
            </div>
          ) : (
            <div className="text-lg text-slate-600">
              <span className="font-semibold">{score}</span> out of <span className="font-semibold">{currentData.column1.length}</span> correct matches
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineMatchingGame;

