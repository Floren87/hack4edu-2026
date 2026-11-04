import type { Language } from '../../types';
import { localizeText as text } from '../../i18n/localize';
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Palette, RefreshCw, Star, Trash2, Undo2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addChildComment, CHILD_COMMENT_MAX_LENGTH, COMMENT_EMOJIS } from '../../utils/childComments';

interface WorkshopItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  rotation: number;
  x: number;
  y: number;
}

const getAVAILABLE_PARTS = (language: Language) => ([
  { id: 'part_umbrella', name: text(language, "Paraguas Solar"), icon: '☂️', label: text(language, "Paraguas") },
  { id: 'part_gear', name: text(language, "Engranaje de Oro"), icon: '⚙️', label: text(language, "Engranaje") },
  { id: 'part_crystal', name: text(language, "Cristal Cuántico"), icon: '💎', label: text(language, "Cristal") },
  { id: 'part_spring', name: text(language, "Muelle Saltarín"), icon: '🌀', label: text(language, "Muelle") },
  { id: 'part_bulb', name: text(language, "Bombilla de Ideas"), icon: '💡', label: text(language, "Bombilla") },
  { id: 'part_antenna', name: text(language, "Antena Cósmica"), icon: '📡', label: text(language, "Antena") },
  { id: 'part_wing', name: text(language, "Ala Mecánica"), icon: '🪽', label: text(language, "Ala") },
  { id: 'part_wheel', name: text(language, "Rueda Flotante"), icon: '🛞', label: text(language, "Rueda") },
  { id: 'part_bell', name: text(language, "Campana Sonora"), icon: '🔔', label: text(language, "Campana") },
  { id: 'part_leaf', name: text(language, "Hoja Viva"), icon: '🌿', label: text(language, "Hoja") },
  { id: 'part_rain', name: text(language, "Nube de Lluvia"), icon: '🌧️', label: text(language, "Nube") },
  { id: 'part_sun', name: text(language, "Sol Brillante"), icon: '☀️', label: text(language, "Sol") },
  { id: 'part_wave', name: text(language, "Ola de Agua"), icon: '🌊', label: text(language, "Agua") },
  { id: 'part_stone', name: text(language, "Piedra Fuerte"), icon: '🪨', label: text(language, "Piedra") },
  { id: 'part_fish', name: text(language, "Pez Nadador"), icon: '🐟', label: text(language, "Pez") },
  { id: 'part_bee', name: text(language, "Abeja Trabajadora"), icon: '🐝', label: text(language, "Abeja") },
  { id: 'part_bucket', name: text(language, "Cubo Grande"), icon: '🪣', label: text(language, "Cubo") },
  { id: 'part_rope', name: text(language, "Cuerda Larga"), icon: '🪢', label: text(language, "Cuerda") },
]);

const getINVENTION_PURPOSES = (language: Language) => ([
  { id: 'flying', label: text(language, "🚀 Transporte volador o espacial"), icon: '🚀' },
  { id: 'nature', label: text(language, "🌱 Sanador de plantas y animales"), icon: '🌱' },
  { id: 'friend', label: text(language, "🤖 Amigo robot que cuida emociones"), icon: '🤖' },
  { id: 'music', label: text(language, "🎶 Música mágica para calmar el ambiente"), icon: '🎶' },
  { id: 'vision', label: text(language, "🔍 Lupa para descubrir mundos secretos"), icon: '🔍' },
]);

