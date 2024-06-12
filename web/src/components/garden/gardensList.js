import React, { useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import "./gardenStyle.css";
import {
  useAddNewGardenMutation,
  useDeleteGardenMutation,
  useGetAllGardensQuery,
} from "./gardenService";

export const GardensList = () => {
  const navigate = useNavigate();

  if (!document.cookie.includes("access-token")) {
    navigate("/login");
  }

  const {
    data: garden_list,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetAllGardensQuery();

  let content = null;
  const [deleteGarden] = useDeleteGardenMutation();
  const [addGarden] = useAddNewGardenMutation();

  const [gardenName, setGardenName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onGardenNameChange = (e) => setGardenName(e.target.value);

  const canSave = [gardenName].every(Boolean) && !isLoading;

  const onSaveClicked = async () => {
    if (canSave) {
      try {
        setIsAdding(true);
        await addGarden({ name: gardenName });
        setIsAdding(false);
        setGardenName("");
      } catch (err) {
        alert(err);
      }
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
            <th scope="col">Mã vườn</th>
            <th scope="col">Tên vườn</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {garden_list.data.map((garden) => (
            <tr key={garden._id}>
              <th>{garden._id}</th>
              <td>{garden.name}</td>
              <td>
                <Link
                  to={`/gardens/${garden._id}/rooms`}
                  className="btn btn-success me-3"
                >
                  Chi tiết vườn
                </Link>
                  <button
                    className="btn btn-secondary"
                    onClick={async () => {
                      setIsDeleting(true);
                      await deleteGarden(garden._id).unwrap();
                      setIsDeleting(false);
                    }}
                  >
                    Xoá vườn
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    const containerClassname = classnames("gardens-container", {
      disabled: isFetching,
    });
    content = <div className={containerClassname}>{pre_content}</div>;
  } else if (isError) {
    content = <h6 class="text-danger">{error.toString()}</h6>;
  }

  return (
    <div className="container-md px-4">
      <h2>Danh sách vườn </h2>
      <div className="border border-2 rounded-4 shadow pt-2 pb-3 px-5">
        <h3 className="m-0 text-success">Thêm vườn mới</h3>
        <div className="d-flex">
          <div className="col-auto mb-3 addGarden">
            <div>
              <label
                for="gardenName"
                className="form-label fw-semibold addGardenLabel"
              >
                Tên vườn mới
              </label>
              <input
                type="text"
                className="form-control border-success border-2 addGardenInput"
                id="gardenName"
                name="gardenName"
                value={gardenName}
                onChange={onGardenNameChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveClicked();
                }}
              />
            </div>
          </div>
          <div className="addGardenButton">
            {isAdding ? (
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Đang tải nội dung...</span>
              </div>
            ) : (
              <>
                <button
                  style={{ height: "fit-content" }}
                  className="btn btn-success me-3"
                  onClick={onSaveClicked}
                >
                  Thêm vườn
                </button>
                <button
                  style={{ height: "fit-content" }}
                  className="btn btn-secondary"
                  onClick={() => {
                    setGardenName("");
                  }}
                >
                  Hủy thêm
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="justify-content-center border border-2 rounded-4 shadow px-5 mt-3 pt-3 gardenList">
        <div className="col">
          <div className="col-auto d-flex justify-content-between mb-3">
            <h3 className="m-0 text-success">Vườn hiện tại</h3>
            {!isDeleting ? <button className="btn btn-success" onClick={refetch}>
              Làm mới danh sách vườn
            </button> : <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Đang tải nội dung...</span>
              </div>}
          </div>
          {content}
        </div>
      </div>
    </div>
  );
};
