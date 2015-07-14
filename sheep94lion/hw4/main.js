function $(arg) {
	var a = document.querySelectorAll(arg);
	if (a.length == 0) {//找到0个元素

		return null;
	};
	if (a.length == 1) {//找到一个元素
		return a[0];
	};
	//找到多个元素
	return  a;
}
Element.prototype.attr = function () {//输入一个或两个参数，且均为字符串。
	if (arguments.length == 1){//访问属性值
		if ((typeof arguments[0]) != 'string'){//检查参数类型
			console.info('wrong parameter type');
			return null;
		}
		var result = this.getAttribute(arguments[0]);
		if (result == null || result == '') {//属性不存在
			return null;
		} else{ //属性存在
			return result;
		};
	}
	else if (arguments.length == 2) {//设置属性值
		if ((typeof arguments[0]) != 'string' || (typeof arguments[1]) != 'string'){//检查参数类型
			console.info('wrong parameter type')
			return null;
		}
		this.setAttribute(arguments[0], arguments[1]);
	}
	else{
		console.info('Too many parameters');
		return null;
	}
};
document.addEventListener('scroll', function(){
	if ($)
})