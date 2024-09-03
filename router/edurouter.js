const express = require('express');
const users = require("../model/user");
const services = require('../model/services');
const cources = require('../model/cources');
const multer = require('multer');
const upload = multer({ dest: 'public/images/cources/' });

router = express.Router();

router.get('/', async (req,res)=>{
    try{
        const allServices = await services.find();
        const email = req.session.email;
        res.render('home',{ title:'EDU Connect', allServices , email });
    }
    catch(err){
        console.log(err);
    }
});

router.get("/login",(req,res)=>{
    res.render("login",{title:"Register here..."});

});
router.get("/signup",(req,res)=>{
    res.render("signup",{title:"Register here..."});

});

router.post('/signup', async (req,res)=>{
    // get details
    const email = req.body.email;
    const role = 0;
    

    const recchk = await users.findOne({ email });
    if(recchk){
        return res.status(401).json({message: "Email already exist" });
    }

    const user = new users({
        fullname: req.body.fullname,
        email,
        password: req.body.password,
        role,
    });
    
    user.save().then(()=>{
        req.session.message = {
            type: "success",
            message: "user registered successfully",
        };
        res.redirect("/login");
    }).catch((err)=>{
        res.json({ message: err.message });
    });
        
    
});

router.post('/login', async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await users.findOne({$and: [{ email }, { password }],}); // Replace with your authentication logic

        if (user) {
            req.session.loggedin = true;
            req.session.userId = user._id; 
            req.session.email = user.email; 
        
            if(user.role == 1){
                req.session.user = "admin";
                res.redirect('/admin');    
            }
            else{
                req.session.user = "user";
                res.redirect('/');
            }
        }else {
            res.redirect('/login');
        }
    }
    catch(error){
        res.send(error);
    }
})

router.get('/computer_courses', async (req, res) => {
    try {
        const { service } = req.query;

        // Fetch the list of courses from the database, filtered by service name
        const courceList = await cources.find({ serName: service });

        // Check if courceList is an array
        if (!Array.isArray(courceList)) {
            throw new Error('cources is not an array');
        }

        // Group courses by cName
        const groupedCourses = courceList.reduce((acc, course) => {
            acc[course.cName] = acc[course.cName] || [];
            acc[course.cName].push(course);
            return acc;
        }, {});

        res.render('computer_courses', { groupedCourses });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).send('An error occurred while fetching the courses');
    }
});




router.get('/gate', async (req,res)=>{
    try{
        res.render('gate',{ title:'EDU Connect' });
    }
    catch(err){
        console.log(err);
    }
});

function checkAdminRole(req, res, next) {
    if (req.session.loggedin && req.session.user === "admin") {
        next(); // User is admin, proceed to the requested route
    } else {
        res.status(403).send('Access denied. You do not have permission to access this page.'); // User is not admin, deny access
    }
}

router.get('/admin', checkAdminRole, async (req,res)=>{
    try{
        res.render('admin',{ title:'EDU Connect' });
    }
    catch(err){
        console.log(err);
    }
});
router.get('/addCourse', async (req,res)=>{
    try{
        res.render('addCourses',{ title:'EDU Connect' });
    }
    catch(err){
        console.log(err);
    }
});
router.get('/addService', async (req,res)=>{
    try{
        res.render('addServices',{ title:'EDU Connect' });
    }
    catch(err){
        console.log(err);
    }
});
router.get('/showCourse', async (req,res)=>{
    try{
        const allCou = await cources.find();
        res.render('showCourses',{ allCou });
    }
    catch(err){
        console.log(err);
    }
});

router.get('/showService', async (req,res)=>{
    try{
        const allSer = await services.find();
        res.render('showServices',{ allSer });
    }
    catch(err){
        console.log(err);
    }
});

router.get('/deleteSer/:id', async (req,res)=>{
    try{
        const id = req.params.id;
        const ser = await services.deleteOne({ serName:id });
        res.redirect('/showService');
    }
    catch(err){
        console.log(err);
    }
});

router.get('/deleteCou/:id', async (req,res)=>{
    try{
        const id = req.params.id;
        const cou = await cources.deleteOne({ cName:id });
        res.redirect('/showCourse');
    }
    catch(err){
        console.log(err);
    }
});

router.post('/addServices', upload.single('imgPath'), async (req, res) => {
    console.log("entered");
    const service = new services({
        serName: req.body.serName,
        serImg: req.file.path, // Store the file path or handle it as needed
    });

    try {
        await service.save();
        req.session.message = {
            type: "success",
            message: "Service added successfully",
        };
        res.redirect("/showService");
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get('/showService', async (req,res)=>{
    
    try {
          const allServices = await services.find();
          res.render('showServices',{ allServices })
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching applied jobs'); // Handle errors gracefully
    }
    
})

router.post('/addCources', upload.single('imgPath'), async (req,res)=>{
    
    const cource = new cources({
        serName: req.body.serName,
        cName: req.body.cname,
        cImg: req.file.path,
        cVideo: req.body.videopath,
        cnt: req.body.vcnt,
    });
    cource.save().then(()=>{
        req.session.message = {
            type: "success",
            message: "cource added successfully",
        };
        res.redirect("/showCourse");
    }).catch((err)=>{
        res.json({ message: err.message });
    });
})

router.get('/showCources', async (req,res)=>{
    
    try {
          const allCource = await cources.find();
          res.render('showCources',{ allCource })
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching applied jobs'); // Handle errors gracefully
    }
    
})

router.get('/showCources', async (req,res)=>{
    
    try {
          const allCource = await cources.find();
          res.render('showCources',{ allCource })
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching applied jobs'); // Handle errors gracefully
    }
    
})

router.get('/logout', async (req,res)=>{
    
    try {
        req.session.destroy();
        res.redirect('/login');
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Somthing went wrong'); // Handle errors gracefully
    }
    
})

module.exports = router;