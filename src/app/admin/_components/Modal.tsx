"use client";
import React, { ReactNode, FC } from "react";
import ReactModal from "react-modal";

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
      className={`relative rounded-2xl bg-white px-[60px] py-11 shadow-xl outline-none`}
      overlayClassName="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50"
    >
      <div
        className="flex size-full items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`absolute right-0 top-0 z-[999] p-3 text-base`}
          onClick={onClose}
          aria-label="Close"
        >
          x
        </button>
        {children}
      </div>
    </ReactModal>
  );
};
