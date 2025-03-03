const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const songsRouter = require("./songs.js");
const commentsRouter = require("./comments.js");
const asyncHandler = require("express-async-handler");
const yourAlbumsRoutes = require("./youralbums.js");
const mySongRoutes = require("./mysong.js");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth.js");
const { User } = require("../../db/models");

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/songs", songsRouter);
router.use("/comments", commentsRouter);

router.use("/your-albums", yourAlbumsRoutes);
router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

router.use("/mysong", mySongRoutes);

module.exports = router;
