import { Note } from "@/types/note";
import { NoteCard } from "./NoteCard";
import { EmptyState } from "./EmptyState";

interface NotesListProps {
  notes: Note[];
  loading: boolean;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
}

export const NotesList = ({
  notes,
  loading,
  onDeleteNote,
  onUpdateNote,
}: NotesListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
          onUpdate={onUpdateNote}
        />
      ))}
    </div>
  );
};
