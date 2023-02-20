const express = require('express');

const common = require("../controllers/common.controller");
const users = require("../controllers/users.controller");
const secure = require("../middlewares/secure.mid");

const router = express.Router();

router.get("/", common.home);

router.get("/login", users.login);
router.post("/login", users.doLogin);

router.get("/signup", users.create);
router.post("/signup", users.doCreate);

router.get("/logout", users.logout);

router.get("/home", secure.isAuthenticated, users.home);

router.get("/users/:id/edit", secure.isAuthenticated, users.edit);
router.post("/users/:id/edit", secure.isAuthenticated, users.doEdit);
router.get("/users/:id", secure.isAuthenticated, users.profile);




module.exports = router;