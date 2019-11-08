var MongoClient = require('mongodb').MongoClient;
var url ="mongodb://localhost:27017/";

const bodyParser = require('body-Parser');
const Joi=require('joi');
var express = require('express');
var app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/home',function(req,res)
{ res.sendFile(__dirname+'/home.html')});


app.get('/signin',function(req,res)
{ res.sendFile(__dirname+'/signin.html')});


app.get('/signup',function(req,res)
{ res.sendFile(__dirname+'/signup.html')});


app.post('/account-create',(req,res)=>{
	
		var cid=req.body.n3;
		var pass=req.body.n4;
		var name=req.body.n1;
		var uname=req.body.n2;

		const list = {
				name:req.body.n1,
				username:req.body.n2,
				password:req.body.n3,
				cnfrmpass:req.body.n4
			}
			const schema = {
				name:Joi.string().min(3).required(),
				username:Joi.string().min(3).required(),
				password:Joi.string().min(3).required(),
				cnfrmpass:Joi.string().min(3).required()

			}
			const result =Joi.validate(list,schema)
			


			MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true},function(err,db){
		if(err) throw err;
		var dbase = db.db("db");
		var myobj ={"Name":name,"username":uname,"password":pass};
		dbase.collection("users").insertOne(myobj,function (err,res){
			if(err) throw err;
			db.close();
			});
		});

			if(result.error){
				res.sendFile(__dirname+'/signup.html')	
			}
			if(cid== pass)
			{
				res.sendFile(__dirname+'/signin.html');	
			}
			else
			{
				res.sendFile(__dirname+'/signup.html')		
			}

})

app.post('/check-user',(req,res)=>{

		var user=req.body.n1;
		var pass=req.body.n2;
		MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true},function(err,db){
		if(err) throw err;
		var dbase = db.db("db");
		  dbase.collection("users").findOne({"username":user},function(err, result) {
		   	if(err) throw err;
		   	var check=result.password;
		   	if(pass==check){
		   	res.sendFile(__dirname+'/landingpage.html');	
		   	}
			db.close();
			});
		});



})

app.listen(8080,()=>{})