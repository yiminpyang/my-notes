import { useState, useEffect } from "react";
import { Note, CreateNoteInput, UpdateNoteInput } from "@/types/note";

const STORAGE_KEY = "personal-notes";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error("Failed to save notes:", error);
      }
    }
  }, [notes, loading]);

  const createNote = (input: CreateNoteInput): Note => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (input: UpdateNoteInput): Note | null => {
    const noteIndex = notes.findIndex((note) => note.id === input.id);
    if (noteIndex === -1) return null;

    const updatedNote: Note = {
      ...notes[noteIndex],
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => {
      const newNotes = [...prev];
      newNotes[noteIndex] = updatedNote;
      return newNotes;
    });

    return updatedNote;
  };

  const deleteNote = (id: string): boolean => {
    const noteExists = notes.some((note) => note.id === id);
    if (!noteExists) return false;

    setNotes((prev) => prev.filter((note) => note.id !== id));
    return true;
  };

  const getNote = (id: string): Note | null => {
    return notes.find((note) => note.id === id) || null;
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
};
