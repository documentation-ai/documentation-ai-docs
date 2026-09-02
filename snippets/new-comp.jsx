// Describes this component for search. Optional — leave empty to omit it.
export const description = "an interactive color picker with HSL sliders, hex input, copy-to-clipboard, and preset swatches"

export const NewComp = ({
  initialColor = '#6366f1',
  presets = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#6366f1', '#a855f7',
    '#ec4899', '#64748b',
  ],
}) => {
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToHex = (h, s, l) => {
    const sat = s / 100
    const light = l / 100
    const a = sat * Math.min(light, 1 - light)
    const f = (n) => {
      const k = (n + h / 30) % 12
      const color = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const hexToRgb = (hex) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  })

  const [hsl, setHsl] = useState(() => hexToHsl(initialColor))
  const [hexInput, setHexInput] = useState(initialColor)
  const [copied, setCopied] = useState(false)
  const [recent, setRecent] = useState([])
  const copiedTimeoutRef = useRef(null)

  const currentHex = hslToHex(hsl.h, hsl.s, hsl.l)
  const rgb = hexToRgb(currentHex)
  const isLight = hsl.l > 60

  const updateHsl = useCallback(
    (partial) => {
      setHsl((prev) => {
        const next = { ...prev, ...partial }
        setHexInput(hslToHex(next.h, next.s, next.l))
        return next
      })
    },
    [],
  )

  const handleHexInput = useCallback((value) => {
    const normalized = value.startsWith('#') ? value : `#${value}`
    setHexInput(normalized)

    if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      setHsl(hexToHsl(normalized))
    }
  }, [])

  const selectPreset = useCallback(
    (color) => {
      const nextHsl = hexToHsl(color)
      setHsl(nextHsl)
      setHexInput(color)
      setRecent((prev) => {
        if (prev[0] === color) return prev
        return [color, ...prev.filter((c) => c !== color)].slice(0, 5)
      })
    },
    [],
  )

  const copyHex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentHex)
    } catch {
      // Fallback for non-secure contexts
      const textarea = document.createElement('textarea')
      textarea.value = currentHex
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
      } catch {
        // noop
      }
      document.body.removeChild(textarea)
    }

    setCopied(true)

    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current)
    }

    copiedTimeoutRef.current = window.setTimeout(() => {
      setCopied(false)
      copiedTimeoutRef.current = null
    }, 1500)
  }, [currentHex])

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const swatches = [...new Set([...recent, ...presets])]

  const sliderTrack = (channel) => {
    if (channel === 'h') {
      return 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))'
    }
    if (channel === 's') {
      return `linear-gradient(to right, hsl(${hsl.h},0%,${hsl.l}%), hsl(${hsl.h},100%,${hsl.l}%))`
    }
    return `linear-gradient(to right, #000, hsl(${hsl.h},${hsl.s}%,50%), #fff)`
  }

  return (
    <div className="cp-wrapper">
      <style>{`
        .cp-wrapper {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
        }

        .cp-card {
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: min(100%, 360px);
          padding: 24px;
          border: 1px solid transparent;
          border-radius: 20px;
          background:
            linear-gradient(#ffffff, #ffffff) padding-box,
            linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.24), rgba(56, 189, 248, 0.5)) border-box;
          box-shadow: 0 14px 36px rgba(30, 41, 59, 0.09);
        }

        .cp-preview {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border-radius: 14px;
          background: #f8fafc;
          transition: background 0.2s ease;
        }

        .cp-swatch {
          flex-shrink: 0;
          width: 60px;
          height: 60px;
          border-radius: 14px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          transition: background 0.15s ease;
        }

        .cp-preview-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .cp-hex-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cp-hex-input {
          width: 110px;
          border: 0;
          border-bottom: 2px solid #cbd5e1;
          outline: 0;
          padding: 2px 0;
          color: #1e293b;
          background: transparent;
          font: inherit;
          font-size: 18px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: border-color 0.2s ease;
        }

        .cp-hex-input:focus {
          border-color: #6366f1;
        }

        .cp-copy-btn {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 9px;
          color: #64748b;
          background: transparent;
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .cp-copy-btn:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
        }

        .cp-copy-btn.cp-copied {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
        }

        .cp-rgb {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .cp-slider-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cp-slider-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cp-slider-label {
          flex-shrink: 0;
          width: 14px;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .cp-slider {
          flex: 1;
          height: 14px;
          border-radius: 7px;
          appearance: none;
          -webkit-appearance: none;
          outline: 0;
          cursor: pointer;
        }

        .cp-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }

        .cp-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }

        .cp-slider-value {
          flex-shrink: 0;
          width: 38px;
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .cp-presets-label {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .cp-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cp-preset {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 0;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .cp-preset:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .cp-preset.cp-active {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
        }

        /* Dark mode */
        [data-theme="dark"] .cp-card,
        .dark .cp-card {
          background:
            linear-gradient(#1e1e2e, #1e1e2e) padding-box,
            linear-gradient(135deg, rgba(129, 140, 248, 0.7), rgba(192, 132, 252, 0.3), rgba(56, 189, 248, 0.6)) border-box;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
        }

        [data-theme="dark"] .cp-preview,
        .dark .cp-preview {
          background: #27293a;
        }

        [data-theme="dark"] .cp-hex-input,
        .dark .cp-hex-input {
          color: #e2e8f0;
          border-color: #475569;
        }

        [data-theme="dark"] .cp-hex-input:focus,
        .dark .cp-hex-input:focus {
          border-color: #818cf8;
        }

        [data-theme="dark"] .cp-copy-btn,
        .dark .cp-copy-btn {
          color: #94a3b8;
        }

        [data-theme="dark"] .cp-copy-btn:hover,
        .dark .cp-copy-btn:hover {
          color: #818cf8;
          background: rgba(129, 140, 248, 0.15);
        }

        [data-theme="dark"] .cp-rgb,
        .dark .cp-rgb,
        [data-theme="dark"] .cp-slider-label,
        .dark .cp-slider-label,
        [data-theme="dark"] .cp-presets-label,
        .dark .cp-presets-label {
          color: #94a3b8;
        }

        [data-theme="dark"] .cp-slider-value,
        .dark .cp-slider-value {
          color: #cbd5e1;
        }

        [data-theme="dark"] .cp-slider::-webkit-slider-thumb,
        .dark .cp-slider::-webkit-slider-thumb {
          border-color: #1e1e2e;
        }

        [data-theme="dark"] .cp-slider::-moz-range-thumb,
        .dark .cp-slider::-moz-range-thumb {
          border-color: #1e1e2e;
        }

        [data-theme="dark"] .cp-preset,
        .dark .cp-preset {
          border-color: rgba(30, 30, 46, 0.6);
        }

        [data-theme="dark"] .cp-preset.cp-active,
        .dark .cp-preset.cp-active {
          border-color: #818cf8;
          box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.3);
        }

        @media (prefers-color-scheme: dark) {
          .cp-card:not(.light *):not([data-theme="light"] *) {
            background:
              linear-gradient(#1e1e2e, #1e1e2e) padding-box,
              linear-gradient(135deg, rgba(129, 140, 248, 0.7), rgba(192, 132, 252, 0.3), rgba(56, 189, 248, 0.6)) border-box;
            box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
          }

          .cp-preview:not(.light *):not([data-theme="light"] *) {
            background: #27293a;
          }

          .cp-hex-input:not(.light *):not([data-theme="light"] *) {
            color: #e2e8f0;
            border-color: #475569;
          }

          .cp-hex-input:not(.light *):not([data-theme="light"] *):focus {
            border-color: #818cf8;
          }

          .cp-rgb:not(.light *):not([data-theme="light"] *),
          .cp-slider-label:not(.light *):not([data-theme="light"] *),
          .cp-presets-label:not(.light *):not([data-theme="light"] *) {
            color: #94a3b8;
          }

          .cp-slider-value:not(.light *):not([data-theme="light"] *) {
            color: #cbd5e1;
          }
        }

        @media (max-width: 420px) {
          .cp-wrapper {
            padding: 12px;
          }

          .cp-card {
            padding: 18px;
          }
        }
      `}</style>

      <div className="cp-card">
        {/* Preview & hex */}
        <div className="cp-preview">
          <div
            className="cp-swatch"
            style={{ background: currentHex }}
            role="img"
            aria-label={`Selected color ${currentHex}`}
          />
          <div className="cp-preview-info">
            <div className="cp-hex-row">
              <input
                className="cp-hex-input"
                type="text"
                value={hexInput}
                spellCheck={false}
                aria-label="Hex color value"
                onChange={(e) => handleHexInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur()
                  }
                }}
              />
              <button
                className={`cp-copy-btn${copied ? ' cp-copied' : ''}`}
                type="button"
                aria-label={copied ? 'Copied' : 'Copy hex value'}
                onClick={copyHex}
              >
                {copied ? '✓' : '⧉'}
              </button>
            </div>
            <span className="cp-rgb">
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </span>
          </div>
        </div>

        {/* Sliders */}
        <div className="cp-slider-group">
          <div className="cp-slider-row">
            <span className="cp-slider-label">H</span>
            <input
              className="cp-slider"
              type="range"
              min={0}
              max={360}
              value={hsl.h}
              aria-label="Hue"
              style={{ background: sliderTrack('h') }}
              onChange={(e) => updateHsl({ h: Number(e.target.value) })}
            />
            <span className="cp-slider-value">{hsl.h}</span>
          </div>

          <div className="cp-slider-row">
            <span className="cp-slider-label">S</span>
            <input
              className="cp-slider"
              type="range"
              min={0}
              max={100}
              value={hsl.s}
              aria-label="Saturation"
              style={{ background: sliderTrack('s') }}
              onChange={(e) => updateHsl({ s: Number(e.target.value) })}
            />
            <span className="cp-slider-value">{hsl.s}</span>
          </div>

          <div className="cp-slider-row">
            <span className="cp-slider-label">L</span>
            <input
              className="cp-slider"
              type="range"
              min={0}
              max={100}
              value={hsl.l}
              aria-label="Lightness"
              style={{ background: sliderTrack('l') }}
              onChange={(e) => updateHsl({ l: Number(e.target.value) })}
            />
            <span className="cp-slider-value">{hsl.l}</span>
          </div>
        </div>

        {/* Presets */}
        <div>
          <div className="cp-presets-label">
            {recent.length > 0 ? 'Recent & Presets' : 'Presets'}
          </div>
          <div className="cp-presets">
            {swatches.map((color) => (
              <button
                key={color}
                className={`cp-preset${color.toLowerCase() === currentHex.toLowerCase() ? ' cp-active' : ''}`}
                type="button"
                style={{ background: color }}
                aria-label={`Select color ${color}`}
                onClick={() => selectPreset(color)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
