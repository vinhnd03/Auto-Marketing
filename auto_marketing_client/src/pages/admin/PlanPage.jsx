import React, { useEffect, useState } from "react";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../service/planService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  PlusCircle,
  PencilLine,
  Trash,
  LayoutGrid,
  TableProperties,
  Search,
} from "lucide-react";
import PlanForm from "./PlanForm";
import DeleteConfirm from "./DeleteConfirm";
import { Star } from "lucide-react";

export default function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    durationDate: "",
    description: "",
    maxWorkspace: "",
    maxSocialAccount: "",
    planLevel: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [plans, search]);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data || []);
    } catch {
      toast.error("Lỗi khi tải danh sách gói");
    }
  };

  const handleEdit = (plan) => {
    setIsEdit(true);
    setForm({
      id: plan.id ?? null,
      name: plan.name ?? "",
      price: plan.price ?? "",
      durationDate: plan.durationDate ?? "",
      description: plan.description ?? "",
      maxWorkspace: plan.maxWorkspace ?? "",
      maxSocialAccount: plan.maxSocialAccount ?? "",
      planLevel: plan.planLevel ?? "",
    });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true); // bật loading
      const result = await deletePlan(deleteId);
      if (result?.status === 204 || result?.status === 200) {
        toast.success("Xóa gói thành công!");
        fetchPlans();
      } else {
        toast.error("Xóa gói thất bại!");
      }
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setLoading(false); // tắt loading
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setIsEdit(false);
    setForm({
      id: null,
      name: "",
      price: "",
      durationDate: "",
      description: "",
      maxWorkspace: "",
      maxSocialAccount: "",
      planLevel: "",
    });
  };

  const handleFilter = () => {
    const result = plans.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPlans(result);
  };

  const totalPlans = plans.length;
  const premiumPlans = plans.filter((p) => p.planLevel > 1).length;

  // onSubmit handler passed to PlanForm
  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        durationDate: Number(values.durationDate),
        maxWorkspace: Number(values.maxWorkspace),
        maxSocialAccount: Number(values.maxSocialAccount),
        planLevel: Number(values.planLevel),
      };

      let result;
      if (isEdit) {
        result = await updatePlan(payload);
        if (result?.status === 200) {
          toast.success("Cập nhật gói thành công!");
        } else if (result?.status === 400) {
          // example: server returns validation message
          return {
            success: false,
            fieldErrors: {
              name: result?.data?.message || "Dữ liệu không hợp lệ",
            },
          };
        } else {
          toast.error("Cập nhật gói thất bại!");
        }
      } else {
        result = await createPlan(payload);
        if (result?.status === 201) {
          toast.success("Thêm gói mới thành công!");
        } else if (result?.status === 400) {
          return {
            success: false,
            fieldErrors: {
              name: result?.data?.message || "Dữ liệu không hợp lệ",
            },
          };
        } else {
          toast.error("Thêm gói mới thất bại!");
        }
      }

      if (result?.status === 200 || result?.status === 201) {
        resetForm();
        setShowModal(false);
        setIsEdit(false);
        await fetchPlans();
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (err) {
      console.error("handleFormSubmit error:", err);
      toast.error("Có lỗi xảy ra!");
      return { success: false };
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              Danh sách Gói
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Tổng quan hệ thống AutoMarketing
            </p>
          </div>
          <div className="flex items-center space-x-2 gap-2 px-3 py-1 rounded-full">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-2xl transition shadow ${
                viewMode === "card"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-2xl transition shadow ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <TableProperties size={18} />
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2 text-sm sm:text-base"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Thêm gói</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>

        {/* Filter + Stats */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm gói..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex gap-3 sm:gap-4">
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-lg shadow text-center flex-1 sm:flex-none">
              <p className="text-xs sm:text-sm text-gray-500">Tổng số gói</p>
              <p className="font-bold text-sm sm:text-base">{totalPlans}</p>
            </div>
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-100 rounded-lg shadow text-center flex-1 sm:flex-none">
              <p className="text-xs sm:text-sm text-blue-700">Gói premium</p>
              <p className="font-bold text-blue-700 text-sm sm:text-base">
                {premiumPlans}
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách hiển thị */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md border border-gray-200 flex flex-col divide-y divide-gray-100 transition"
                whileHover={{ scale: 1.01 }}
              >
                <div className="p-3 sm:p-4 border-b flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold truncate flex-1 mr-2">
                    {plan.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex-shrink-0">
                    <Star size={12} /> Level {plan.planLevel}
                  </span>
                </div>
                <div className="p-3 sm:p-4 flex-1">
                  <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base">
                    {plan.description}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                    {plan.price?.toLocaleString()} đ
                  </p>
                  <p className="text-sm text-gray-500">
                    {plan.durationDate} ngày
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    {plan.maxWorkspace} workspace • {plan.maxSocialAccount}{" "}
                    social
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex gap-2 border-t">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="flex-1 px-2 sm:px-3 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center gap-1 text-xs sm:text-sm"
                  >
                    <PencilLine size={16} />
                    <span className="hidden sm:inline">Sửa</span>
                    <span className="sm:hidden">Sửa</span>
                  </button>
                  <button
                    onClick={() => confirmDelete(plan.id)}
                    className="flex-1 px-2 sm:px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-1 text-xs sm:text-sm"
                  >
                    <Trash size={16} />
                    <span className="hidden sm:inline">Xóa</span>
                    <span className="sm:hidden">Xóa</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="min-w-[800px] sm:min-w-[900px] lg:min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wide font-semibold">
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left rounded-tl-lg w-[20%]">
                    Tên gói
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-left w-[15%]">
                    Giá
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-center w-[12%]">
                    Thời hạn
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-center w-[10%]">
                    Level
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-center w-[12%]">
                    Workspace
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-center w-[12%]">
                    Social
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-right w-[19%]">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPlans.map((plan, idx) => (
                  <tr
                    key={plan.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-50 transition`}
                  >
                    <td className="px-2 sm:px-3 py-2 sm:py-3 font-medium text-left text-sm">
                      <div
                        className="truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[250px]"
                        title={plan.name}
                      >
                        {plan.name}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-green-600 font-semibold text-left text-sm">
                      <div
                        className="truncate max-w-[100px] sm:max-w-[120px]"
                        title={`${plan.price?.toLocaleString()} đ`}
                      >
                        {plan.price?.toLocaleString()} đ
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-center text-sm">
                      <div
                        className="truncate max-w-[80px] sm:max-w-[100px]"
                        title={`${plan.durationDate} ngày`}
                      >
                        {plan.durationDate} ngày
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-center text-sm">
                      <div
                        className="truncate max-w-[60px] sm:max-w-[80px]"
                        title={`Level ${plan.planLevel}`}
                      >
                        Level {plan.planLevel}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-center text-sm">
                      <div
                        className="truncate max-w-[80px] sm:max-w-[100px]"
                        title={plan.maxWorkspace}
                      >
                        {plan.maxWorkspace}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-center text-sm">
                      <div
                        className="truncate max-w-[80px] sm:max-w-[100px]"
                        title={plan.maxSocialAccount}
                      >
                        {plan.maxSocialAccount}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-right">
                      <div className="inline-flex gap-1 sm:gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-1.5 sm:p-2 border border-indigo-400 text-indigo-500 rounded-md hover:bg-indigo-50 transition flex-shrink-0"
                          title="Sửa"
                        >
                          <PencilLine size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(plan.id)}
                          className="p-1.5 sm:p-2 border border-red-400 text-red-500 rounded-md hover:bg-red-50 transition flex-shrink-0"
                          title="Xóa"
                        >
                          <Trash size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal thêm/sửa */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                {isEdit ? "Cập nhật gói" : "Thêm gói mới"}
              </h3>

              <PlanForm
                initialValues={form}
                onCancel={() => setShowModal(false)}
                onSubmit={handleFormSubmit}
                submitLabel={isEdit ? "Cập nhật" : "Lưu"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal xác nhận xóa */}
      <DeleteConfirm
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
