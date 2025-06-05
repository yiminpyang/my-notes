import { FileText } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-slate-100 rounded-full p-6 mb-4">
        <FileText className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        No notes yet
      </h3>
      <p className="text-slate-600 max-w-md">
        Start capturing your thoughts by creating your first note. Click the
        "New Note" button to get started.
      </p>
    </div>
  );
};
