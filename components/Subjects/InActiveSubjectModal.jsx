import React from "react";
import CustomModal from "../layout/Modal";
import { AlertTriangle, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetAllModules,
  handleSofttDeletModule,
} from "../../features/modulesSlice";
import { toast } from "react-toastify";
import { Modal } from "antd";

const InActiveSubjectModal = ({ selectedSubject, setSelectedSubject }) => {
  const dispatch = useDispatch();
  const {soft_module_loading } = useSelector(state => state?.modules);

  const handleDeactivateSubject = () => {
    if (!selectedSubject?.id) {
      toast.error("No module selected");
      return;
    }

    dispatch(handleSofttDeletModule({ id: selectedSubject.id }))
      .unwrap()
      .then((res) => {
        if (res?.status === "success") {
          toast.success(res?.message);
          dispatch(handleGetAllModules({ page: 1, limit: 10 })); // Add pagination params
          setSelectedSubject(null);
        } else {
          toast.error(res?.message || "Failed to deactivate module");
        }
      })
      .catch((error) => {
        console.error("Deactivation error:", error);
        toast.error(
          error?.response?.data?.message || "Failed to deactivate module"
        );
        setSelectedSubject(null);
      });
  };

  const handleClose = () => {
    setSelectedSubject(null);
  };

  // Return null if no subject is selected
  if (!selectedSubject) return null;

  return (
    <Modal
      open={!!selectedSubject} // Use 'open' instead of 'isOpen'
      onCancel={handleClose} // Use onCancel for Antd Modal
      title="Deactivate module"
      width={500} // Use 'width' instead of 'size'
      footer={[
        // Proper footer for Antd Modal
        <button
          key="cancel"
          onClick={handleClose}
          className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>,
        <button
          key="deactivate"
          onClick={handleDeactivateSubject}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <EyeOff className="w-4 h-4" />
          {soft_module_loading ? "loading..." : "Deactivate module"}
        </button>,
      ]}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-orange-900">Deactivate Module</h4>
            <p className="text-sm text-orange-700">
              This module will be marked as inactive and hidden from students.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            Module to be deactivated:
          </p>
          <p className="font-medium text-[#202938]">{selectedSubject?.name}</p>
          <p className="text-slate-400">{selectedSubject?.code}</p>
        </div>
      </div>
    </Modal>
  );
};

export default InActiveSubjectModal;
