;
var namelist;//在线用户列表
var myFirebaseRootRef = new Firebase("https://shining-fire-9708.firebaseio.com/");
var myFirebaseRef;
var myNameRef;
var myName;
var chatroom = 1;//一共四个聊天室，默认进入1聊天室。
var myMessageRef;
window.onload = function(){
	inputName();
	init();
};
function init(){
	myFirebaseRef = myFirebaseRootRef.child(chatroom.toString());
	myNamelistRef = myFirebaseRootRef.child('namelist');
	myMessageRef = myFirebaseRef.child('message');
	myNamelistRef.on('value', function(snapshot){//在线列表信息获取
		namelist = snapshot.val();
		updateNamelist();
	}, function(e){
		alert("加载用户列表失败\n错误信息：\n" + e);
	});
	myMessageRef.on('child_added', function(snapshot){//消息数据获取
		var message = snapshot.val();
		var name = message.name;
		var text = message.text;
		if (name != "管理员"){
			p = document.createElement('p');
			$(p).html(name + ':' + text);
			$('#messagebox').append(p);
			var h = document.getElementById("messagebox").scrollHeight;
			$("#messagebox").animate({scrollTop: h.toString()}, 300);//滚动到底部
		}
	});
};
function updateNamelist(){//刷新用户列表
	$('#namelist_ul').html('');
	for (var key in namelist){
		if (namelist.hasOwnProperty(key)){
			value = namelist[key].name;
			roomnumber = namelist[key].roomnumber;
			if (value != "管理员" && roomnumber == chatroom){//“管理员”用来保证数据库中该项不为空
			var li = document.createElement('li');
			$(li).html(value);
			$('#namelist_ul').append(li);
			}
		}
	}
};
function inputName(){//展开输入昵称界面，利用Promise设定过渡效果顺序,避免callback hell
	$('#inputname').css('left', (($(window).width() - 400) / 2).toString() + 'px');//确定窗口位置，使其居中
	$('#inputname').css('top', (($(window).height() - 300) / 2).toString() + 'px');
	$('.shelter').css('visibility', 'visible');
	var p = new Promise(function(resolve, reject){
		$('.shelter').animate({opacity: '0.7'}, 'fast', 'linear', function(){
			resolve(1);
		});
	});
	p.then(function(v){
		$('#inputname').css('visibility', 'visible').animate({opacity: '1'}, 'normal');
	});
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
			newnameRef = myNamelistRef.push({'roomnumber': chatroom, 'name': name}, function(e){
				if(e){
					alert("啊哦，出错了，请刷新重试");
				}
				else{
					resolve(name);
				}
			});
		});
		p.then(function(name){//异步操作：成功push之后再次检查列表是否有重名，从而避免两台机器同时用相同昵称登录时出现重名的情况
			myNamelistRef.once('value', function(snapshot){
				var flag = 1;
				snapshot.forEach(function(childsnapshot){
					var childData = childsnapshot.val();
					var key = childsnapshot.key();
					if (childData.name == name && flag){
						flag = 0;
						if (key != newnameRef.key()){
								newnameRef.remove();
								$('#nametips').html("该昵称已被占用，请重新输入");
						}else{
							$('#inputname').animate({opacity: '0'}, 'normal', 'linear', function(){
								$('#inputname').css('visibility', 'hidden');
								$('.shelter').animate({opacity: '0'}, 'normal', 'linear', function(){
									$('.shelter').css('visibility', 'hidden');
								});
							});//淡出效果（异步操作）
							myName = name;
							newnameRef.onDisconnect().remove();
							myNameRef = newnameRef;
						}
					}
				});
			});
		});
	}
}
function ifExist(name){//在本地列表中检查昵称是否已存在
	for (var key in namelist){
		if (namelist.hasOwnProperty(key)){
			if(namelist[key].name == name){
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
	});
}
function enterChatroom(i){//进入聊天室i，
	$('#roomtips').html('聊天室' + i + '在线列表');
	//处理当前所在聊天室的数据
	chatroom = i;
	$('#messagebox').html('');
	//清除现有的Ref响应
	myFirebaseRef.off();
	myMessageRef.off();
	//添加新的Ref响应（namelist只维护一个，只需更新message数据库即可）
	myFirebaseRef = myFirebaseRootRef.child(chatroom.toString());
	myMessageRef = myFirebaseRef.child('message');
	myMessageRef.on('child_added', function(snapshot){//消息数据获取
		var message = snapshot.val();
		var name = message.name;
		var text = message.text;
		if (name != "管理员"){
			p = document.createElement('p');
			$(p).html(name + ':' + text);
			$('#messagebox').append(p);
			var h = document.getElementById("messagebox").scrollHeight;
			$("#messagebox").animate({scrollTop: h.toString()}, 300);//滚动到底部
		}
	});
	myNameRef.update({roomnumber: i},function(e){
		if(e){
			alert("切换聊天室失败，请刷新重试");
		}else{
			updateNamelist();
		}
	});
};
