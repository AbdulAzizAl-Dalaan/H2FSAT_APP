var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Survey_Info = require("../models/Survey/Survey_Info");
const Survey_Q = require("../models/Survey/Survey_Q");
const Survey_A = require("../models/Survey/Survey_A");
const Survey_R = require("../models/Survey/Survey_R");
const Core_Result = require("../models/Core_Result");
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
    const User_Result = await Core_Result.findOne({ where: { user_email: res.locals.email } });
    const Notifications = await Notification.findAll({ where: { state: res.locals.state } });


    
    // create a dictionary from core category to description
    let category_dict = {};
    for (let i = 0; i < Notifications.length; i++) {
      category_dict[Notifications[i].category] = Notifications[i].description;
    }

    // iterate through the cpa_results object in User_Result
    if (User_Result !== null) {
      console.log(User_Result.h2f_results, typeof(User_Result.h2f_results))
      console.log(User_Result.cpa_results, typeof(User_Result.cpa_results))
      // map from core_category to description for H2F_Notifications and CPA_Notifications
      console.log(category_dict)
      res.render("notifications", { User_Result, category_dict });

    }
    else {
      // iterate through the h2f_results object in User_Result
      console.log("no core results")
      res.render("notifications", { User_Result, msg: "No notifications" });
    }
});


module.exports = router;