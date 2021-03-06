const express = require('express');
const http = require('http');
const bcrypt = require('bcryptjs');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));

const port = process.env.PORT || 443;

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});


app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center' class= 'container'><h2>Registration successful!</h2></div><br><br><div align='center'><a class 'link-info' href='./index.html'>Login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user.</a></div>");
        } else {
            res.send("<div align ='center' class= 'container'><h2>Email already used!</h2></div><br><br><div align='center'><a class='link-info' href='./registration.html'>Register again.</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>Login successful!</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./index.html'>Logout</a></div>`);
            } else {
            res.send("<div align ='center'><h2>Login failed due to incorrect username or password</h2></div><br><br><div align ='center'><a href='./index.html'>Login again.</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./index.html'>Login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});


server.listen(port, function(){
    console.log(`Login app listening at http://localhost:${port}`)
});
