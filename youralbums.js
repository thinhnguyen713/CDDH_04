const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { YourAlbum, Song } = require("../../db/models");
console.log("YourAlbum model:", YourAlbum); 
router.get(
    "/:userId",
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
  
      // Lấy danh sách songId từ YourAlbum
      const userAlbums = await YourAlbum.findAll({
        where: { userId },
        attributes: ["songId"],
      });
  
      if (!userAlbums.length) {
        return res.status(404).json({ error: "Album của bạn không có bài hát nào." });
      }
  
      // Lấy danh sách bài hát dựa trên songId
      const songIds = userAlbums.map((entry) => entry.songId);
      const songs = await Song.findAll({
        where: { id: songIds },
        attributes: ["id", "title", "artist", "genre", "audioFile", "imgUrl", "album"],
      });
  
      return res.json({ userId, songs });
    })
  );
// 📌 Thêm bài hát vào album của người dùng
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, songId } = req.body;

    // Kiểm tra đầu vào hợp lệ
    if (!userId || !songId) {
      return res.status(400).json({ error: "userId và songId là bắt buộc." });
    }

    // Kiểm tra xem bài hát có tồn tại không
    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ error: "Bài hát không tồn tại." });
    }

    // Kiểm tra xem bài hát đã có trong album chưa
    const existingEntry = await YourAlbum.findOne({
      where: { userId, songId },
    });

    if (existingEntry) {
      return res.status(409).json({ error: "Bài hát đã có trong album." });
    }

    // Thêm bài hát vào album
    const newEntry = await YourAlbum.create({ userId, songId });
    return res.status(201).json({ message: "Đã thêm bài hát vào album.", newEntry });
  })
);

// 📌 Xóa bài hát khỏi album của người dùng
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, songId } = req.body;

    // Kiểm tra đầu vào hợp lệ
    if (!userId || !songId) {
      return res.status(400).json({ error: "userId và songId là bắt buộc." });
    }

    // Kiểm tra xem bài hát có trong album không
    const albumEntry = await YourAlbum.findOne({ where: { userId, songId } });

    if (!albumEntry) {
      return res.status(404).json({ error: "Bài hát không tồn tại trong album." });
    }

    // Xóa bài hát khỏi album
    await albumEntry.destroy();
    return res.json({ message: "Đã xóa bài hát khỏi album." });
  })
);

module.exports = router;
