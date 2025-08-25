import React, {useEffect, useState} from "react";
import {getPlans, createPlan, updatePlan, deletePlan} from "../../service/planService";
import {motion, AnimatePresence} from "framer-motion";
import toast from "react-hot-toast";
import {PlusCircle, PencilLine, Trash, LayoutGrid, TableProperties} from "lucide-react";
import PlanForm from "./PlanForm";
import DeleteConfirm from "./DeleteConfirm";
import {Star} from "lucide-react";


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
                    return {success: false, fieldErrors: {name: result?.data?.message || "Dữ liệu không hợp lệ"}};
                } else {
                    toast.error("Cập nhật gói thất bại!");
                }
            } else {
                result = await createPlan(payload);
                if (result?.status === 201) {
                    toast.success("Thêm gói mới thành công!");
                } else if (result?.status === 400) {
                    return {success: false, fieldErrors: {name: result?.data?.message || "Dữ liệu không hợp lệ"}};
                } else {
                    toast.error("Thêm gói mới thất bại!");
                }
            }

            if (result?.status === 200 || result?.status === 201) {
                resetForm();
                setShowModal(false);
                setIsEdit(false);
                await fetchPlans();
                return {success: true};
            } else {
                return {success: false};
            }
        } catch (err) {
            console.error("handleFormSubmit error:", err);
            toast.error("Có lỗi xảy ra!");
            return {success: false};
        }
    };

    return (
        <div className="">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600  bg-clip-text text-transparent">
                        Danh sách Gói
                    </h1>
                    <p className="text-gray-600">Tổng quan hệ thống AutoMarketing</p>
                </div>
                <div className="flex items-center space-x-2 gap-2 px-3 py-1 rounded-full ">
                    <button
                        onClick={() => setViewMode("card")}
                        className={`p-2 rounded-2xl transition shadow ${
                            viewMode === "card"
                                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        <LayoutGrid size={18}/>
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-2xl transition shadow ${
                            viewMode === "table"
                                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                        <TableProperties size={18}/>
                    </button>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2"
                    >
                        <PlusCircle size={18}/> Thêm gói
                    </button>

                </div>
            </div>

            {/* Filter + Stats */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm gói..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border rounded-lg w-full md:w-1/3 focus:ring focus:ring-blue-300"
                />
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-gray-100 rounded-lg shadow text-center">
                        <p className="text-sm text-gray-500">Tổng số gói</p>
                        <p className="font-bold">{totalPlans}</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-100 rounded-lg shadow text-center">
                        <p className="text-sm text-blue-700">Gói premium</p>
                        <p className="font-bold text-blue-700">{premiumPlans}</p>
                    </div>
                </div>
            </div>

            {/* Danh sách hiển thị (giữ nguyên) */}
            {viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 flex flex-col divide-y divide-gray-100 transition"
                            whileHover={{scale: 1.01}}
                        >
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                <span
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                                <Star size={12}/> Level {plan.planLevel}
                                </span>
                            </div>
                            <div className="p-4 flex-1">
                                <p className="text-gray-600 mb-3 line-clamp-2">{plan.description}</p>
                                <p className="text-2xl font-bold text-green-600 mb-1">{plan.price?.toLocaleString()} đ</p>
                                <p className="text-sm text-gray-500">{plan.durationDate} ngày</p>
                                <div className="text-xs text-gray-400 mt-1">{plan.maxWorkspace} workspace
                                    • {plan.maxSocialAccount} social
                                </div>
                            </div>

                            <div className="p-4 flex gap-2 border-t">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex-1 px-3 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center gap-1 text-sm"
                                >
                                    <PencilLine size={16}/> Sửa
                                </button>
                                <button
                                    onClick={() => confirmDelete(plan.id)}
                                    className="flex-1 px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-1 text-sm"
                                >
                                    <Trash size={16}/> Xóa
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="min-w-full border-collapse table-fixed">
                        <thead>
                        <tr className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wide font-semibold">
                            <th className="px-3 py-2 text-left rounded-tl-lg">Tên gói</th>
                            <th className="px-3 py-2 text-left">Giá</th>
                            <th className="px-3 py-2">Thời hạn</th>
                            <th className="px-3 py-2">Level</th>
                            <th className="px-3 py-2 ">Workspace</th>
                            <th className="px-3 py-2">Social</th>
                            <th className="px-3 py-2 text-right">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filteredPlans.map((plan, idx) => (
                            <tr key={plan.id}
                                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition`}>
                                <td className="px-3 py-2 font-medium text-left">{plan.name}</td>
                                <td className="px-3 py-2 text-green-600 font-semibold text-left">{plan.price?.toLocaleString()} đ</td>
                                <td className="px-3 py-2 text-center">{plan.durationDate} ngày</td>
                                <td className="px-3 py-2 text-center">Level {plan.planLevel}</td>
                                <td className="px-3 py-2 text-center">{plan.maxWorkspace}</td>
                                <td className="px-3 py-2 text-center">{plan.maxSocialAccount}</td>
                                <td className="px-3 py-2 text-right">
                                    <div className="inline-flex gap-2">
                                        <button
                                            onClick={() => handleEdit(plan)}
                                            className="p-2 border border-indigo-400 text-indigo-500 rounded-md hover:bg-indigo-50 transition"
                                            title="Sửa"
                                        >
                                            <PencilLine size={16}/>
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(plan.id)}
                                            className="p-2 border border-red-400 text-red-500 rounded-md hover:bg-red-50 transition"
                                            title="Xóa"
                                        >
                                            <Trash size={16}/>
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal thêm/sửa (bây giờ dùng PlanForm) */}
            <AnimatePresence>
                {showModal && (
                    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <motion.div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative"
                                    initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}}
                                    exit={{scale: 0.8, opacity: 0}}
                                    transition={{type: "spring", stiffness: 300, damping: 25}}>
                            <h3 className="text-xl font-bold mb-4">{isEdit ? "Cập nhật gói" : "Thêm gói mới"}</h3>

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

            {/* Modal xác nhận xóa (bây giờ dùng DeleteConfirm) */}
            <DeleteConfirm open={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete}/>
        </div>
    );
}
