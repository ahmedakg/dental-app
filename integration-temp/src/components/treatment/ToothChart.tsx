// Module 3: FDI Tooth Chart Component
// Interactive clickable tooth chart for treatment selection

import React, { useState } from 'react';
import { Tooth, ToothType, ToothStatus } from '../types/treatment';
import { 
  ADULT_TEETH_POSITIONS, 
  PRIMARY_TEETH_POSITIONS,
  getToothName,
  initializeToothChart 
} from '../data/toothChart';

interface ToothChartProps {
  type: ToothType;
  selectedTeeth: number[];
  onTeethSelect: (teeth: number[]) => void;
  existingChart?: Map<number, Tooth>;
  readOnly?: boolean;
}

export const ToothChart: React.FC<ToothChartProps> = ({
  type,
  selectedTeeth,
  onTeethSelect,
  existingChart,
  readOnly = false
}) => {
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);
  
  // Initialize or use existing chart
  const toothChart = existingChart || initializeToothChart(type);
  const positions = type === 'adult' ? ADULT_TEETH_POSITIONS : PRIMARY_TEETH_POSITIONS;

  const handleToothClick = (toothNumber: number) => {
    if (readOnly) return;
    
    const tooth = toothChart.get(toothNumber);
    if (!tooth || tooth.status === 'extracted' || tooth.status === 'missing') {
      return; // Can't select extracted/missing teeth
    }

    if (selectedTeeth.includes(toothNumber)) {
      onTeethSelect(selectedTeeth.filter(t => t !== toothNumber));
    } else {
      onTeethSelect([...selectedTeeth, toothNumber]);
    }
  };

  const getToothColor = (toothNumber: number): string => {
    const tooth = toothChart.get(toothNumber);
    
    if (selectedTeeth.includes(toothNumber)) {
      return '#10b981'; // Green for selected
    }
    
    if (!tooth) return '#94a3b8'; // Gray default
    
    switch (tooth.status) {
      case 'healthy':
        return '#fff';
      case 'treated':
        return '#60a5fa'; // Blue
      case 'extracted':
      case 'missing':
        return '#ef4444'; // Red
      default:
        return '#94a3b8';
    }
  };

  const getToothStroke = (toothNumber: number): string => {
    if (hoveredTooth === toothNumber) return '#3b82f6';
    if (selectedTeeth.includes(toothNumber)) return '#059669';
    return '#64748b';
  };

  const getToothCursor = (toothNumber: number): string => {
    if (readOnly) return 'default';
    const tooth = toothChart.get(toothNumber);
    if (tooth && (tooth.status === 'extracted' || tooth.status === 'missing')) {
      return 'not-allowed';
    }
    return 'pointer';
  };

  return (
    <div className="tooth-chart-container">
      <div className="tooth-chart-header">
        <h3>{type === 'adult' ? 'Adult Teeth (Permanent)' : 'Primary Teeth (Deciduous)'}</h3>
        <div className="tooth-legend">
          <div className="legend-item">
            <div className="legend-box" style={{ background: '#fff', border: '2px solid #64748b' }}></div>
            <span>Healthy</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ background: '#10b981' }}></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ background: '#60a5fa' }}></div>
            <span>Treated</span>
          </div>
          <div className="legend-item">
            <div className="legend-box" style={{ background: '#ef4444' }}></div>
            <span>Extracted/Missing</span>
          </div>
        </div>
      </div>

      <svg 
        viewBox="0 0 460 200" 
        className="tooth-chart-svg"
        style={{ width: '100%', height: 'auto', maxWidth: '800px' }}
      >
        {/* Draw midline */}
        <line x1="230" y1="30" x2="230" y2="170" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
        
        {/* Draw arch guides */}
        <path
          d="M 70 90 Q 230 20, 390 90"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <path
          d="M 70 110 Q 230 180, 390 110"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Quadrant labels */}
        <text x="100" y="25" fontSize="10" fill="#64748b" fontWeight="500">UR</text>
        <text x="350" y="25" fontSize="10" fill="#64748b" fontWeight="500">UL</text>
        <text x="350" y="185" fontSize="10" fill="#64748b" fontWeight="500">LL</text>
        <text x="100" y="185" fontSize="10" fill="#64748b" fontWeight="500">LR</text>

        {/* Render all teeth */}
        {positions.map(pos => {
          const tooth = toothChart.get(pos.number);
          const isExtracted = tooth && (tooth.status === 'extracted' || tooth.status === 'missing');
          
          return (
            <g key={pos.number}>
              {/* Tooth circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill={getToothColor(pos.number)}
                stroke={getToothStroke(pos.number)}
                strokeWidth={selectedTeeth.includes(pos.number) ? 3 : 2}
                opacity={isExtracted ? 0.4 : 1}
                cursor={getToothCursor(pos.number)}
                onClick={() => handleToothClick(pos.number)}
                onMouseEnter={() => setHoveredTooth(pos.number)}
                onMouseLeave={() => setHoveredTooth(null)}
                className="tooth-circle"
              />
              
              {/* Tooth number label */}
              <text
                x={pos.x}
                y={pos.y + 3}
                fontSize="7"
                fill={selectedTeeth.includes(pos.number) ? '#fff' : '#1e293b'}
                fontWeight="600"
                textAnchor="middle"
                pointerEvents="none"
              >
                {pos.number % 10}
              </text>

              {/* X mark for extracted teeth */}
              {isExtracted && (
                <>
                  <line
                    x1={pos.x - 6}
                    y1={pos.y - 6}
                    x2={pos.x + 6}
                    y2={pos.y + 6}
                    stroke="#ef4444"
                    strokeWidth="2"
                    pointerEvents="none"
                  />
                  <line
                    x1={pos.x + 6}
                    y1={pos.y - 6}
                    x2={pos.x - 6}
                    y2={pos.y + 6}
                    stroke="#ef4444"
                    strokeWidth="2"
                    pointerEvents="none"
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredTooth && (
        <div className="tooth-tooltip">
          {getToothName(hoveredTooth)}
          {toothChart.get(hoveredTooth)?.status && 
            ` - ${toothChart.get(hoveredTooth)?.status}`
          }
        </div>
      )}

      {/* Selected teeth display */}
      {selectedTeeth.length > 0 && !readOnly && (
        <div className="selected-teeth-display">
          <strong>Selected Teeth ({selectedTeeth.length}):</strong>
          <div className="selected-teeth-list">
            {selectedTeeth.sort((a, b) => a - b).map(tooth => (
              <span key={tooth} className="selected-tooth-badge">
                {tooth}
                <button
                  onClick={() => handleToothClick(tooth)}
                  className="remove-tooth-btn"
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={() => onTeethSelect([])}
            className="clear-selection-btn"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Quick select buttons */}
      {!readOnly && (
        <div className="quick-select-buttons">
          <button onClick={() => {
            const allTeeth = positions
              .filter(p => {
                const tooth = toothChart.get(p.number);
                return tooth && tooth.status !== 'extracted' && tooth.status !== 'missing';
              })
              .map(p => p.number);
            onTeethSelect(allTeeth);
          }}>
            Select All
          </button>
          <button onClick={() => {
            const upperTeeth = positions
              .filter(p => {
                const tooth = toothChart.get(p.number);
                return p.quadrant === 1 || p.quadrant === 2 && 
                       tooth && tooth.status !== 'extracted' && tooth.status !== 'missing';
              })
              .map(p => p.number);
            onTeethSelect(upperTeeth);
          }}>
            Upper Arch
          </button>
          <button onClick={() => {
            const lowerTeeth = positions
              .filter(p => {
                const tooth = toothChart.get(p.number);
                return p.quadrant === 3 || p.quadrant === 4 && 
                       tooth && tooth.status !== 'extracted' && tooth.status !== 'missing';
              })
              .map(p => p.number);
            onTeethSelect(lowerTeeth);
          }}>
            Lower Arch
          </button>
        </div>
      )}
    </div>
  );
};
