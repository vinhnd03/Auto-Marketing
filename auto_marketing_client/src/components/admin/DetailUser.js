import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {findById} from "../../service/admin/usersService";

const DetailUserComponent = () => {
    const {id} = useParams();
    const [users, setUsers] = useState({
        id: '',
        name: '',
        email: '',
        createDate: '',
        status: false,
        provider: ''
    });
    useEffect(() => {
        const fetchData = async () => {
            let u = await findById(id)
            setUsers(u);
            console.log(users)
        }
        fetchData()
    }, [])

    return (
        <div className="container mx-auto p-4 bg-gray- min-h-screen">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-blue-50 p-4 rounded-lg shadow-md">
                <p className="text-3xl font-bold">Chi tiết khách hàng</p>
            </div>
            {/* Thông tin người dùng */}

            <div className="space-y-4 text-lg">
                <div className="flex">
                    <p className="font-semibold w-48">ID người dùng:</p>
                    <p>{users.id}</p>
                </div>

                <div className="flex">
                    <p className="font-semibold w-48">Tên người dùng:</p>
                    <p>{users.name}</p>
                </div>

                <div className="flex">
                    <p className="font-semibold w-48">Email:</p>
                    <p>{users.email}</p>
                </div>

                <div className="flex">
                    <p className="font-semibold w-48">Ngày tạo tài khoản:</p>
                    <p>{users.createDate}</p>
                </div>

                <div className="flex">
                    <p className="font-semibold w-48">Trạng thái tài khoản:</p>
                    <p className={users.status ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {users.status ? "Đang hoạt động" : "Đang bị khóa"}
                    </p>
                </div>

                <div className="flex">
                    {/* Gói dịch vụ */}
                    <p className="font-semibold w-48">Gói dịch vụ đã mua:</p>
                    <div>
                        {users.subscriptions && users.subscriptions.length > 0 ? (
                            <div>
                                {users.subscriptions.map((sub, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4 border border-gray-200"
                                    >
                                        <p>
                                            <span className="font-semibold">Gói dịch vụ:</span> {sub.planId?.name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Ngày mua:</span> {sub.startDate}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Ngày hết hạn:</span> {sub.endDate}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p >Chưa mua gói nào</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );


}
export default DetailUserComponent;