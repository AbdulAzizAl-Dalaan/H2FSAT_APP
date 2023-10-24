var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Survey_Info = require("../models/Survey/Survey_Info");
const Notification = require("../models/Notification");
const { Op } = require("sequelize");

const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.locals.firstname = req.session.user.firstname;
    res.locals.lastname = req.session.user.lastname;
    res.locals.unit = req.session.user.unit;
    res.locals.rank = req.session.user.rank;
    res.locals.email = req.session.user.email;
    res.locals.state = req.session.user.state;
    res.locals.isAdmin = req.session.user.isAdmin;
    res.locals.isUnitLeader = req.session.user.isUnitLeader;
    next();
  } else {
    res.redirect("/?msg=raf");
  }
};

router.use(sessionChecker);

router.get("/", async function (req, res, next) {
    
  const Notifications = await Notification.findAll({ where: { unit: res.locals.unit } });
  const User = await User.findOne({ where: { unit: res.locals.email } });
  if (User && (User.isAdmin || User.isUnitLeader)) {
    res.render('notification', { Notifications })
  } else {
    res.redirect("/home/?msg=noaccess");
  }
});


module.exports = router;