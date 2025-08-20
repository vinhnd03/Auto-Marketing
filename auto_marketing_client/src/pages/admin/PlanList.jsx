import React, {useEffect, useState} from "react";
import {getPlans, createPlan, updatePlan, deletePlan} from "../../service/planService";
import {motion, AnimatePresence} from "framer-motion";
import toast, {Toaster} from "react-hot-toast";
import {PlusCircle, PencilLine, Trash, LayoutGrid, TableProperties} from "lucide-react";

export default function PlanList() {
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("card"); // "card" hoặc "table"

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
            setPlans(data);
        } catch {
            toast.error("Lỗi khi tải danh sách gói");
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                durationDate: Number(form.durationDate),
                maxWorkspace: Number(form.maxWorkspace),
                maxSocialAccount: Number(form.maxSocialAccount),
                planLevel: Number(form.planLevel),
            };
            if (isEdit) {
                const result = await updatePlan(payload);
                if (result.status === 200) {
                    toast.success("Cập nhật gói thành công!");
                } else {
                    toast.error("Cập nhật gói thất bại!");
                }
            } else {
                const result = await createPlan(payload);
                if (result.status === 201){
                    toast.success("Thêm gói mới thành công!");
                } else {
                    toast.error("Thêm gói mới thất bại!");
                }
            }
            setShowModal(false);
            resetForm();
            fetchPlans();
        } catch {
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleEdit = (plan) => {
        setIsEdit(true);
        setForm(plan);
        setShowModal(true);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
          const result =  await deletePlan(deleteId);
          if(result.status === 204 || result.status === 200){
              toast.success("Xóa gói thành công!");
          }else {
              toast.error("Xóa gói thất bại!");
          }
            setShowDeleteModal(false);
            fetchPlans();
        } catch {
            toast.error("Xóa thất bại!");
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

    return (
        <div className="space-y-6">
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
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-2xl shadow hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2"
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

            {/* Danh sách hiển thị */}
            {viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col"
                            whileHover={{scale: 1.02}}
                        >
                            {/* Header */}
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                <span
                                    className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">Level {plan.planLevel}</span>
                            </div>

                            {/* Body */}
                            <div className="p-4 flex-1">
                                <p className="text-gray-600 mb-3 line-clamp-2">{plan.description}</p>
                                <p className="text-2xl font-bold text-green-600 mb-1">
                                    {plan.price?.toLocaleString()} đ
                                </p>
                                <p className="text-sm text-gray-500">{plan.durationDate} ngày</p>
                                <div className="text-xs text-gray-400 mt-1">
                                    {plan.maxWorkspace} workspace • {plan.maxSocialAccount} social
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 flex gap-2 border-t">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center justify-center gap-1"
                                >
                                    <PencilLine size={14}/> Sửa
                                </button>
                                <button
                                    onClick={() => confirmDelete(plan.id)}
                                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-1"
                                >
                                    <Trash size={14}/> Xóa
                                </button>
                            </div>
                        </motion.div>

                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="min-w-full border-collapse table-fixed">
                        <thead>
                        <tr className="bg-indigo-600 text-white text-center">
                            <th className="px-4 py-3 text-left rounded-tl-lg">Tên gói</th>
                            <th className="px-4 py-3 text-left">Giá</th>
                            <th className="px-4 py-3">Thời hạn</th>
                            <th className="px-4 py-3">Level</th>
                            <th className="px-4 py-3 w-24">Workspace</th>
                            <th className="px-4 py-3 w-24">Social</th>
                            <th className="px-4 py-3 w-32">Hành động</th>

                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {filteredPlans.map((plan, idx) => (
                            <tr
                                key={plan.id}
                                className={`${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-gray-100 transition`}
                            >
                                <td className="px-4 py-3 font-medium text-left">{plan.name}</td>
                                <td className="px-4 py-3 text-green-600 font-semibold text-left">
                                    {plan.price?.toLocaleString()} đ
                                </td>
                                <td className="px-4 py-3">{plan.durationDate} ngày</td>
                                <td className="px-4 py-3">Level {plan.planLevel}</td>
                                <td className="px-4 py-3">{plan.maxWorkspace}</td>
                                <td className="px-4 py-3">{plan.maxSocialAccount}</td>
                                <td className="px-4 py-3">
                                    <div className="inline-flex gap-2">
                                        <button
                                            onClick={() => handleEdit(plan)}
                                            className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-1">
                                            <PencilLine size={14}/> Sửa
                                        </button>
                                        <button onClick={() => confirmDelete(plan.id)}
                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1">
                                            <Trash size={14}/> Xóa
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal thêm/sửa */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                            transition={{type: "spring", stiffness: 300, damping: 25}}
                        >
                            <h3 className="text-xl font-bold mb-4">
                                {isEdit ? "Cập nhật gói" : "Thêm gói mới"}
                            </h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                                <input type="hidden" name="id" value={form.id || ""}/>
                                <div>
                                    <label className="block text-sm font-medium">Tên gói</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Giá</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Thời hạn (ngày)</label>
                                    <input
                                        type="number"
                                        name="durationDate"
                                        value={form.durationDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Cấp độ gói</label>
                                    <input
                                        type="number"
                                        name="planLevel"
                                        value={form.planLevel}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Số Workspace tối đa</label>
                                    <input
                                        type="number"
                                        name="maxWorkspace"
                                        value={form.maxWorkspace}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Số Social Account tối đa</label>
                                    <input
                                        type="number"
                                        name="maxSocialAccount"
                                        value={form.maxSocialAccount}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium">Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full h-24"
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400 transition"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                    >
                                        {isEdit ? "Cập nhật" : "Lưu"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal xác nhận xóa */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.8, opacity: 0}}
                        >
                            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                            <p className="mb-6 text-gray-600">Bạn có chắc chắn muốn xóa gói này?</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Xóa
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
