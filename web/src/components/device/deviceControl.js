import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import {
  useGetDeviceByIdWithLogQuery,
  useUpdateDeviceDataMutation,
} from "./deviceService.js";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./DeviceControl.css"; // Import file CSS nếu cần cho các kiểu khác
import { FaChartLine, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { subDays, isAfter, parse } from "date-fns";

Chart.register(...registerables);

// Plugin tùy chỉnh để thêm bóng đổ
const shadowPlugin = {
  id: "shadowPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  },
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.restore();
  },
};

Chart.register(shadowPlugin);

// Hàm chuyển đổi định dạng ngày
const parseDate = (dateString) => {
  return parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());
};

const filterDataByTimeRange = (data, timeRange) => {
  const now = new Date();
  let startTime;

  switch (timeRange) {
    case "1week":
      startTime = subDays(now, 7);
      break;
    case "1month":
      startTime = subDays(now, 30);
      break;
    case "all":
    default:
      //console.log(`Returning all data:`, data);
      return data;
  }

  const filteredData = {};
  Object.keys(data).forEach((key) => {
    const dateKey = parseDate(key);
    if (isNaN(dateKey.getTime())) {
      console.warn(`Invalid Date: ${key}`);
      return; // Bỏ qua giá trị ngày không hợp lệ
    }
    if (isAfter(dateKey, startTime)) {
      filteredData[key] = data[key];
    }
  });

  console.log(`Filtered data for time range "${timeRange}":`, filteredData);

  return filteredData;
};

