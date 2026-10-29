"use client";

import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Check,
  PanelsTopLeft,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { AddCardForm } from "./add-card-form";
import type { BoardColumn } from "./board-data";
import { Card } from "./card";
import { useBoard } from "./use-board";

type ColumnProps = {
  column: BoardColumn;
  isEditing: boolean;
  onAdd: (title: string, details: string) => void;
  onDelete: (cardId: string) => void;
  onEdit: () => void;
  onRename: (title: string) => void;
};

function BoardColumnView({
  column,
  isEditing,
  onAdd,
  onDelete,
  onEdit,
  onRename,
}: ColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `column:${column.id}`,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [columnName, setColumnName] = useState(column.title);

  function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = columnName.trim();
    if (trimmedName) {
      onRename(trimmedName);
    }
  }

  return (
    <section
      aria-labelledby={`column-title-${column.id}`}
      className={`kanban-column${isOver ? " kanban-column-over" : ""}`}
      ref={setNodeRef}
      role="region"
    >
      <header className="column-header">
        {isEditing ? (
          <form className="rename-column-form" onSubmit={handleRename}>
            <label className="sr-only" htmlFor={`column-name-${column.id}`}>
              Column name
            </label>
            <input
              autoFocus
              id={`column-name-${column.id}`}
              aria-label="Column name"
              onChange={(event) => setColumnName(event.target.value)}
              required
              value={columnName}
            />
            <button
              className="icon-button save-column-name"
              aria-label="Save column name"
              type="submit"
            >
              <Check aria-hidden="true" size={16} />
            </button>
            <button
              className="icon-button cancel-column-name"
              aria-label="Cancel column rename"
              onClick={() => {
                setColumnName(column.title);
                onEdit();
              }}
              type="button"
            >
              <X aria-hidden="true" size={16} />
            </button>
          </form>
        ) : (
          <div className="column-heading">
            <div className="column-title-wrap">
              <span className={`column-dot column-dot-${column.id}`} />
              <h2 id={`column-title-${column.id}`}>{column.title}</h2>
              <span className="column-count">{column.cards.length}</span>
            </div>
            <button
              className="icon-button rename-column"
              aria-label={`Rename ${column.title} column`}
              onClick={() => {
                setColumnName(column.title);
                onEdit();
              }}
              type="button"
            >
              <Pencil aria-hidden="true" size={14} />
            </button>
          </div>
        )}
      </header>

      <SortableContext
        items={column.cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="card-list">
          {column.cards.map((card) => (
            <Card card={card} key={card.id} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>

      {isAdding ? (
        <AddCardForm
          onAdd={(title, details) => {
            onAdd(title, details);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <button
          className="add-card-trigger"
          aria-label={`Add card to ${column.title}`}
          onClick={() => setIsAdding(true)}
          type="button"
        >
          <Plus aria-hidden="true" size={16} />
          <span>Add a card</span>
        </button>
      )}
    </section>
  );
}

export function Board() {
  const { columns, renameColumn, addCard, deleteCard, moveCard } = useBoard();
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const cardCount = columns.reduce(
    (total, column) => total + column.cards.length,
    0,
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) {
      return;
    }

    const destinationId = over.id.toString();
    const destination =
      columns.find((column) => `column:${column.id}` === destinationId) ??
      columns.find((column) =>
        column.cards.some((card) => card.id === destinationId),
      );

    if (destination) {
      moveCard(active.id.toString(), destination.id);
    }
  }

  return (
    <section className="board-panel" aria-labelledby="board-title">
      <div className="board-heading">
        <div className="board-heading-copy">
          <p className="board-kicker">
            <span className="board-live-dot" />
            YOUR WORKSPACE
          </p>
          <h2 id="board-title">Product launch</h2>
          <p className="board-subtitle">
            A little more clarity, one card at a time.
          </p>
        </div>
        <div className="board-summary" aria-label="Board summary">
          <span className="board-summary-icon">
            <PanelsTopLeft aria-hidden="true" size={18} />
          </span>
          <span>
            <strong>{columns.length} columns</strong>
            <span className="summary-separator">/</span>
            <strong>{cardCount} cards</strong>
          </span>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        id="kanban-board"
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="board-scroll">
          <div aria-label="Project board" className="board-columns" role="region">
            {columns.map((column) => (
              <BoardColumnView
                column={column}
                isEditing={editingColumnId === column.id}
                key={column.id}
                onAdd={(title, details) => addCard(column.id, title, details)}
                onDelete={deleteCard}
                onEdit={() =>
                  setEditingColumnId((current) =>
                    current === column.id ? null : column.id,
                  )
                }
                onRename={(title) => {
                  renameColumn(column.id, title);
                  setEditingColumnId(null);
                }}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </section>
  );
}
