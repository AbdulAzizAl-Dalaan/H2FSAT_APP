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
        res.redirect("/?msg=fail")
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


router.get('/settings', async function(req, res, next) {
  console.log("SESSION USER IS " + req.session.user)
  const user = await User.findByPk(req.session.user.username)
  console.log("USER IS " + user.username)
  if (user)
  {
    res.render('settings', {user});
  }
  else
  {
    res.redirect('/')
  }
});




router.post('/settings', async function(req, res, next) {
  const user = await User.findByPk(req.session.user.username)
  const checkUser = await User.findByPk(req.body.username)
  const checkEmail = await User.findOne({where: {email: req.body.email}})

  if (req.session.user)
  {

    if (req.body.username !== req.session.user.username && checkUser) // Check if username is being changed
    {
      res.redirect('/settings?msg=username+already+exists')
    }
    else if (req.body.email !== req.session.user.email && checkEmail) // Check if email is being changed
    {
      res.redirect('/settings?msg=email+already+exists')
    }
    else if (req.body.password !== req.body.password2) // Check if New passwords match
    {
      res.redirect('/settings?msg=passwords+do+not+match')
    }
    else
    {
      if (req.body.username !== '' && req.body.username !== req.session.user.username) //  username is being changed
      {
        console.log("DESTROYING AND CREATING USER: " + req.body.username)
        await User.create({
          firstname: req.body.firstname ? req.body.firstname : user.firstname,
          lastname: req.body.lastname ? req.body.lastname : user.lastname,
          username: req.body.username,
          password: req.body.password ? req.body.password : user.password,
          email: req.body.email ? req.body.email : user.email,
          number: req.body.number ? req.body.number : user.number
        })
        await User.destroy({ where: { username: req.session.user.username } })
        req.session.destroy()
        res.redirect('/?msg=account+updated+please+login+again')
      }
      else
      {
        console.log("UPDATING USER: " + req.body.username)
        await User.update({
            firstname: req.body.firstname ? req.body.firstname : user.firstname,
            lastname: req.body.lastname ? req.body.lastname : user.lastname,
            password: req.body.password ? req.body.password : user.password,
            email: req.body.email ? req.body.email : user.email,
            number: req.body.number ? req.body.number : user.number
        }, {
          where: {
            username: req.session.user.username
          }
        })
        res.redirect('/settings?msg=updated')
      }
    }
  }
  else
  {
    res.redirect('/')
  }

});


router.post('/deleteaccount', async function(req, res, next) {
  console.log("SESSION USER IS " + req.session.user)
  if (req.session.user)
  {
    await User.destroy({
      where: {
        username: req.session.user.username
      }
    })
    req.session.destroy()
    res.redirect('/')
  }
  else
  {
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
