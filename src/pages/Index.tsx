import { useState, useMemo } from "react";
import { useNotes } from "@/hooks/use-notes";
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog";
import { NotesList } from "@/components/notes/NotesList";
import { SearchBar } from "@/components/notes/SearchBar";
import { toast } from "@/hooks/use-toast";
import { StickyNote, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "updated" | "title">(
    "created",
  );

  // Filter and sort notes based on search query and sort option
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query),
      );
    }

    // Sort notes
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "created":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  }, [notes, searchQuery, sortBy]);

  const handleCreateNote = (title: string, content: string) => {
    try {
      createNote({ title, content });
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    try {
      updateNote({ id, title, content });
      toast({
        title: "Note updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = (id: string) => {
    try {
      deleteNote(id);
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTotalNotesText = () => {
    const total = notes.length;
    const filtered = filteredAndSortedNotes.length;

    if (searchQuery.trim() && filtered !== total) {
      return `${filtered} of ${total} notes`;
    }

    return `${total} ${total === 1 ? "note" : "notes"}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <StickyNote className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">My Notes</h1>
                <p className="text-slate-600">{getTotalNotesText()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Sort by{" "}
                    {sortBy === "created"
                      ? "Date Created"
                      : sortBy === "updated"
                        ? "Date Modified"
                        : "Title"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("created")}>
                    Date Created
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("updated")}>
                    Date Modified
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title")}>
                    Title
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CreateNoteDialog onCreateNote={handleCreateNote} />
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <div className="mb-4">
            <p className="text-sm text-slate-600">
              {filteredAndSortedNotes.length === 0
                ? `No notes found for "${searchQuery}"`
                : `Found ${filteredAndSortedNotes.length} ${
                    filteredAndSortedNotes.length === 1 ? "note" : "notes"
                  } for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Notes List */}
        <main>
          <NotesList
            notes={filteredAndSortedNotes}
            loading={loading}
            onDeleteNote={handleDeleteNote}
            onUpdateNote={handleUpdateNote}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
