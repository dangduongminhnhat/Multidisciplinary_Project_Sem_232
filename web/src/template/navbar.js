import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import Cookies from "universal-cookie";
import "./navbarStyle.css"
const cookies = new Cookies();

export const NavBar = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(cookies.get("access-token"));
    let navItem = null

    const handleSignOut = (e) => {
        cookies.remove('access-token', {
            path: "/",
        });
        setToken(null)
        navigate("/")
    }

  if (token) {
    navItem = (
    //   <div className="collapse navbar-collapse" id="navbarNav">
      <div id="navbarNav" style={{width: "100%"}}>
        <ul className="navbar-nav">
          <li className="nav-item hover-zoom">
            <Link className="nav-link text-white text-center navbarItem" to="/gardens">
              Quản lý vườn
            </Link>
            <div className="text-white text-center navbarItem" onClick={handleSignOut}>Đăng xuất</div>
          </li>
        </ul>
      </div>
    );
  } else {
    navItem = (
    //   <div className="collapse navbar-collapse" id="navbarNav">
    <div id="navbarNav" style={{width: "100%"}}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link text-white text-center navbarItem" to="/login">
              Đăng nhập
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex">
        <div className="col-2 bg-success" style={{"height": "100vh"}}>
          <nav className="navbar">
            <div className="container-fluid">
              <Link style={{width: '100%'}} className="navbar-brand text-white text-center d-block fw-semibold fs-3 pb-4" to="/">
                Vườn thông minh
              </Link>
              {/* <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button> */}
              {navItem}
            </div>
          </nav>
        </div>
        <Outlet />
      </div>
    </>
  );
};
