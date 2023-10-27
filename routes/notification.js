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
    
  const user = await User.findOne({ where: { email: res.locals.email } });
  // Notifications where core_assessment_id === 1 and unit === res.locals.unit

  console.log("Unit Leader: " + user.isUnitLeader)
  if (user && (user.isAdmin || user.isUnitLeader)) {

    // These notification must exist by default for every possible unit
    const h2f_notifications = await Notification.findAll({ where: { core_assessment_id: 1, unit: res.locals.unit } });
    const cpa_notifications = await Notification.findAll({ where: { core_assessment_id: 2, unit: res.locals.unit } });
    const fms_notifications = await Notification.findAll({ where: { core_assessment_id: 3, unit: res.locals.unit } });

    res.render('notification', { h2f_notifications, cpa_notifications, fms_notifications })

  } else {
    res.redirect("/home/?msg=noaccess");
  }
});

router.post('/', async function (req, res, next) {
  const user = await User.findOne({ where: { email: res.locals.email } });
  console.log(req.body);
  if (user && (user.isAdmin || user.isUnitLeader)) {
    // These notification must exist by default for every possible unit
    const h2f_categories = ["Physical", "Nutrition", "Spiritual", "Mental", "Sleep"]
    const cpa_categories = ["Motivation", "Ability", "Current"]
    const fms_categories = ["PT", "MFT"]

    for (const h2f_category of h2f_categories) {
      const h2f_notification = await Notification.findOne({where: { core_assessment_id: 1, unit: res.locals.unit, core_category: h2f_category }})
      await h2f_notification.update({description: req.body[h2f_category], resource_email: req.body[h2f_category + " Email"], resource_phone: req.body[h2f_category + " Phone"]})
      await h2f_notification.save()
    }

    for (const cpa_category of cpa_categories) {
      const cpa_notification = await Notification.findOne({where: { core_assessment_id: 2, unit: res.locals.unit, core_category: cpa_category }})
      await cpa_notification.update({description: req.body[cpa_category], resource_email: req.body[cpa_category + " Email"], resource_phone: req.body[cpa_category + " Phone"]})
      await cpa_notification.save()
    }

    for (const fms_category of fms_categories) {
      const fms_notification = await Notification.findOne({where: { core_assessment_id: 3, unit: res.locals.unit, core_category: fms_category }})
      await fms_notification.update({description: req.body[fms_category], resource_email: req.body[fms_category + " Email"], resource_phone: req.body[fms_category + " Phone"]})
      await fms_notification.save()
    }


    res.redirect('/home')

  } else {
    res.redirect("/home/?msg=noaccess");
  }
  
});


module.exports = router;