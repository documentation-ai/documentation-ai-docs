// Describes this component for search. Optional — leave empty to omit it.
export const description = "this is a simple counter"


export const Counter = ({
  initialValue = 0,
  min = -999,
  max = 999,
  step = 1,
  allowDecimal = false,
}) => {
  const bounds = {
    min: Math.min(Number(min), Number(max)),
    max: Math.max(Number(min), Number(max)),
  }

  const normalize = useCallback(
    (value) => {
      const numericValue = Number(value)

      if (!Number.isFinite(numericValue)) {
        return bounds.min
      }

      const precision = allowDecimal ? 10 : 0
      const roundedValue = allowDecimal
        ? Number(numericValue.toFixed(precision))
        : Math.round(numericValue)

      return Math.min(bounds.max, Math.max(bounds.min, roundedValue))
    },
    [allowDecimal, bounds.max, bounds.min],
  )

  const startingValue = normalize(initialValue)
  const [count, setCount] = useState(startingValue)
  const [isEditing, setIsEditing] = useState(false)
  const [draftValue, setDraftValue] = useState(String(startingValue))
  const [status, setStatus] = useState('')
  const [changeCount, setChangeCount] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)

  const countRef = useRef(startingValue)
  const previousValueRef = useRef(null)
  const repeatTimeoutRef = useRef(null)
  const repeatIntervalRef = useRef(280)
  const repeatDirectionRef = useRef(0)
  const statusTimeoutRef = useRef(null)

  const clearRepeat = useCallback(() => {
    if (repeatTimeoutRef.current) {
      window.clearTimeout(repeatTimeoutRef.current)
      repeatTimeoutRef.current = null
    }
  }, [])

  const showBoundaryStatus = useCallback((message) => {
    setStatus(message)
    setShakeKey((value) => value + 1)

    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current)
    }

    statusTimeoutRef.current = window.setTimeout(() => {
      setStatus('')
      statusTimeoutRef.current = null
    }, 1800)
  }, [])

  const applyValue = useCallback(
    (nextValue) => {
      const currentValue = countRef.current
      const nextCount = normalize(nextValue)

      if (nextCount === currentValue) {
        if (nextValue > bounds.max) {
          showBoundaryStatus('Max reached')
        } else if (nextValue < bounds.min) {
          showBoundaryStatus('Min reached')
        }

        return false
      }

      previousValueRef.current = currentValue
      countRef.current = nextCount
      setCount(nextCount)
      setChangeCount((value) => value + 1)
      setStatus('')

      return true
    },
    [bounds.max, bounds.min, normalize, showBoundaryStatus],
  )

  const changeBy = useCallback(
    (direction) => {
      const amount = Number(step) || 1
      applyValue(countRef.current + direction * amount)
    },
    [applyValue, step],
  )

  const reset = useCallback(() => {
    applyValue(startingValue)
  }, [applyValue, startingValue])

  const undo = useCallback(() => {
    if (previousValueRef.current === null) {
      return
    }

    const valueToRestore = previousValueRef.current
    previousValueRef.current = null
    countRef.current = valueToRestore
    setCount(valueToRestore)
    setStatus('')
  }, [])

  const confirmInput = useCallback(() => {
    const parsedValue = Number(draftValue)

    if (!Number.isFinite(parsedValue)) {
      setDraftValue(String(countRef.current))
      setIsEditing(false)
      return
    }

    const nextValue = allowDecimal ? parsedValue : Math.round(parsedValue)
    applyValue(nextValue)
    setDraftValue(String(normalize(nextValue)))
    setIsEditing(false)
  }, [allowDecimal, applyValue, draftValue, normalize])

  const beginEditing = useCallback(() => {
    setDraftValue(String(countRef.current))
    setIsEditing(true)
  }, [])

  const scheduleRepeat = useCallback(() => {
    repeatTimeoutRef.current = window.setTimeout(() => {
      changeBy(repeatDirectionRef.current)
      repeatIntervalRef.current = Math.max(
        55,
        repeatIntervalRef.current * 0.82,
      )
      scheduleRepeat()
    }, repeatIntervalRef.current)
  }, [changeBy])

  const startRepeat = useCallback(
    (direction) => {
      clearRepeat()
      repeatDirectionRef.current = direction
      repeatIntervalRef.current = 280
      changeBy(direction)
      scheduleRepeat()
    },
    [changeBy, clearRepeat, scheduleRepeat],
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isTextField =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement

      if (isEditing) {
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        changeBy(1)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        changeBy(-1)
      } else if (!isTextField && event.key.toLowerCase() === 'r') {
        event.preventDefault()
        reset()
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        undo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [changeBy, isEditing, reset, undo])

  useEffect(() => {
    return () => {
      clearRepeat()

      if (statusTimeoutRef.current) {
        window.clearTimeout(statusTimeoutRef.current)
      }
    }
  }, [clearRepeat])

  const range = bounds.max - bounds.min
  const progress = range === 0
    ? 100
    : ((count - bounds.min) / range) * 100
  const radius = 72
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="cc-wrapper">
      <style>{`
        @keyframes cc-pop {
          0% { transform: scale(1); }
          45% { transform: scale(1.16); }
          100% { transform: scale(1); }
        }

        @keyframes cc-shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-7px); }
          40%, 80% { transform: translateX(7px); }
        }

        @keyframes cc-ring-pulse {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.25)); }
          50% { filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.62)); }
        }

        .cc-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
        }

        .cc-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: min(100%, 330px);
          padding: 28px 30px 24px;
          border: 1px solid transparent;
          border-radius: 22px;
          background:
            linear-gradient(#ffffff, #ffffff) padding-box,
            linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(168, 85, 247, 0.28), rgba(56, 189, 248, 0.6)) border-box;
          box-shadow: 0 16px 40px rgba(30, 41, 59, 0.1);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }

        .cc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 48px rgba(30, 41, 59, 0.15);
        }

        .cc-card.cc-shaking {
          animation: cc-shake 0.38s ease;
        }

        .cc-label {
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .cc-stage {
          position: relative;
          display: grid;
          place-items: center;
          width: 190px;
          height: 190px;
        }

        .cc-ring {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          transform: rotate(-90deg);
          animation: cc-ring-pulse 2.8s ease-in-out infinite;
        }

        .cc-ring-track,
        .cc-ring-progress {
          fill: none;
          stroke-width: 9;
        }

        .cc-ring-track {
          stroke: #e2e8f0;
        }

        .cc-ring-progress {
          stroke: #6366f1;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.35s ease, stroke 0.2s ease;
        }

        .cc-value,
        .cc-input {
          position: relative;
          z-index: 1;
          width: 125px;
          border: 0;
          outline: 0;
          color: #1e293b;
          background: transparent;
          font: inherit;
          font-size: 40px;
          font-weight: 750;
          line-height: 1;
          text-align: center;
        }

        .cc-value {
          cursor: text;
          animation: cc-pop 0.22s ease;
        }

        .cc-input {
          border-bottom: 2px solid #6366f1;
        }

        .cc-buttons {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .cc-button {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 50%;
          color: #ffffff;
          background: #6366f1;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          cursor: pointer;
          font-size: 23px;
          font-weight: 700;
          line-height: 1;
          touch-action: manipulation;
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
        }

        .cc-button:hover {
          background: #5558e3;
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.42);
        }

        .cc-button:active {
          transform: scale(0.9);
        }

        .cc-secondary {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 25px;
        }

        .cc-reset,
        .cc-undo {
          border: 0;
          border-radius: 999px;
          padding: 6px 12px;
          color: #64748b;
          background: transparent;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .cc-reset:hover,
        .cc-undo:hover {
          color: #4f46e5;
          background: rgba(99, 102, 241, 0.1);
        }

        .cc-badge {
          padding: 4px 9px;
          border-radius: 999px;
          color: #64748b;
          background: #f1f5f9;
          font-size: 11px;
          white-space: nowrap;
        }

        .cc-status {
          min-height: 18px;
          color: #6366f1;
          font-size: 12px;
          font-weight: 650;
        }

        .cc-hint {
          color: #94a3b8;
          font-size: 11px;
          text-align: center;
        }

        [data-theme="dark"] .cc-card,
        .dark .cc-card {
          background:
            linear-gradient(#1e1e2e, #1e1e2e) padding-box,
            linear-gradient(135deg, rgba(129, 140, 248, 0.8), rgba(192, 132, 252, 0.34), rgba(56, 189, 248, 0.7)) border-box;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
        }

        [data-theme="dark"] .cc-label,
        .dark .cc-label,
        [data-theme="dark"] .cc-hint,
        .dark .cc-hint {
          color: #94a3b8;
        }

        [data-theme="dark"] .cc-value,
        .dark .cc-value,
        [data-theme="dark"] .cc-input,
        .dark .cc-input {
          color: #e2e8f0;
        }

        [data-theme="dark"] .cc-ring-track,
        .dark .cc-ring-track {
          stroke: #334155;
        }

        [data-theme="dark"] .cc-ring-progress,
        .dark .cc-ring-progress {
          stroke: #818cf8;
        }

        [data-theme="dark"] .cc-button,
        .dark .cc-button {
          background: #818cf8;
          box-shadow: 0 4px 12px rgba(129, 140, 248, 0.3);
        }

        [data-theme="dark"] .cc-button:hover,
        .dark .cc-button:hover {
          background: #6f7bf3;
          box-shadow: 0 6px 16px rgba(129, 140, 248, 0.42);
        }

        [data-theme="dark"] .cc-badge,
        .dark .cc-badge {
          color: #94a3b8;
          background: #273449;
        }

        @media (prefers-color-scheme: dark) {
          .cc-card:not(.light *):not([data-theme="light"] *) {
            background:
              linear-gradient(#1e1e2e, #1e1e2e) padding-box,
              linear-gradient(135deg, rgba(129, 140, 248, 0.8), rgba(192, 132, 252, 0.34), rgba(56, 189, 248, 0.7)) border-box;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
          }

          .cc-label:not(.light *):not([data-theme="light"] *),
          .cc-hint:not(.light *):not([data-theme="light"] *) {
            color: #94a3b8;
          }

          .cc-value:not(.light *):not([data-theme="light"] *),
          .cc-input:not(.light *):not([data-theme="light"] *) {
            color: #e2e8f0;
          }

          .cc-ring-track:not(.light *):not([data-theme="light"] *) {
            stroke: #334155;
          }

          .cc-ring-progress:not(.light *):not([data-theme="light"] *) {
            stroke: #818cf8;
          }

          .cc-button:not(.light *):not([data-theme="light"] *) {
            background: #818cf8;
            box-shadow: 0 4px 12px rgba(129, 140, 248, 0.3);
          }

          .cc-badge:not(.light *):not([data-theme="light"] *) {
            color: #94a3b8;
            background: #273449;
          }
        }

        @media (max-width: 420px) {
          .cc-wrapper {
            padding: 12px;
          }

          .cc-card {
            padding: 24px 18px 20px;
          }
        }
      `}</style>

      <div key={shakeKey} className="cc-card">
        <span className="cc-label">Counter</span>

        <div className="cc-stage">
          <svg
            className="cc-ring"
            viewBox="0 0 190 190"
            role="img"
            aria-label={`Counter progress: ${Math.round(progress)} percent`}
          >
            <circle
              className="cc-ring-track"
              cx="95"
              cy="95"
              r={radius}
            />
            <circle
              className="cc-ring-progress"
              cx="95"
              cy="95"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          {isEditing ? (
            <input
              className="cc-input"
              type="text"
              inputMode={allowDecimal ? 'decimal' : 'numeric'}
              value={draftValue}
              autoFocus
              aria-label="Edit counter value"
              onChange={(event) => setDraftValue(event.target.value)}
              onBlur={confirmInput}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  confirmInput()
                }

                if (event.key === 'Escape') {
                  event.preventDefault()
                  setDraftValue(String(countRef.current))
                  setIsEditing(false)
                }
              }}
            />
          ) : (
            <button
              key={count}
              className="cc-value"
              type="button"
              aria-label={`Current value ${count}. Click to edit`}
              onClick={beginEditing}
            >
              {count}
            </button>
          )}
        </div>

        <div className="cc-buttons" aria-label="Counter controls">
          <button
            className="cc-button"
            type="button"
            aria-label="Decrease value"
            onPointerDown={() => startRepeat(-1)}
            onPointerUp={clearRepeat}
            onPointerLeave={clearRepeat}
            onPointerCancel={clearRepeat}
            onClick={(event) => {
              if (event.detail === 0) {
                changeBy(-1)
              }
            }}
          >
            −
          </button>

          <button
            className="cc-button"
            type="button"
            aria-label="Increase value"
            onPointerDown={() => startRepeat(1)}
            onPointerUp={clearRepeat}
            onPointerLeave={clearRepeat}
            onPointerCancel={clearRepeat}
            onClick={(event) => {
              if (event.detail === 0) {
                changeBy(1)
              }
            }}
          >
            +
          </button>
        </div>

        <div className="cc-secondary">
          {count !== startingValue && (
            <button className="cc-reset" type="button" onClick={reset}>
              Reset
            </button>
          )}

          {previousValueRef.current !== null && (
            <button className="cc-undo" type="button" onClick={undo}>
              Undo
            </button>
          )}

          <span className="cc-badge">
            {changeCount} {changeCount === 1 ? 'change' : 'changes'}
          </span>
        </div>

        <span className="cc-status" aria-live="polite">
          {status}
        </span>

        <span className="cc-hint">
          Click the value to edit. Use arrow keys or hold a button.
        </span>
      </div>
    </div>
  )
}

