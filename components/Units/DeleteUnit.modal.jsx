import React from "react";
import CustomModal from "../layout/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleDeleteUnit } from "../../features/unitsSlice";
import { toast } from "react-toastify";
import { handleGetModuleUnits } from "../../features/modulesSlice";

const DeleteUnitModal = ({ open, setOpne, module_id , data}) => {
  const dispatch = useDispatch();
  const {delete_unit_loading} = useSelector(state => state?.units)
  console.log(data);
   
  function handleDelete() {
    dispatch(handleDeleteUnit({id : module_id , unitId : data?.id}))
    .unwrap()
    .then(res => {
      if(res?.status == "success") {
         toast.success(res?.message);
         dispatch(handleGetModuleUnits({id : module_id}))
         setOpne(false)
      }else {
        toast.error(res)
      }
    }).catch(e => console.log(e))
    .finally(() => setOpne(false))
  }
  return (
    <CustomModal
      isOpen={open}
      onClose={() => setOpne(null)}
      title="Delete Unit"
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
          <p className="text-sm text-gray-600 mb-2">Unit to be deleted:</p>
          <p className="font-medium text-[#202938]">{data?.name}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setOpne(null)}
            className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
           {delete_unit_loading ? "loading..." : "Delete Unit"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteUnitModal;
