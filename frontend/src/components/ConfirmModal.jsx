export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl p-7 max-w-sm w-full shadow-2xl animate-scale-in border border-outline-variant/10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
          </div>
          <h3 className="text-lg font-headline font-bold text-on-surface">{title || "Are you sure?"}</h3>
          <p className="text-sm text-on-surface-variant mt-2 font-label">{message || "This action cannot be undone."}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-outline-variant/30 text-on-surface font-headline font-bold py-3 rounded-full hover:bg-surface-container-high cursor-pointer uppercase tracking-widest text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-error hover:bg-red-700 text-white font-headline font-bold py-3 rounded-full cursor-pointer uppercase tracking-widest text-sm transition-colors shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
