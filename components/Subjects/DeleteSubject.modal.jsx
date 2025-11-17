import React from "react";
import CustomModal from "../layout/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { handleGetAllModules, handlePermanentDeletModule } from "../../features/modulesSlice";
import { toast } from "react-toastify";

const DeleteSubjectModal = ({ selectedSubject, setSelectedSubject }) => {
  const dispatch = useDispatch();

  function handleDeleteSubject() {
    dispatch(handlePermanentDeletModule({ id: selectedSubject?.id }))
      .unwrap()
      .then((res) => {
        if(res?.status == "success") {
        console.log(res);
        toast.success(res?.message);
        dispatch(handleGetAllModules())
        setSelectedSubject(false); 
        }else{
          toast.error(res)
        }// Close the modal after successful deletion
      })
      .catch((error) => {
        console.error(error);
        setSelectedSubject(false); // Close the modal in case of error
      });
  }
  return (
    <CustomModal
      isOpen={selectedSubject}
      onClose={() => setSelectedSubject(null)}
      title="Delete Module"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">Are you sure?</h4>
            <p className="text-sm text-red-700">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Module to be deleted:</p>
          <p className="font-medium text-[#202938]">{selectedSubject?.name}</p>
          <p className="text-slate-400">{selectedSubject?.code}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setSelectedSubject(null)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteSubject()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Module
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteSubjectModal;
