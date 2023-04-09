var express = require('express');
const User = require('../models/User')
var router = express.Router();


/* GET home page. */

router.get('/', function(req, res, next) {
  if(req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  res.render('index');
});

router.get('/passlogin', async function(req, res, next) {
  if(req.query.msg)
  {
    res.locals.msg = req.query.msg
  }
  res.render('passlogin');
});


router.post('/login', async function(req, res, next) {
  const user = await User.findByPk(req.body.email);
  if (user !== null)
  {
    if (user.isAdmin || user.isUnitLeader)
    {
      if (user.password === req.body.password)
      {
        req.session.user = user
        res.redirect("/home")
      }
      else
      {
        res.redirect("/passlogin/?msg=fail")
      }
    }
    else
    {
      req.session.user = user
      res.redirect("/home")
    }
  }
  else
  {
    res.redirect("/?msg=fail")
  }

});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', async function(req, res, next) {
  const user = await User.findByPk(req.body.username);
  const email = await User.findOne({where: {email: req.body.email}})
  if(user !== null)
  {
    console.log("User Already Exists: " + req.body.username);
    res.redirect('/register?msg=username+already+exists')
  }
  else if (email !== null)
  {
    console.log("Email Already Exists: " + req.body.email);
    res.redirect('/register?msg=email+already+exists')
  }
  else
  {
    console.log("Creating User: " + req.body.username)
    await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        number: req.body.number
    })
    res.redirect('/')
  }
});

router.get('/logout', function(req, res, next) {
  if (req.session.user)
  {
    req.session.destroy()
    res.redirect("/?msg=logout")
  }
  else
  {
    res.redirect("/")
  }
});

router.get('/forgotpassword', function(req, res, next) {
  res.render('forgotpassword');
});

router.post('/forgotpassword', async function(req, res, next) {
  const user = await User.findOne({where: {email: req.body.email}})
  console.log(req.body.password + " " + req.body.password2)
  console.log(req.body.password !== req.body.password2)
  if (!user)
  {
    res.redirect('/forgotpassword?msg=email+not+found')
  }
  else
  {
    if (req.body.password !== req.body.password2)
    {
      res.redirect('/forgotpassword?msg=passwords+do+not+match')
    }
    else
    {
      await User.update({
        password: req.body.password
      }, {
        where: {
          email: req.body.email
        }
      })
      res.redirect('/?msg=password+updated')
    }
  }
});

module.exports = router;
