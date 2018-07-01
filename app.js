const express = require("express");
const app = express();
const router = require("./router.js");
const cookie = require("cookie-parser");
const session = require("express-session");

app.set("view engine","ejs");
app.use(cookie());
app.use(session({ secret: '12345', cookie: { maxAge: 1000*60*30 }}));

app.use(express.static("./public"));

app.get("/login",router.login);
app.post("/login",router.login1);

app.get("/",router.index);
app.get("/index",router.index);

app.post("/addThing",router.addThing);
app.post("/addList",router.addList);

app.get("/delete",router.delete);
app.get("/remove",router.remove);

app.post("/search",router.search);

app.get("/deleteList",router.deleteList);

app.get("/logout",router.logout);

app.use((request,response,next)=>{
	response.render("404");
});

app.listen(3000);
console.log("服务器已经启动,请在浏览器输入 ‘127.0.0.1:3000’ 查看");