export const DeviceControl = () => {
  const { garden_id, room_id, device_id } = useParams();
  const {
    data: device_info,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetDeviceByIdWithLogQuery(device_id);

  const [updateDevice] = useUpdateDeviceDataMutation();
  const [updateData, setUpdateData] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const [timeRange, setTimeRange] = useState("all");
  const [currentData, setCurrentData] = useState(null);
  const [stats, setStats] = useState({ avg: 0, min: 0, max: 0 });
  const [filteredData, setFilteredData] = useState({});
  const [formType, setFormType] = useState(null); // Define formType state

  const onUpdateDataChange = (e) => setUpdateData(e.target.value);

  const canSave = !isLoading;

  const sensorList = [
    "temp-sensor",
    "humid-sensor",
    "light-sensor",
    "movement-sensor",
  ];

  const onSaveClicked = async () => {
    if (canSave) {
      try {
        await updateDevice({ device_id: device_id, data: updateData });
        setUpdateData(0);
      } catch (err) {
        alert(err);
      }
    }
  };

  const calculateStats = (values) => {
    const nums = Object.values(values).map((value) => parseFloat(value));
    const avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2);
    const min = Math.min(...nums).toFixed(2);
    const max = Math.max(...nums).toFixed(2);
    return { avg, min, max };
  };

  // Lọc dữ liệu khi `device_info` hoặc `timeRange` thay đổi
  useEffect(() => {
    if (isSuccess) {
      let log_list = {};
      if (sensorList.includes(device_info.data[0].type)) {
        setCurrentData(device_info.data[0].curr_value);
        log_list = device_info.data[0].values;
      } else {
        setCurrentData(device_info.data[0].curr_state);
        log_list = device_info.data[0].state_time;
      }

      const filtered = filterDataByTimeRange(log_list, timeRange);
      setFilteredData(filtered);
      setStats(calculateStats(filtered));
    }
  }, [device_info, isSuccess, timeRange]);

  // Cập nhật formType khi `device_info` hoặc `updateData` thay đổi
  useEffect(() => {
    if (isSuccess) {
      if (sensorList.includes(device_info.data[0].type)) {
        setFormType(
          <div className="d-flex">
            <div className="col-auto mb-3 addGarden">
              <div>
                <label
                  htmlFor="updateData"
                  className="form-label addGardenLabel fw-semibold"
                >
                  Giá trị mới
                </label>
                <input
                  type="text"
                  className="form-control addGardenInput border-2 border-success ps-4"
                  id="updateData"
                  name="updateData"
                  value={updateData}
                  onChange={onUpdateDataChange}
                />
              </div>
            </div>
            <div className="col-auto addGardenButton">
              <button className="btn btn-success" onClick={onSaveClicked}>
                Thay đổi
              </button>
            </div>
          </div>
        );
      } else {
        setFormType(
          <div className="d-flex">
            <div className="col-auto mb-3 addGarden">
              <div>
                <label htmlFor="updateData" className="form-label fw-semibold addGardenLabel">
                  Trạng thái mới
                </label>
                <select
                  className="form-select addGardenInput border-2 border-success ps-4"
                  id="updateData"
                  name="updateData"
                  value={updateData}
                  onChange={onUpdateDataChange}
                >
                  <option value="0">Tắt</option>
                  <option value="1">Bật</option>
                </select>
              </div>
            </div>
            <div className="col-auto addGardenButton m-0">
              <button className="btn btn-success" onClick={onSaveClicked}>
                Thay đổi
              </button>
            </div>
          </div>
        );
      }
    }
  }, [device_info, isSuccess, updateData]);

  return (
    <div className="container-md px-4">
      <h2>Chi tiết thiết bị</h2>
      <div className="d-flex justify-content-between">
        <div className="border border-2 rounded-4 shadow pt-2 pb-1 px-5 deviceStatus">
          <div className="row">
            <div className="col p-0">
              <h5 className="m-0">
                Trạng thái hiện tại:{" "}
                <span className="text-success fw-bold">{currentData}</span>
              </h5>
            </div>
          </div>
          {formType}
        </div>

        <div className="border border-2 rounded-4 shadow pt-2 pb-1 px-5 timeFilter">
          {isSuccess && (
            <div className="row">
              <h5 className="m-0">Lọc theo thời gian</h5>
              <div className="d-flex justify-content-between">
                <div className="addGarden">
                  <label className="form-label addGardenLabel fw-semibold">
                    Khoảng thời gian
                  </label>
                  <select
                    className="form-select addGardenInput border-2 border-success ps-4"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="1week">1 tuần gần nhất</option>
                    <option value="1month">1 tháng gần nhất</option>
                  </select>
                </div>
                <div className="addGardenButton">
                  <button
                    className="btn btn-success"
                    onClick={() => setShowChart(!showChart)}
                  >
                    {showChart ? "Ẩn biểu đồ" : "Xem biểu đồ"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showChart ? (
        <>
          <div className="row stats mt-3">
            <div className="col stat-box">
              <FaChartLine className="icon" />
              <h6>Giá trị trung bình</h6>
              <p>{stats.avg}</p>
            </div>
            <div className="col stat-box">
              <FaArrowDown className="icon" />
              <h6>Giá trị nhỏ nhất</h6>
              <p>{stats.min}</p>
            </div>
            <div className="col stat-box">
              <FaArrowUp className="icon" />
              <h6>Giá trị lớn nhất</h6>
              <p>{stats.max}</p>
            </div>
          </div>
          <div className="chart-container">
            <Line
              data={{
                labels: Object.keys(filteredData),
                datasets: [
                  {
                    label: "Giá trị cập nhật",
                    data: Object.values(filteredData),
                    fill: true,
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </>
      ) : (
        <div className="row stats mt-3">
          <div className="border border-2 rounded-4 shadow pt-2 pb-3 px-5">
            <div className="d-flex justify-content-between">
              <h3 className="m-0 text-success">Lịch sử thay đổi</h3>
              <div className="col-auto">
                <button className="btn btn-success" onClick={refetch}>
                  Làm mới lịch sử
                </button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Thời điểm cập nhật</th>
                  <th scope="col">Giá trị cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(filteredData).map((k) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{filteredData[k]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
