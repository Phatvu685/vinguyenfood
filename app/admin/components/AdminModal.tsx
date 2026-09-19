"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: ModalSize;
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AdminModal({ open, onClose, title, subtitle, size = "md", className, children, footer }: AdminModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const host = document.createElement("div");
    host.className = "vg-modal-portal";
    const body = document.body;
    if (body) body.appendChild(host);
    setPortalHost(host);
    setMounted(true);
    return () => {
      window.setTimeout(() => {
        if (host.parentNode) host.parentNode.removeChild(host);
      }, 0);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted || !portalHost) return null;

  const modal = (
    <div
      className="vg-modal-overlay"
      ref={overlayRef}
      role="presentation"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`vg-modal vg-modal-${size} ${className || ""}`.trim()} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        {(title || subtitle) && (
          <div className="vg-modal-header">
            <div className="vg-modal-header-info">
              {title && <h2 className="vg-modal-title">{title}</h2>}
              {subtitle && <p className="vg-modal-subtitle">{subtitle}</p>}
            </div>
            <button className="vg-modal-close" type="button" onClick={onClose} aria-label="Đóng">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>
        )}

        <div className="vg-modal-body">
          {children}
        </div>
        {footer && (
          <div className="vg-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, portalHost);
}
