import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import classnames from "classnames";
import {
  useAddNewRoomMutation,
  useDeleteRoomMutation,
  useGetRoomByGardenIdQuery,
} from "./gardenService";

export const GardenRoomList = () => {
  const { garden_id } = useParams();
  const {
    data: room_list,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetRoomByGardenIdQuery(garden_id);

  let content = null;
  const [deleteRoom] = useDeleteRoomMutation();
  const [addRoom] = useAddNewRoomMutation();

  const [roomName, setRoomName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const onRoomNameChange = (e) => setRoomName(e.target.value);

  const onSaveClicked = async () => {
    try {
      setIsAdding(true);
      await addRoom({ garden_id: garden_id, name: roomName });
      setIsAdding(false);
      setRoomName("");
    } catch (err) {
      alert(err);
    }
  };

  if (isLoading) {
    content = (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Đang tải nội dung...</span>
      </div>
    );
  } else if (isSuccess) {
    let pre_content = (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Mã phòng</th>
            <th scope="col">Tên phòng</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {room_list.data.map((room) => (
            <tr key={room._id}>
              <th>{room._id}</th>
              <td>{room.name}</td>
              <td>
                <Link
                  to={`/gardens/${garden_id}/rooms/${room._id}/devices`}
                  className="btn btn-success me-3"
                >
                  Chi tiết phòng
                </Link>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    await deleteRoom(room._id).unwrap();
                  }}
                >
                  Xoá phòng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    const containerClassname = classnames("rooms-container", {
      disabled: isFetching,
    });
    content = <div className={containerClassname}>{pre_content}</div>;
  } else if (isError) {
    content = <h6 class="text-danger">{error.toString()}</h6>;
  }

  return (
    <div className="container-md px-4">
      <h2>Danh sách phòng trong vườn </h2>
      <div>
        <div className="border border-2 rounded-4 shadow pt-2 pb-3 px-5">
          <h3 className="m-0 text-success">Thêm phòng mới</h3>
          <div className="d-flex">
            <div className="d-flex mb-3 addNewRoom justify-content-between">
              <div>
                <label
                  for="roomName"
                  className="form-label fw-semibold addGardenLabel"
                >
                  Tên phòng
                </label>
                <input
                  type="text"
                  className="form-control border-success border-2 addGardenInput"
                  id="roomName"
                  name="roomName"
                  value={roomName}
                  onChange={onRoomNameChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveClicked();
                  }}
                />
              </div>

              <div>
                <label
                  for="roomName"
                  className="form-label fw-semibold addGardenLabel"
                >
                  Chế độ tự động
                </label>
                <select
                  className="form-select px-4 border-2 border-success addGardenInput"
                  id="auto-mode"
                  name="auto-mode"
                >
                  <option value="on">Bật</option>
                  <option value="off">Tắt</option>
                </select>
              </div>

              <div>
                <label
                  for="roomName"
                  className="form-label fw-semibold addGardenLabel"
                >
                  Giá trị nhiệt
                </label>
                <input
                  type="text"
                  className="form-control border-success border-2 addGardenInput"
                  id="tempValue"
                  name="tempValue"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveClicked();
                  }}
                />
              </div>
            </div>
            <div className="addGardenButton mb-">
              {isAdding ? (
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Đang tải nội dung...</span>
                </div>
              ) : (
                <>
                  <button
                    className="btn btn-success me-3"
                    onClick={onSaveClicked}
                  >
                    Thêm phòng
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setRoomName("")}
                  >
                    Hủy thêm
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div></div>
      </div>

      <div className="justify-content-center border border-2 rounded-4 shadow px-5 mt-3 pt-3 gardenList">
        <div className="col">
          <div className="col-auto d-flex justify-content-between mb-3">
            <h3 className="m-0 text-success">Phòng hiện tại</h3>
            <button className="btn btn-success" onClick={refetch}>
              Làm mới
            </button>
          </div>
        </div>
        {content}
        {/* <div className="col">
          <button className="btn btn-primary" onClick={refetch}>
            Làm mới
          </button>
        </div> */}
      </div>
      {/* <div className="row justify-content-center">
        <div className="col">{content}</div>
      </div> */}
    </div>
  );
};
