const formidable = require("formidable");
const dao = require("./dao.js");

exports.login = (request, response, next) => { //获取登陆界面
	var tip = "";
	var tips = request.query.tip;
	if(tips == 1) tip = "用户名或密码错误";
	else if(tips == 2) tip = "请先登陆";
	response.render("login", {
		"tip": tip
	});
}

exports.login1 = (request, response, next) => { //提交登陆信息
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var userName = fields.userName;
		var userPass = fields.userPass;
		var sql = "select * from login where user='" + userName + "' and pass='" + userPass + "'";
		dao.query(sql, (err, results) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			if(results.length == 0) {
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/login?tip=1"
				});
				response.end();
			} else {
				request.session.userName = userName;
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=2"
				});
				response.end();
			}
		});
	});
}

exports.index = (request, response, next) => { //获取主页，及其所有数据
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = 2;
	if(request.query.list != null) id = parseInt(request.query.list);
	var sql = "select * from lists where type = 'child'";
	dao.query(sql, (err, left_result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		if(id == 1) {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			if(month < 10) month = "0" + month;
			if(day < 10) day = "0" + day;
			var now_date = year + "-" + month + "-" + day;
			sql = "select * from to_do where time='" + now_date + "' and isdelete=0 order by urgent desc,time asc";
		} else if(id == 2) sql = "select * from to_do where isdelete=0 order by urgent desc,time asc";
		else if(id == 3) sql = "select * from to_do where isdelete=1 order by urgent desc,time asc";
		else sql = "select * from to_do where list_id=" + id + " and isdelete=0 order by urgent desc,time asc";
		dao.query(sql, (err, right_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.render("index", {
				"lists": left_result,
				"contents": right_result,
				"list_flag": id
			});
		});
	});
}

exports.addThing = (request, response, next) => { //添加计划
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	var list_id = 2;
	if(request.query.list != null) list_id = parseInt(request.query.list);
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var title = fields.title;
		var urgent = parseInt(fields.urgent);
		var year = fields.year == null ? new Date().getFullYear() : fields.year;
		var month = fields.month == null ? new Date().getMonth() + 1 : fields.month;
		var day = fields.day == null ? new Date().getDate() : fields.day;
		if(month < 10) month = "0" + parseInt(month);
		if(day < 10) day = "0" + parseInt(day);
		var time = year + "-" + month + "-" + day;
		var sql = "insert into to_do values(null,?,?,?,?,0)";
		var params = [title, urgent, time, list_id];
		dao.add(sql, params, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=" + list_id
			});
			response.end();
		});
	});
}

exports.delete = (request, response, next) => { //删除计划
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = request.query.id;
	var list = request.query.list;
	var sql = "update to_do set isdelete=1 where id=?";
	dao.update(sql, [id], (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list
		});
		response.end();
	});
}

exports.remove = (request, response, next) => { //删除数据库内数据
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = request.query.id;
	var list = request.query.list;
	if(list == null || list == "") list = 3;
	var sql = "delete from to_do where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list
		});
		response.end();
	});
}

exports.addList = (request, response, next) => { //新建列表
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var listName = fields.listName;
		var sql = "insert into lists values(null,?,'child')";
		dao.add(sql, [listName], (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=" + result.insertId
			});
			response.end();
		});
	});
}

exports.search = (request, response, next) => { //搜索
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var search = fields.search;
		var sql = "select * from to_do where title like '%" + search + "%' and isdelete=0 order by urgent desc,time asc";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			sql = "select * from lists where type='child'";
			dao.query(sql, (err, resl) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.render("index", {
					"lists": resl,
					"contents": result,
					"list_flag": -1
				});
			});
		});
	});
}

exports.deleteList = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = parseInt(request.query.id);
	var sql = "delete from lists where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		sql = "delete from to_do where list_id=" + id;
		dao.remove(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.logout = (request, response, next) => { //退出登陆
	request.session.userName = null;
	response.writeHead(302, {
		"Location": "http://127.0.0.1:3000/login?tip=2"
	});
	response.end();
}