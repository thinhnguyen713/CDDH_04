const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { MySong, Song } = require("../../db/models");
router.get(
    "/:userId",
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      console.log("🔹 Đang truy vấn MySong với userId:", userId);
  
      // Lấy danh sách songId từ MySong
      const mySongs = await MySong.findAll({
        where: { userid: userId },
        attributes: ["songid"], // ✅ Đảm bảo lấy đúng cột "songid"
      });
  
      console.log("🔹 Kết quả MySong:", mySongs); // 🚀 Debug xem dữ liệu có đúng không
  
      if (!mySongs.length) {
        return res.status(404).json({ error: "Danh sách bài hát của bạn trống." });
      }
  
      const songIds = mySongs.map((entry) => entry.dataValues.songid); // ✅ Lấy đúng key songid

      console.log("🔹 Đang truy vấn Songs với songIds:", songIds);
  
      // Lấy danh sách bài hát dựa trên songIds
      const songs = await Song.findAll({
        where: { id: songIds },
        attributes: ["id", "title", "artist", "genre", "audioFile", "imgUrl", "album"],
      });
  
      return res.json({ userId, songs });
    })
  );
  router.get(
    "/count/:userId",
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
  
      const songCount = await MySong.count({ where: { userid: userId } });
  
      return res.json({ userId, songCount });
    })
  );
  
// 📌 Thêm bài hát vào "My Songs"
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

    // Kiểm tra xem bài hát đã có trong danh sách chưa
    const existingEntry = await MySong.findOne({ where: { userId, songId } });

    if (existingEntry) {
      return res.status(409).json({ error: "Bài hát đã có trong danh sách của bạn." });
    }

    // Thêm bài hát vào danh sách
    const newEntry = await MySong.create({ userId, songId });
    return res.status(201).json({ message: "Đã thêm bài hát vào danh sách của bạn.", newEntry });
  })
);

// 📌 Xóa bài hát khỏi "My Songs"
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, songId } = req.body;

    // Kiểm tra đầu vào hợp lệ
    if (!userId || !songId) {
      return res.status(400).json({ error: "userId và songId là bắt buộc." });
    }

    // Kiểm tra xem bài hát có trong danh sách không
    const mySongEntry = await MySong.findOne({ where: { userId, songId } });

    if (!mySongEntry) {
      return res.status(404).json({ error: "Bài hát không tồn tại trong danh sách của bạn." });
    }

    // Xóa bài hát khỏi danh sách
    await mySongEntry.destroy();
    return res.json({ message: "Đã xóa bài hát khỏi danh sách của bạn." });
  })
);

module.exports = router;
