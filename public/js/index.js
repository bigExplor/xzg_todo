function showList() {
	var addList = document.getElementById("addList");
	if(addList.style.display == 'none') addList.style.display = "block";
	else addList.style.display = 'none';
}

function showThing() {
	$("#cover").show();
	$("#addThing").show();
}

function hideAll() {
	$("#addThing").hide();
	$("#cover").hide();
}

function check_list() {
	if(document.getElementById("listName").value == "") return false;
	return true;
}

function check_search() {
	if(document.getElementById("search").value == "") return false;
	return true;
}

function deleteThing(id, list) {
	location.href = "/delete?id=" + id + "&list=" + list;
	return;
}

function removeThing(id) {
	location.href = "/remove?id=" + id;
	return;
}

function getDay(year, month) {
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) days[1]++;
	return days[month - 1];
}

function check_thing() {
	var title = document.getElementById("title").value;
	var year = document.getElementById("year").value;
	var month = document.getElementById("month").value;
	var day = document.getElementById("day").value;
	var thing_tip = document.getElementById("thing_tip");
	if(title == "") {
		thing_tip.innerHTML = "请输入正确的标题";
		return false;
	}
	if(year == "" || isNaN(year) || year < 1000 || year > 10000) {
		thing_tip.innerHTML = "请输入正确的年份";
		return false;
	}
	if(month == "" || isNaN(month) || month < 1 || month > 12) {
		thing_tip.innerHTML = "请输入正确的月份";
		return false;
	}
	if(day == "" || isNaN(day) || day < 1 || day > getDay(year, month)) {
		thing_tip.innerHTML = "请输入正确的日期";
		return false;
	}
	return true;
}
