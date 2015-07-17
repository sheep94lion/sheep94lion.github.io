;
var namelist;//在线用户列表
var myFirebaseRef = new Firebase("https://shining-fire-9708.firebaseio.com/");
var myNamelistRef = myFirebaseRef.child('namelist');
var mayNameRef;
var myName;
var myMessageRef = myFirebaseRef.child('message');
window.onload = function(){
	inputName();
	myNamelistRef.on('value', function(snapshot){
		namelist = snapshot.val();
		updateNamelist();
	}, function(e){
		alert("加载用户列表失败\n错误信息：\n" + e);
	});
	myMessageRef.on('child_added', function(snapshot){
		var message = snapshot.val();
		var name = message.name;
		var text = message.text;
		if (name != "管理员"){
			p = document.createElement('p');
			$(p).html(name + ':' + text);
			$('#messagebox').append(p);
		}
	});
};
function updateNamelist(){//刷新用户列表
	$('#namelist_ul').html('');
	for (var key in namelist){
		if (namelist.hasOwnProperty(key)){
			value = namelist[key];
			if (value != "管理员"){//“管理员”用来保证数据库中该项不为空
			var li = document.createElement('li');
			$(li).html(value);
			$('#namelist_ul').append(li);
			}
		}
	}
};
function inputName(){//展开输入昵称界面
	$('#inputname').css('left', (($(window).width() - 400) / 2).toString() + 'px');//确定窗口位置，使其居中
	$('#inputname').css('top', (($(window).height() - 300) / 2).toString() + 'px');
	$('.shelter').css('visibility', 'visible');
	$('#inputname').css('visibility', 'visible').animate({opacity: '1'});
};
function submitName(){//提交昵称
	var name = $('#nickname').val();
	var newnameRef = null;
	if (name === ''){
		$('#nametips').html("您不可以什么都不填哦~亲~");
	} else if (ifExist(name)){
		$('#nametips').html("该昵称已被占用，请重新输入");
	} else{
		$('#nametips').html("请稍候");
		var p = new Promise(function(resolve, reject){
			newnameRef = myNamelistRef.push(name, function(e){
				if(e){
					alert("啊哦，出错了，请刷新重试");
				}
				else{
					resolve(name);
				}
			});
		});
		p.then(function(name){//成功push之后再次检查列表是否有重名，从而避免两台机器同时用相同昵称登录时出现重名的情况
			myNamelistRef.once('value', function(snapshot){
				namelist = snapshot.val();
				for (var key in namelist){
					if (namelist.hasOwnProperty(key)){
						if (namelist[key] == name){
							if (key != newnameRef.key()){
								newnameRef.remove();
								$('#nametips').html("该昵称已被占用，请重新输入");
							}else{
								$('#inputname').animate({opacity: '0'});
								$('#inputname').css('visibility', 'hidden');
								$('.shelter').css('visibility', 'hidden');
								myName = name;
								newnameRef.onDisconnect().remove();
							}
							break;
						}
					}
				}
			});
		});
	}
}
function ifExist(name){//在本地列表中检查昵称是否已存在
	for (var key in namelist){
		if (namelist.hasOwnProperty(key)){
			if(namelist[key] == name){
				return true;
			}
		}
	}
	return false;
};
function send(){//发送消息
	var message = {};
	message.name = myName;
	message.text = $('#messagetext').val();
	myMessageRef.push(message, function(e){
		if (e){
			alert("发送失败");
		}else{
			$('#messagetext').val('');
		}
	})
}
