import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isoWeek from "dayjs/plugin/isoWeek";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import { createSchedule } from "../../service/publish/scheduleManagerService";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import campaignService from "../../service/campaignService";
import { getTopicsByCampaignId } from "../../service/topicService";
import { getPostsByFilter } from "../../service/postService";
dayjs.locale("vi");
dayjs.extend(isoWeek);
const hours = Array.from({ length: 24 }, (_, i) => i);
export default function SchedulePostCalendar() {
  const { user } = useAuth();
  const { workspaceId } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [availableContents, setAvailableContents] = useState([]);
  const [userPages, setUserPages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [weekStart, setWeekStart] = useState(dayjs().startOf("isoWeek"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [minute, setMinute] = useState("00");
  const [selectedContentId, setSelectedContentId] = useState("");
  const [selectedFanpageIds, setSelectedFanpageIds] = useState([]);
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    weekStart.add(i, "day")
  );
  const now = dayjs();
  // --- Load Campaigns theo workspace ---
  useEffect(() => {
    if (workspaceId) {
      campaignService
        .findCampaignByWorkspaceId(workspaceId)
        .then(setCampaigns)
        .catch((err) => toast.error("Lỗi tải campaigns: " + err.message));
    }
  }, [workspaceId]);
  // --- Load Topics khi chọn campaign ---
  useEffect(() => {
    if (selectedCampaign) {
      getTopicsByCampaignId(selectedCampaign)
        .then((data) => {
          setTopics(Array.isArray(data) ? data : []);
        })
        .catch((err) => toast.error("Lỗi tải topics: " + err.message));
    } else {
      setTopics([]);
      setSelectedTopic("");
    }
  }, [selectedCampaign]);
  // --- Load Posts khi chọn campaign/topic ---
  useEffect(() => {
    if (!workspaceId || !selectedCampaign || !selectedTopic) {
      setAvailableContents([]);
      return;
    }
    getPostsByFilter(workspaceId, selectedCampaign, selectedTopic)
      .then((data) => {
        const array = Array.isArray(data) ? data : [];
        setAvailableContents(array.map((p) => ({ ...p, id: p.id.toString() })));
      })
      .catch((err) => toast.error("Lỗi tải bài viết: " + err.message));
  }, [workspaceId, selectedCampaign, selectedTopic]);
  // --- Load Fanpages ---
  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:8080/api/fanpages?userId=${user.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setUserPages(data);
      })
      .catch((err) => toast.error("Lỗi tải fanpage: " + err.message));
  }, [user]);
  // ✅ Hàm check giờ còn phút hợp lệ không
  const isHourAvailable = (day, hour) => {
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    return minutes.some((m) =>
      day.hour(hour).minute(m).isAfter(now.add(5, "minute"))
    );
  };
  const openScheduleModal = (day, hour) => {
    if (!isHourAvailable(day, hour)) {
      toast.error("Giờ này không còn phút hợp lệ để đặt lịch");
      return;
    }
    setSelectedTime(day.hour(hour).minute(0).second(0));
    setMinute("00");
    setSelectedContentId("");
    setSelectedFanpageIds([]);
    setIsModalOpen(true);
  };
  // ✅ Lọc phút hợp lệ
  const getAvailableMinutes = (time) => {
    if (!time) return [];
    return Array.from({ length: 12 }, (_, i) => i * 5)
      .filter((m) => time.minute(m).isAfter(now.add(5, "minute")))
      .map((m) => m.toString().padStart(2, "0"));
  };
  const savePost = async () => {
    if (!selectedContentId) {
      toast.error("Vui lòng chọn nội dung bài viết");
      return;
    }
    if (!selectedFanpageIds.length) {
      toast.error("Vui lòng chọn ít nhất 1 fanpage để đăng");
      return;
    }
    const chosenContent = availableContents.find(
      (c) => c.id.toString() === selectedContentId
    );
    if (!chosenContent) {
      toast.error("Bài viết chưa hợp lệ hoặc đã bị xóa");
      return;
    }
    const time = selectedTime.minute(parseInt(minute, 10));
    if (time.isBefore(now.add(5, "minute"))) {
      toast.error("Không thể đặt lịch trong quá khứ hoặc sớm hơn 5 phút hiện tại");
      return;
    }
    const payload = {
      workspaceId,
      postId: chosenContent.id,
      title: chosenContent.title,
      content: chosenContent.content,
      hashtag: chosenContent.hashtag || "",
      tone: chosenContent.tone || "",
      contentType: chosenContent.contentType || "TEXT",
      targetAudience: chosenContent.targetAudience || 1,
      medias: [],
      fanpageIds: selectedFanpageIds.map((id) => parseInt(id)),
      scheduledTime: time.format("YYYY-MM-DDTHH:mm:ss"),
    };
    try {
      await createSchedule(payload);
      await fetchSchedules(workspaceId);
      setIsModalOpen(false);
      toast.success("Đặt lịch thành công!");
    } catch (err) {
      console.error(err);
      toast.error(
        "Đặt lịch thất bại: " + (err.response?.data?.message || err.message)
      );
    }
  };
  const fetchSchedules = async (wid) => {
    if (!wid) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/schedules/published?workspaceId=${wid}`,
        { withCredentials: true }
      );
      const dataArray = Array.isArray(res.data) ? res.data : [];
      const loadedPosts = dataArray.map((p) => ({
        id: p.id,
        title: p.post?.title || p.post?.content || "Không có tiêu đề",
        content: p.post?.content,
        hashtag: p.post?.hashtag || "",
        medias: p.post?.medias || [],
        time: p.scheduledTime ? dayjs(p.scheduledTime) : null,
        fanpageIds: p.fanpageIds || [],
        status: p.status,
      }));
      setPosts(loadedPosts);
    } catch (err) {
      toast.error("Lỗi tải lịch: " + err.message);
    }
  };
  useEffect(() => {
    if (workspaceId) {
      fetchSchedules(workspaceId);
    }
  }, [workspaceId]);
  const renderPosts = (day, hour) => {
    const postsAtTime = posts.filter(
      (p) =>
        p.time &&
        p.time.isValid() &&
        p.time.hour() === hour &&
        p.time.isSame(day, "day")
    );
    return postsAtTime.map((post, idx) => (
      <div
        key={idx}
        className="bg-blue-50 border-l-4 border-blue-500 p-1 mt-1 rounded overflow-hidden"
      >
        <p className="text-xs font-medium">{post.time.format("HH:mm")}</p>
        <p className="text-xs text-gray-600 truncate">{post.title}</p>
      </div>
    ));
  };
  return (
    <div className="p-4">
      {/* Thanh điều hướng tuần */}
      <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
        <button
          onClick={() => setWeekStart((prev) => prev.subtract(7, "day"))}
          className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          ←
        </button>
        <p className="text-sm font-semibold">
          {daysOfWeek[0].format("DD/MM")} – {daysOfWeek[6].format("DD/MM")}
        </p>
        <button
          onClick={() => setWeekStart((prev) => prev.add(7, "day"))}
          className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          →
        </button>
      </div>
      {/* Bảng lịch */}
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[700px]"
          style={{ gridTemplateColumns: "80px repeat(7, minmax(0, 1fr))" }}
        >
          <div></div>
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className={`text-center py-2 font-medium text-sm truncate ${
                day.isSame(dayjs(), "day") ? "text-purple-600" : ""
              }`}
            >
              {day.format("dddd DD/MM")}
            </div>
          ))}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="text-sm text-right pr-2 py-2 border-t border-gray-200">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {daysOfWeek.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-1 border-t border-l border-gray-200 cursor-pointer hover:bg-gray-50 relative flex flex-col max-h-32 overflow-y-auto ${
                    isHourAvailable(day, hour)
                      ? "bg-white"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                  onClick={() => openScheduleModal(day, hour)}
                >
                  {renderPosts(day, hour)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Modal chọn nội dung */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Chọn nội dung để đăng
            </Dialog.Title>
            {/* Chọn Campaign */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Chọn Campaign</label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
              >
                <option value="">-- Chọn Campaign --</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Chọn Topic */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Chọn Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={`border rounded px-2 py-1 text-sm w-full ${
                  !selectedCampaign ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={!selectedCampaign}
              >
                <option value="">-- Chọn topic --</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Chọn Post */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Chọn bài viết</label>
              <select
                value={selectedContentId}
                onChange={(e) => setSelectedContentId(e.target.value)}
                className={`border rounded px-2 py-1 text-sm w-full ${
                  !selectedTopic ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={!selectedTopic}
              >
                <option value="">-- Chọn bài viết --</option>
                {availableContents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            {/* Thời gian */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Thời gian</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedTime ? selectedTime.format("dddd DD/MM HH") : ""}
                  className="border rounded px-2 py-1 text-sm w-full"
                />
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {getAvailableMinutes(selectedTime).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Chọn fanpage */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Chọn fanpage</label>
              <div className="flex flex-col max-h-40 overflow-y-auto border rounded px-2 py-1">
                {userPages.map((fp) => (
                  <label key={fp.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      value={fp.id}
                      checked={selectedFanpageIds.includes(fp.id.toString())}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedFanpageIds((prev) =>
                          prev.includes(value)
                            ? prev.filter((id) => id !== value)
                            : [...prev, value]
                        );
                      }}
                    />
                    <span>{fp.pageName}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={savePost}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}