import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { validateNumber, validateText } from '../utils/inputValidation';

interface CompleteInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionId: string;
  onSuccess: () => void;
}

export default function CompleteInspectionModal({
  isOpen,
  onClose,
  inspectionId,
  onSuccess
}: CompleteInspectionModalProps) {
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate score
    const scoreValidation = validateNumber(score, 'Score', 0, 100);
    if (!scoreValidation.isValid) {
      toast.error(scoreValidation.error);
      return;
    }

    // Validate notes if provided
    if (notes.trim()) {
      const notesValidation = validateText(notes, 'Notes', 1, 500);
      if (!notesValidation.isValid) {
        toast.error(notesValidation.error);
        return;
      }
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('inspections')
        .update({ 
          status: 'completed',
          completed_date: new Date().toISOString(),
          score: parseInt(score),
          notes: notes.trim() || null
        })
        .eq('id', inspectionId);

      if (error) throw error;
      
      toast.success('Inspection marked as completed');
      onSuccess();
      onClose();
      setScore('');
      setNotes('');
    } catch (error) {
      console.error('Failed to complete inspection:', error);
      toast.error('Failed to complete inspection');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Complete Inspection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score (0-100) *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Enter score"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              rows={4}
              maxLength={500}
              placeholder="Add any additional notes or observations..."
            />
            <p className="text-xs text-gray-500 mt-1">{notes.length}/500 characters</p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Completing...' : 'Complete Inspection'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
