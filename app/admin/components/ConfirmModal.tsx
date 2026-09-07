"use client";

import AdminModal from "./AdminModal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({ open, onClose, onConfirm, title = "Xác nhận xóa?", message = "Hành động này không thể hoàn tác.", confirmText = "Xóa", cancelText = "Hủy" }: ConfirmModalProps) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title=""
      size="sm"
      footer={
        <>
          <button className="vg-btn" type="button" onClick={onClose}>{cancelText}</button>
          <button className="vg-btn vg-btn-danger" type="button" onClick={() => { onConfirm(); onClose(); }}>{confirmText}</button>
        </>
      }
    >
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div className="vg-confirm-icon">⚠</div>
        <h3 className="vg-confirm-title">{title}</h3>
        <p className="vg-confirm-text">{message}</p>
      </div>
    </AdminModal>
  );
}
