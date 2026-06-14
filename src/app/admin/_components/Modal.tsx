"use client";
import React, { ReactNode, FC } from "react";
import ReactModal from "react-modal";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modal"
      closeTimeoutMS={300}
      ariaHideApp={false}
      className="relative mx-4 w-full max-w-[600px] rounded-2xl bg-white px-5 py-8 shadow-xl outline-none sm:px-10 sm:py-10"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50"
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute -right-2 -top-2 rounded-full p-2 text-primary transition-colors hover:bg-background"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {children}
      </div>
    </ReactModal>
  );
};
