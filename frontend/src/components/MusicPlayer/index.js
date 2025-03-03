import React from "react";

export default function MusicPlayer() {
  return (
    <div id="music-player">
      <audio
        id="player"
        controls
        src="https://www.computerhope.com/jargon/m/example.mp3"
      >
        Trang web của bạn không được hỗ trợ
        <code>audio</code> element.
      </audio>
    </div>
  );
}
