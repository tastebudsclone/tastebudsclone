const express = require('express');

const common = require("../controllers/common.controller");
const users = require("../controllers/users.controller");
const secure = require("../middlewares/secure.mid");

const router = express.Router();

router.get("/", common.home);
router.get("/search", common.search);
router.post("/search", common.addArtist)
router.get("/artist/:id", common.artist)
router.post("/artist/:id", common.addArtist)

router.get("/login", users.login);
router.post("/login", users.doLogin);

router.get("/signup", users.create);
router.post("/signup", users.doCreate);

router.get("/logout", users.logout);

router.get("/home", secure.isAuthenticated, users.home);


router.get("/users/:username", secure.isAuthenticated, users.profile);
router.post("/users/:username", secure.isAuthenticated, secure.isOwnedByUser, users.edit);







module.exports = router;