import React, { useEffect, useState } from "react"; 
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { FaCrown } from "react-icons/fa";

import "./Navigation.css";
import logo from "./logo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [isPremium, setIsPremium] = useState(false);
  const [songCount, setSongCount] = useState(0); // State để lưu số lượng bài hát
  const history = useHistory();

  // Kiểm tra trạng thái Premium
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (sessionUser?.id) {
        try {
          const response = await fetch(`http://localhost:5433/check-premium/${sessionUser.id}`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setIsPremium(data.isPremium === true);
        } catch (error) {
          console.error("Lỗi :", error);
        }
      }
    };
    checkPremiumStatus();
  }, [sessionUser]);

  // Lấy số lượng bài hát của người dùng
  useEffect(() => {
    const fetchSongCount = async () => {
      if (sessionUser?.id) {
        try {
          const response = await fetch(`http://localhost:5433/api/mysong/count/${sessionUser.id}`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setSongCount(data.songCount); // Lưu số lượng bài hát vào state
        } catch (error) {
          console.error("Lỗi:", error);
        }
      }
    };
    fetchSongCount();
  }, [sessionUser]);

  // Kiểm tra khi người dùng nhấn nút Upload
  const handleUploadClick = () => {
    if (!isPremium && songCount >= 1) {
      alert("Bạn cần nâng cấp lên Premium để tải lên nhiều hơn 1 bài!");
    } else {
      history.push("/upload"); // Dùng history.push để điều hướng tới trang upload
    }
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = <ProfileButton user={sessionUser} />;
  } else {
    sessionLinks = (
      <div className="navBtnContainer">
        <LoginFormModal />
        <SignupFormModal />
      </div>
    );
  }

  return (
    <div className="navbar">
      <div id="nav-content">
        <nav id="nav">
          <div id="logo">
            <img id="imgLogo" src={logo} alt="Logo" />
            <NavLink id="homeBtn" exact to="/dashboard">
              SOUNDWAVE
            </NavLink>
            <NavLink id="nav-home" exact to="/dashboard">
              Home
            </NavLink>
            <div className="nav-search-container">
              <input className="nav-search" placeholder="Search" />
              <button className="nav-search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <NavLink id="nav-home" exact to={`/myalbum/${sessionUser?.id}`}>
              My Album
            </NavLink>
            <NavLink id="nav-home" exact to={`/mysong/${sessionUser?.id}`}>
              My Song
            </NavLink>

            {/* Nút Upload với điều kiện kiểm tra */}
            <button id="nav-upload" onClick={handleUploadClick}>
              Upload
            </button>

            <NavLink id="nav-home" to="/upgrade">
              Upgrade
            </NavLink>

            <NavLink id="nav-profile" to="/">
              {isPremium && <FaCrown color="gold" style={{ marginRight: 5 }} />}
              {sessionUser?.username}
            </NavLink>
          </div>

          {isLoaded && sessionLinks}
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
