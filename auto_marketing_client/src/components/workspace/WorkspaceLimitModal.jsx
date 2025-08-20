import React from "react";

const WorkspaceLimitModal = ({
                                 workspaces,
                                 selectedIds,
                                 onChange,
                                 onSave,
                                 maxWorkspace,
                             }) => {
    const handleToggle = (id) => {
        if (selectedIds.includes(id)) {
            // Bỏ chọn
            onChange(selectedIds.filter(item => item !== id));
        } else {
            // Thêm chọn
            onChange([...selectedIds, id]);
        }
    };

    // Nút Lưu enable nếu số workspace chọn <= maxWorkspace
    const isSaveEnabled = selectedIds.length <= maxWorkspace && selectedIds.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                    Chọn workspace muốn giữ ACTIVE
                </h2>
                <p className="text-gray-600 mb-4">
                    Bạn chỉ được giữ tối đa {maxWorkspace} workspace ở trạng thái ACTIVE.
                    <br/>
                    <span className="text-sm text-gray-500">
                        Đã chọn: {selectedIds.length}/{maxWorkspace}
                    </span>
                </p>

                <div className="max-h-60 overflow-y-auto border p-2 rounded">
                    {workspaces.map(ws => (
                        <label
                            key={ws.id}
                            className="flex items-center space-x-2 mb-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(ws.id)}
                                onChange={() => handleToggle(ws.id)}
                            />
                            <span>{ws.name}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onSave}
                        disabled={!isSaveEnabled}
                        className={`px-4 py-2 rounded-lg text-white ${
                            !isSaveEnabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};
export default WorkspaceLimitModal;
