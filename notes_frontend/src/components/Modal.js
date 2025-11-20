import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  /** Accessible modal dialog with focus trap and Escape to close. */
  const dialogRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Focus the first focusable element
      const focusables = getFocusable(dialogRef.current);
      if (focusables.length) {
        focusables[0].focus();
        firstFocusableRef.current = focusables[0];
        lastFocusableRef.current = focusables[focusables.length - 1];
      }
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose?.();
        } else if (e.key === 'Tab') {
          // Trap focus
          const focusables = getFocusable(dialogRef.current);
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown, true);
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" aria-hidden={!open}>
      <div
        className="modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header" id="modal-title">{title}</div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} aria-label={cancelText}>
            {cancelText}
          </button>
          <button className="btn" onClick={onConfirm} aria-label={confirmText}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function getFocusable(root) {
  if (!root) return [];
  const selectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];
  return Array.from(root.querySelectorAll(selectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
}

export default Modal;
