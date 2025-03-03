import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Navigation from "../Navigation";
import { getAllSongs } from "../../store/songs";
import "./Dashboard.css";

export default function Dashboard({ isLoaded }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [addingSongId, setAddingSongId] = useState(null);

  useEffect(() => {
    dispatch(getAllSongs());
  }, [dispatch]);

  const sessionUser = useSelector((state) => state.session.user);
  const songs = useSelector((state) => state.songsRed.songs);

  useEffect(() => {
    if (sessionUser) history.push("/dashboard");
    else history.push("/");
  }, [sessionUser, history]);

  const handleAddToAlbum = async (songId) => {
    if (!sessionUser) {
      alert("⚠️ Vui lòng đăng nhập để thêm bài hát vào album.");
      return;
    }

    setAddingSongId(songId);

    try {
      const response = await fetch("http://localhost:5433/api/your-albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: sessionUser.id, songId }),
      });

      const data = await response.json();

      if (data.error) {
        alert(`❌ ${data.error}`);
      } else {
        alert("✅ Đã thêm bài hát vào album!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm bài hát:", error);
      alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setAddingSongId(null);
    }
  };

  return (
    <div id="top-dashboard">
      <Navigation isLoaded={isLoaded} />
      <h1 id="dashboard-title">Top Songs On SoundWave</h1>

      <div className="dashboard-tracks-container">
        <div className="dashboard-songs">
          {songs?.allSongs.map((song) => (
            <div
              className="dashboard-cover-container"
              key={song.id}
              onClick={() => {
                history.push(`/songs/${song.id}`);
                window.scrollTo(0, 0);
              }}
            >
              <a className="dashboard-cover-title">{song.title}</a>
              <img className="dashboard-cover" src={song.imgUrl} alt={song.title} />
              <audio className="audio-dashboard" controls src={song.audioFile}></audio>
              <a className="dashboard-cover-artist">{song.artist}</a>

              {/* Nút Add to Album */}
              <button
                className="add-to-album-button"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click vào bài hát
                  handleAddToAlbum(song.id);
                }}
                disabled={addingSongId === song.id}
              >
                {addingSongId === song.id ? "Đang thêm..." : "➕ Add to My Album"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
