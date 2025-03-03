import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Navigation from "../Navigation";

export default function MyAlbum({ isLoaded }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  useEffect(() => {
    if (!sessionUser) {
      alert("Vui lòng đăng nhập để xem album của bạn.");
      history.push("/dashboard");
      return;
    }

    const userId = sessionUser.id;

    fetch(`/api/your-albums/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách bài hát.");
        return res.json();
      })
      .then((data) => {
        console.log("Dữ liệu API:", data);
        if (data.error) {
          setSongs([]);
          setError(data.error);
        } else {
          setSongs(data.songs);
          setError(null);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionUser, history]);

  isLoaded = !loading;

  const handleDeleteSong = (songId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài hát này?")) {
      fetch(`/api/your-albums`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: sessionUser.id, songId }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Xóa bài hát thất bại.");
          return res.json();
        })
        .then(() => {
          setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <div id="top-dashboard">
      <Navigation isLoaded={isLoaded} />
      <h1 id="dashboard-title">🎵 My Album 🎶</h1>

      {loading && <p className="text-center text-gray-400">Đang tải bài hát...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="dashboard-tracks-container">
        <div className="dashboard-songs">
          {songs.length > 0 ? (
            songs.map((song) => (
              <div
                key={song.id}
                className="dashboard-cover-container"
                onClick={() => {
                  history.push(`/songs/${song.id}`); // 👉 Chuyển đến chi tiết bài hát
                  window.scrollTo(0, 0);
                }}
              >
                <a className="dashboard-cover-title">{song.title}</a>
                <img className="dashboard-cover" src={song.imgUrl} alt={song.title} />
                <audio
                  className="audio-dashboard"
                  controls
                  controlsList="nodownload"
                  src={song.audioFile}
                ></audio>
                <a className="dashboard-cover-artist">{song.artist}</a>

                {/* Nút Xóa bài hát */}
                <button
                  onClick={(event) =>{ 
                    event.stopPropagation();
                    handleDeleteSong(song.id)}}
                  className="delete-song-button"
                >
                  ❌ Delete song from my album
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              Không có bài hát nào trong album.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
