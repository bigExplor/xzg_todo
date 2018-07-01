function check() {
	if(document.getElementById("userName").value == "") {
		document.getElementById("tip").innerHTML = "请输入合法的账号";
		return false;
	}else if(document.getElementById("userPass").value == ""){
		document.getElementById("tip").innerHTML = "请输入合法的密码";
		return false;
	}
	return true;
}