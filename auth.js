const express = require('express');

const router = express.Router();

var user = {
  email: 'vikas@gmail.com',
  password: 'vikas'
};

router.post('/login',(req,res) => {
  const result = user.find((usr) => usr.email === req.body.email);
    if(result){
        if(result.password == req.body.password){
            res.status(200).send({
                email: req.body.email,
                password: req.body.password,
                success : true
            })
        } else{
            res.status(200).send({
                email: req.body.email,
                password: req.body.password,
                success: false
            })
        }
    } else{
        res.status(200).send({
          message: "user not found"
        })
    }
})


module.exports = router;
