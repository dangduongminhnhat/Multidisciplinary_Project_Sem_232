import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./loginService";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import "./logInStyle.css";
const cookies = new Cookies();

export const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState(true);
  const navigate = useNavigate();

  const onUsernameChange = (e) => setUsername(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const [login] = useLoginMutation();

  const canSave = [username, password].every(Boolean);

  const handleSubmit = async () => {
    if (canSave) {
      try {
        const login_info = { username: username, password: password };
        let response = await login(login_info);
        cookies.set("access-token", response.data["access-token"], {
          path: "/",
        });
        setTimeout(() => window.location.reload(), 100);
        navigate("/gardens");
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <div className="loginPage">
      <div className="wallpage">
        <div
          className="text-white fw-semibold fs-4 ms-4 mt-2 goback"
          onClick={() => {
            navigate("/");
          }}
        >
          Quay về
        </div>
      </div>
      <div className="row justify-content-end">
        <div className="col-md-6 loginContainer">
          {cookies.get("access-token") ? (
            <div className={`loginContent ${!log ? "d-none" : "appear"}`}>
              <h2>Bạn đã đăng nhập thành công</h2>
              <div className="buttonContainer m-auto">
                <Link to='/gardens' className="primaryButton btn mt-4">Tiếp tục quản lý vườn</Link>
              </div>
            </div>
          ) : (
            <div className={`loginContent ${!log ? "d-none" : "appear"}`}>
              <h2 className="mb-2">Đăng nhập</h2>
              <div className="mb-3 welcome">
                Chào mừng bạn trở lại với hệ thống vườn thông minh
              </div>
              <form>
                <div className="mb-3">
                  <label for="username" className="form-label inputLabel">
                    Tài khoản
                  </label>
                  <input
                    type="text"
                    className="form-control inputLogin"
                    id="username"
                    name="username"
                    placeholder="abc123"
                    value={username}
                    onChange={onUsernameChange}
                  />
                </div>
                <div className="mb-5">
                  <label for="password" className="form-label inputLabel">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="form-control inputLogin"
                    id="password"
                    name="password"
                    placeholder="12345678"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    value={password}
                    onChange={onPasswordChange}
                  />
                </div>
              </form>
              <button className="btn primaryButton mb-3" onClick={handleSubmit}>
                Đăng nhập
              </button>
              <div className="text-center fw-semibold text-secondary">
                Bạn chưa có tài khoản?{" "}
                <span
                  onClick={() => {
                    setLog(!log);
                  }}
                  className="fw-semibold signUpNow"
                >
                  Đăng ký ngay
                </span>
              </div>
            </div>
          )}

          <div className={`signupContent ${log ? "d-none" : "appear"}`}>
            <h2 className="mb-2">Đăng ký</h2>
            <div className="mb-3 welcome">
              Chào mừng bạn đến với hệ thống vườn thông minh
            </div>
            <form>
              <div className="mb-3">
                <label for="username" className="form-label inputLabel">
                  Tài khoản
                </label>
                <input
                  type="text"
                  className="form-control inputLogin"
                  id="username"
                  name="username"
                  placeholder="Tài khoản cần ít nhất 6 ký tự"
                  value={username}
                  onChange={onUsernameChange}
                />
              </div>
              <div className="mb-5">
                <label for="password" className="form-label inputLabel">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="form-control inputLogin"
                  id="password"
                  name="password"
                  placeholder="Mật khẩu cần ít nhất 8 ký tự"
                  value={password}
                  onChange={onPasswordChange}
                />
              </div>
            </form>
            <button className="btn primaryButton mb-3" onClick={handleSubmit}>
              Đăng ký
            </button>
            <div className="text-center fw-semibold text-secondary">
              Bạn đã có tài khoản?{" "}
              <span
                onClick={() => {
                  setLog(!log);
                }}
                className="fw-semibold signUpNow"
              >
                Đăng nhập ngay
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