export const CreativityGame: React.FC = () => {
  const { language, setView, logGameTelemetry, addStars, activeStudent } = useApp();
  const AVAILABLE_PARTS = getAVAILABLE_PARTS(language);
  const INVENTION_PURPOSES = getINVENTION_PURPOSES(language);
  const t = translations[language];

  const [placedItems, setPlacedItems] = useState<WorkshopItem[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [inventoName, setInventoName] = useState(text(language, "Super Invento"));
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [originalMovesCount, setOriginalMovesCount] = useState(0);
  const [repositionCount, setRepositionCount] = useState(0);
  // Historial para «Deshacer»: cómo estaba la mesa antes de cada acción (máximo 30 pasos).
  const [history, setHistory] = useState<WorkshopItem[][]>([]);
  const [undoCount, setUndoCount] = useState(0);
  // Comentario opcional del niño: solo va al informe, nunca al perfil ni a la telemetría.
  const [childComment, setChildComment] = useState('');
  const [commentEmojis, setCommentEmojis] = useState<string[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const workshopRef = useRef<HTMLDivElement>(null);
  // Arrastre en curso: dónde empezó el puntero y la pieza, y si ya se ha movido.
  const dragRef = useRef<{ index: number; pointerId: number; startX: number; startY: number; itemX: number; itemY: number; size: number; moved: boolean; before: WorkshopItem[] } | null>(null);
  const lastKeyboardMoveRef = useRef(0);

  // Add initial item
  useEffect(() => {
    setPlacedItems([
      { id: 'part_umbrella', name: text(language, "Paraguas"), icon: '☂️', category: 'base', rotation: 0, x: 180, y: 140 },
      { id: 'part_gear', name: text(language, "Engranaje"), icon: '⚙️', category: 'motor', rotation: 0, x: 230, y: 190 },
    ]);
  }, []);

  // Tamaño aproximado de una pieza (emoji de 36 px + relleno) para que no se salga de la mesa.
  const PIECE_SIZE = 56;
  const DRAG_THRESHOLD = 5;
  const KEYBOARD_STEP = 10;

  const clampToWorkshop = (x: number, y: number, size = PIECE_SIZE) => {
    const area = workshopRef.current;
    const maxX = Math.max(0, (area?.clientWidth ?? 400) - size);
    const maxY = Math.max(0, (area?.clientHeight ?? 300) - size);
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  };

  const MAX_HISTORY = 30;
  const saveHistory = (snapshot: WorkshopItem[] = placedItems) => {
    setHistory(prev => [...prev, snapshot].slice(-MAX_HISTORY));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    soundManager.playClick();
    setPlacedItems(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
    setSelectedItemIndex(null);
    setUndoCount(prev => prev + 1);
  };

  const countReposition = () => {
    setRepositionCount(prev => prev + 1);
    setOriginalMovesCount(prev => prev + 1);
  };

  const moveItem = (index: number, x: number, y: number, size?: number) => {
    const pos = clampToWorkshop(x, y, size);
    setPlacedItems(prev => prev.map((item, idx) => (idx === index ? { ...item, ...pos } : item)));
  };

  const handlePiecePointerDown = (event: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (event.button !== 0) return;
    const item = placedItems[index];
    if (!item) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Algunos navegadores antiguos no permiten capturar el puntero; el arrastre sigue funcionando.
    }
    dragRef.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      itemX: item.x,
      itemY: item.y,
      size: Math.max(event.currentTarget.offsetWidth, event.currentTarget.offsetHeight),
      moved: false,
      before: placedItems,
    };
    if (selectedItemIndex !== index) soundManager.playPop();
    setSelectedItemIndex(index);
  };

  const handlePiecePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.moved) {
      drag.moved = true;
      setDraggingIndex(drag.index);
    }
    moveItem(drag.index, drag.itemX + dx, drag.itemY + dy, drag.size);
  };

  const handlePiecePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      soundManager.playClick();
      saveHistory(drag.before);
      countReposition();
    }
    dragRef.current = null;
    setDraggingIndex(null);
  };

  const handlePieceKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    const step = event.shiftKey ? KEYBOARD_STEP * 3 : KEYBOARD_STEP;
    const size = Math.max(event.currentTarget.offsetWidth, event.currentTarget.offsetHeight);
    const now = Date.now();
    const startsNewSeries = now - lastKeyboardMoveRef.current > 800;
    lastKeyboardMoveRef.current = now;
    // Una serie seguida de pulsaciones cuenta como una sola recolocación y un solo paso de «Deshacer».
    if (startsNewSeries) {
      saveHistory();
      countReposition();
    }
    setSelectedItemIndex(index);
    // Se parte de la posición más reciente para que varias pulsaciones rápidas se sumen.
    setPlacedItems(prev => prev.map((item, idx) => (
      idx === index ? { ...item, ...clampToWorkshop(item.x + delta[0] * step, item.y + delta[1] * step, size) } : item
    )));
  };

  // Mantiene todas las piezas dentro de la mesa al abrir el juego y al cambiar el tamaño de la ventana.
  useEffect(() => {
    const fitAll = () => setPlacedItems(prev => prev.map(item => ({ ...item, ...clampToWorkshop(item.x, item.y) })));
    fitAll();
    window.addEventListener('resize', fitAll);
    return () => window.removeEventListener('resize', fitAll);
  }, []);

  const handleAddPart = (part: typeof AVAILABLE_PARTS[0]) => {
    soundManager.playPop();
    const area = workshopRef.current;
    const width = area?.clientWidth ?? 400;
    const height = area?.clientHeight ?? 300;
    const newItem: WorkshopItem = {
      id: `${part.id}_${Date.now()}`,
      name: part.name,
      icon: part.icon,
      category: 'part',
      rotation: 0,
      ...clampToWorkshop(
        Math.floor(Math.random() * (width - PIECE_SIZE)),
        Math.floor(Math.random() * (height - PIECE_SIZE)),
      ),
    };
    saveHistory();
    setPlacedItems(prev => [...prev, newItem]);
    setSelectedItemIndex(placedItems.length);
    setOriginalMovesCount(prev => prev + 1);
  };

  const handleRotateSelected = () => {
    if (selectedItemIndex === null || !placedItems[selectedItemIndex]) return;
    soundManager.playClick();
    saveHistory();
    setPlacedItems(prev => prev.map((item, idx) => {
      if (idx !== selectedItemIndex) return item;
      return { ...item, rotation: (item.rotation + 45) % 360 };
    }));
    setOriginalMovesCount(prev => prev + 1);
  };

  // Quita la pieza seleccionada. Si no hay ninguna, quita la última que se puso;
  // al volver a pulsar, la anterior, y así sucesivamente.
  const hasSelection = selectedItemIndex !== null && !!placedItems[selectedItemIndex];
  const handleRemovePiece = () => {
    if (placedItems.length === 0) return;
    const indexToRemove = hasSelection ? selectedItemIndex! : placedItems.length - 1;
    soundManager.playPop();
    saveHistory();
    setPlacedItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setSelectedItemIndex(null);
  };

  // Ctrl+Z (o Cmd+Z) también deshace, salvo cuando se escribe en un campo de texto.
  const undoRef = useRef(handleUndo);
  undoRef.current = handleUndo;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undoRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleCommentEmoji = (emoji: string) => {
    soundManager.playClick();
    setCommentEmojis(prev => (prev.includes(emoji) ? prev.filter(e => e !== emoji) : [...prev, emoji]));
  };

  const handleSaveInvention = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);
    const purposeObj = INVENTION_PURPOSES.find(p => p.id === selectedPurpose);

    addChildComment(activeStudent.id, {
      createdAt: Date.now(),
      pieces: placedItems.map(item => item.icon),
      purpose: purposeObj ? purposeObj.label : null,
      emojis: commentEmojis,
      text: childComment,
    });

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // fallback
    }

    logGameTelemetry({
      gameId: 'creativity_game',
      gameType: 'core_minigame',
      category: 'creativity',
      durationSeconds: duration,
      attemptsCount: 1,
      originalMovesCount: Math.max(originalMovesCount, placedItems.length),
      successRate: 1,
      perseveranceScore: duration > 45 ? 0.9 : 0.75,
      notesObserved: [
        text(language, "Ensambló un artefacto con {0} piezas no convencionales.", [placedItems.length]),
        purposeObj ? text(language, "Asignó propósito creativo: \"{0}\"", [purposeObj.label]) : text(language, "Exploró combinación libre de piezas."),
        text(language, "Tiempo dedicado a la experimentación visual: {0}s.", [duration]),
        ...(repositionCount > 0 ? [text(language, "Recolocó piezas {0} veces para probar combinaciones.", [repositionCount])] : []),
        ...(undoCount > 0 ? [text(language, "Revisó y corrigió su invento {0} veces con «Deshacer».", [undoCount])] : [])
      ],
      metrics: {
        partsCount: placedItems.length,
        repositionsCount: repositionCount,
        undoCount,
        purposeSelected: selectedPurpose || 'libre',
        durationSec: duration,
      }
    });

    addStars(3);
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('child_hub')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-semibold">{t.backToHub}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">{' '}{text(language, "🎨 Minijuego 1: Creatividad")}{' '}</span>
          <AudioButton textToSpeak={`${t.gameCreativityTitle}. ${t.gameCreativityInstructions}`} />
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-5 border border-purple-800/40 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{t.gameCreativityTitle}</span>
              <Palette className="text-amber-400" size={20} />
            </h1>
            <p className="text-sm text-purple-200/80 mt-1">
              {t.gameCreativityInstructions}
            </p>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Workbench Canvas + child comment underneath */}
        <div className="md:col-span-2 space-y-4">
        <div className="rounded-3xl bg-slate-900/90 border-2 border-dashed border-indigo-700/50 p-4 relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="absolute top-3 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>{' '}{text(language, "🛠️ Mesa de Inventos")}{' '}</span>
            <span className="text-[11px] font-normal text-slate-500">{' '}{text(language, "(Arrastra las piezas para moverlas; tócalas para girarlas o quitarlas)")}{' '}</span>
          </div>

          {/* Interactive Workshop Area */}
          <div ref={workshopRef} onPointerDown={(event) => { if (event.target === event.currentTarget) setSelectedItemIndex(null); }} className="relative w-full h-[300px] mt-6 bg-slate-950/60 rounded-2xl border border-slate-800/60 overflow-hidden">
            {placedItems.map((item, idx) => {
              const isSelected = selectedItemIndex === idx;
              const isDragging = draggingIndex === idx;
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={text(language, "Pieza {0}. Arrástrala o usa las flechas para moverla.", [item.name])}
                  data-piece-id={item.id}
                  onPointerDown={(event) => handlePiecePointerDown(event, idx)}
                  onPointerMove={handlePiecePointerMove}
                  onPointerUp={handlePiecePointerUp}
                  onPointerCancel={handlePiecePointerUp}
                  onKeyDown={(event) => handlePieceKeyDown(event, idx)}
                  onFocus={() => setSelectedItemIndex(idx)}
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    transform: `rotate(${item.rotation}deg)`,
                    touchAction: 'none',
                  }}
                  className={`absolute select-none p-2 rounded-2xl flex items-center justify-center outline-none focus-visible:ring-4 focus-visible:ring-sky-400 ${
                    isDragging
                      ? 'cursor-grabbing ring-4 ring-amber-400 bg-indigo-900/40 scale-125 z-30 shadow-2xl'
                      : isSelected
                        ? 'cursor-grab transition-all duration-150 ring-4 ring-amber-400 bg-indigo-900/40 scale-110 z-20'
                        : 'cursor-grab transition-all duration-150 hover:scale-105 z-10'
                  }`}
                >
                  <span className="text-4xl filter drop-shadow-lg">{item.icon}</span>
                </div>
              );
            })}

            {placedItems.length === 0 && (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <span>{' '}{text(language, "Añade piezas desde la bandeja derecha para armar tu invento.")}{' '}</span>
              </div>
            )}
          </div>

          {/* Controls for Selected Item */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                title={text(language, "Deshacer la última acción")}
                className="px-3 py-1.5 rounded-xl bg-sky-950/60 border border-sky-800/60 text-xs font-semibold text-sky-200 hover:bg-sky-900/60 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <Undo2 size={13} />
                <span>{' '}{text(language, "Deshacer")}{' '}</span>
              </button>
              <button
                onClick={handleRotateSelected}
                disabled={selectedItemIndex === null}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>{' '}{text(language, "Girar 45°")}{' '}</span>
              </button>
              <button
                onClick={handleRemovePiece}
                disabled={placedItems.length === 0}
                title={hasSelection ? text(language, "Quitar la pieza seleccionada") : text(language, "Quitar la última pieza que pusiste")}
                className="px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/50 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{' '}{hasSelection ? text(language, "Quitar pieza") : text(language, "Quitar la última")}{' '}</span>
              </button>
            </div>

            <span className="text-xs font-medium text-slate-400">{' '}{text(language, "Piezas en tu invento:")}{' '}<strong className="text-amber-400">{placedItems.length}</strong>
            </span>
          </div>
        </div>

          {/* Optional child comment (only for the report, not stored in the profile) */}
          {!completed && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="child-comment" className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {text(language, "✏️ Cuéntanos tu invento (si quieres)")}
                </label>
                <AudioButton textToSpeak={text(language, "Cuéntanos tu invento, si quieres. Puedes escribir o elegir una carita.")} />
              </div>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={text(language, "¿Cómo te sientes con tu invento?")}>
                {COMMENT_EMOJIS.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => toggleCommentEmoji(emoji)}
                    aria-pressed={commentEmojis.includes(emoji)}
                    title={text(language, label)}
                    aria-label={text(language, label)}
                    className={`w-10 h-10 rounded-xl text-xl transition ${
                      commentEmojis.includes(emoji)
                        ? 'bg-amber-500/25 border-2 border-amber-400 scale-110'
                        : 'bg-slate-800/70 border border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >{emoji}</button>
                ))}
              </div>
              <textarea
                id="child-comment"
                dir="auto"
                value={childComment}
                onChange={(event) => setChildComment(event.target.value.slice(0, CHILD_COMMENT_MAX_LENGTH))}
                maxLength={CHILD_COMMENT_MAX_LENGTH}
                rows={3}
                placeholder={text(language, "Mi invento sirve para…")}
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700/60 p-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{text(language, "No escribas tu nombre ni dónde vives.")}</span>
                <span>{childComment.length}/{CHILD_COMMENT_MAX_LENGTH}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Available Parts Picker & Purpose */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{' '}{text(language, "Bandeja de Piezas Mágicas")}{' '}</span>
              <span className="text-[10px] text-slate-500">{' '}{text(language, "Toca para añadir")}{' '}</span>
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_PARTS.map(part => (
                <button
                  key={part.id}
                  onClick={() => handleAddPart(part)}
                  className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500 active:scale-95 transition-all"
                  title={part.name}
                >
                  <span className="text-2xl">{part.icon}</span>
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full">{part.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Superpower Purpose Selector */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <span>{t.gameCreativityPrompt}</span>
            </h3>
            <div className="space-y-1.5">
              {INVENTION_PURPOSES.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPurpose(p.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    selectedPurpose === p.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border-2 border-amber-400 text-white'
                      : 'bg-slate-800/70 border border-slate-700/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="leading-tight">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          {!completed ? (
            <button
              onClick={handleSaveInvention}
              disabled={placedItems.length < 2}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={18} />
              <span>{t.gameCreativityFinish}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-center space-y-2">
              <span className="text-2xl block">🎉</span>
              <p className="text-xs font-bold text-emerald-200">{' '}{text(language, "¡Invento registrado en tu pasaporte y en el informe pedagógico!")}{' '}</p>
              <button
                onClick={() => setView('child_hub')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >{' '}{text(language, "Volver a la Zona de Juegos")}{' '}</button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
