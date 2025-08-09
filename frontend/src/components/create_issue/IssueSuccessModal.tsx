import React from "react";
import { FiCheck } from "react-icons/fi";
import ReactModal from "react-modal";

interface IssueSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToReports?: () => void;
}

const IssueSuccessModal: React.FC<IssueSuccessModalProps> = ({ isOpen, onClose, onGoToReports }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/40 z-[1100] flex items-center justify-center"
      className="bg-white rounded-2xl shadow-2xl p-8 max-w-[380px] w-full mx-auto flex flex-col items-center outline-none"
      ariaHideApp={false}
    >
      <div className="flex flex-col items-center">
        <div className="bg-yellow-200 rounded-full p-4 mb-4 flex items-center justify-center">
          <FiCheck className="text-yellow-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-semibold text-black text-center mb-2">Your issue has been<br />submitted!</h2>
        <p className="text-gray-700 text-center mb-2">
          Thank you for raising your voice. We’ll review and notify you as soon as the issue is verified.
        </p>
        <p className="text-gray-500 text-center mb-6">
          You can track the status under My Reports
        </p>
        <button
          className="w-full py-3 rounded-full bg-black text-white text-lg font-semibold shadow-md hover:bg-gray-900 transition"
          onClick={onGoToReports || onClose}
        >
          Go to My Reports
        </button>
      </div>
    </ReactModal>
  );
};

export default IssueSuccessModal;
