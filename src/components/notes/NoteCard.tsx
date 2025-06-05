import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Calendar, Edit3 } from "lucide-react";
import { Note } from "@/types/note";
import { EditNoteDialog } from "./EditNoteDialog";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, content: string) => void;
}

export const NoteCard = ({ note, onDelete, onUpdate }: NoteCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  const handleEdit = (title: string, content: string) => {
    onUpdate(note.id, title, content);
    setEditDialogOpen(false);
  };

  const getPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 line-clamp-2 flex-1">
              {note.title || "Untitled Note"}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <Edit3 className="h-4 w-4 text-slate-600" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this note? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-slate-600 text-sm mb-4 line-clamp-4">
            {getPreview(note.content)}
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(note.createdAt)}
            </Badge>
            {note.updatedAt !== note.createdAt && (
              <span className="text-xs text-slate-500">
                Updated {formatDate(note.updatedAt)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <EditNoteDialog
        note={note}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEdit}
      />
    </>
  );
};
