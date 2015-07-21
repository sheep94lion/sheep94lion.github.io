var _canvas;
var _canvasContext = null;
var  _canvasBuffer;
var _canvasBufferContext;
var DrawInterval;
var gunPosition = 200;
var keystate = [];
var n_bullets = 0;

var gun;
var fish; //鱼的对象
var buffboxes = [];//宝箱数组
var bullets = [];

var lastbullettime = -100;

var doublegun = false;
var bullet_a = 0.2;
var bullet_a_normal = 0.2;
var bullet_a_buff = 0.5;
var bullet_a_debuff = -0.1;
var bullets_per_second = 10;
var bullets_per_second_normal = 10;
var bullets_per_second_buff = 15;
var bullets_per_second_debuff = 5;
var bullet_size = 7;
var bullet_size_normal = 7;
var bullet_size_buff = 14;
var bullet_size_debuff = 4;
var bullet_speed = 15;
var bullet_speed_normal = 15;
var bullet_speed_buff = 22;
var bullet_speed_debuff = 5;
var gun_rv = 0.04;

var img_buffbox;//宝箱图片资源
var img_fish; //鱼的图片
var img_gun;//枪的图片
var img_gunplatform;//枪台的图片

var GameLoop;//游戏主循环

var current_y=400; //鼠标纵坐标
var current_x=100; //鼠标横坐标
var fish_recation = 60; //鱼的速度，值越小速度越大
var fish_recation_normal = 60;
var fish_recation_buff = 25;
var fish_recation_debuff = 85;
var fish_stop = 6.5; //鱼的阻尼，值越小阻尼越大
var fish_stop_normal = 6.5;
var fish_speed_limit = 15;
var fish_stop_debuff = 16;
var fish_size = 35; //鱼的大小
var fish_size_normal = 35;
var fish_size_buff = 10;
var fish_size_debuff = 60;
var startBackColor = ranint(0,359);
var bg;
var width=window.innerWidth;//屏幕宽度高度
var height=window.innerHeight;
//游戏状态全局变量
var StartTime, TotalTime = 18000, TimeLeft;
var FishHealth = 100;
var BulletHurt = 10;
var BuffTime = 10000;
var BuffTimeLeft, BuffTimeStart;

$(window).load(function(){
	Start();
});

function StartMenu(callback){
	$('body').append('<canvas id="startBack"></canvas>');
	$('body').append('<div id="welcome_fish"></div>');
	$('body').append('<div id="welcome_boat"></div>');
	$('#welcome_boat').css("top", height/4+'px');
	$('#welcome_boat').css("left", width/3-100+'px');
	$('#welcome_fish').css("top", height/4+'px');
	$('#welcome_fish').css("right", width/3-100+'px');
	$('#startBack').css("position","absolute");
	$('#startBack').css("height",height);
	$('#startBack').css("width",width);
	$('body').append('<div class="title">'+"GUN AND FISH"+'</div><div id="startgame">'
		+'<div id="instructions">'+"INSTRUCTIONS"+'</div>'+
		'<div id="about">'+"ABOUT"+'</div>'+
		'<div id="startbutton" class="button">'+"START GAME"+'</div></div>');
	$('body').append('<div class="moreinfo" id="left"></div>');
	$('body').append('<div class="moreinfo" id="right"></div>');
	$('body').append('<div class="moreinfo" id="right2"></div>');
	$('body').append('<div id="footer">'+
			'<p><i>Copyright © 2015 <a href="https://xujingao13.github.io" target="_blank" title="Jingao Xu">'+
			'<strong>Jingao Xu</strong></a> &amp; '+
			'<a href="http://sheep94lion.github.io" target="_blank" title="Yi Zhao"><strong>Yi Zhao</strong></a></i>'+
			'</p></div>');
	$('#footer').css("top", height-150+'px');
	$('#footer').css("width", width+'px');
	$('#startgame').css('left',width/2-200+'px');
	$('#startgame').css('top',height/2-100+'px');
	$('#left').css('left','20px');
	$('#left').css('width',width/2-240+'px');
	$('#left').css('top',height/2-100+'px');
	$('#right').css('left',width/2+220+'px');
	$('#right').css('width',width/2-240+'px');
	$('#right').css('top',height/2-100+'px');
	$('#right2').css('left',width/2+220+'px');
	$('#right2').css('width',width/2-240+'px');
	$('#right2').css('top',height/2-100+'px');
	$('#right2').css('padding-top',0+'px');
	$('.title').css('top',height/2-300+'px');
	$('.title').css('left',width/2-$('.title').width()/2+'px');

	var start_canvas = $('#startBack')[0];
	var start_cv = start_canvas.getContext("2d");
	var timer = setInterval(function(){
		drawBackGround(start_cv);
	}, 1000/60);
	$('#left').append('<b style="font-size:22px;"><p>INSTRUCTION</p></b>'+
		'<p>一位玩家用鼠标控制鱼，另一位玩家控制枪炮</p>'+
		'<p>如果时间到了,鱼没有死则鱼方获胜,如果鱼已经死了则炮放获胜</p>'+
		'<p>在游戏过程中会随机掉落宝箱,接到有惊喜！</p>');
	$('#right').append('<b style="font-size:22px;"><p>ABOUT US</p></b>'+
		'<p>徐京傲 xujingao13@gmail.com</p>'+
		'<p>赵毅 1111@1111.com</p>'+
		'<p>Thanks for playing, wish a good Day!</p>');

	$('#instructions').mouseenter(function()
	{
		$('#instructions').css('background','#1954c0');
		$('#left').fadeIn(500);
	});
	$('#instructions').mouseleave(function()
	{
		$('#instructions').css('background','#3369cd');
		$('#left').fadeOut(300);
	});
	$('#about').mouseenter(function()
	{
		$('#about').css('background','#1954c0');
		$('#right').fadeIn(500);
	});
	$('#about').mouseleave(function()
	{
		$('#about').css('background','#3369cd');
		$('#right').fadeOut(300);
	});
	$('.button').click(function(){
		$('#startgame').remove();
		$('.title').remove();
		$('#startBack').remove();
		$('#footer').remove();
		$('#welcome_fish').remove();
		$('#welcome_boat').remove();
		window.clearInterval(timer);
		callback();
	});
}
function Start(){
	$(window).keydown(function(e){
		keystate[e.which] = 1;
		e.preventDefault();
	});
	$(window).keyup(function(e){
		keystate[e.which] = 0;
		e.preventDefault();
	});
	document.addEventListener('mousemove', function(e){
		current_x = e.x;
		current_y = e.y;
	});
	_canvas = document.getElementById('canvas');
	if (_canvas && _canvas.getContext){
		_canvasContext = _canvas.getContext('2d');
		_canvasBuffer = document.createElement('canvas');
		_canvasBuffer.width = _canvas.width;
		_canvasBuffer.height = _canvas.height;
		_canvasBufferContext = _canvasBuffer.getContext('2d');
	}
	Initialize();
	LoadContentAndStartMenu();
};
function ranint(a,b){
	return Math.floor(a+(b-a+1)*Math.random());
}
function Initialize(){
	gun = new GameElement('gun');
	fish = new GameElement("fish");
	DrawInterval = 1000 / 60;
		//Initialize all game variables
};
function LoadContentAndStartMenu(){
	//load content - graphics, sound etc.
	//since all content is loaded run main game loop
	//Calls RunGameLoop meithod every 'draw interval'
	async.parallel([
		function(callback){
			img_buffbox = new Image();
			img_buffbox.src = "images/buffbox.png";
			$(img_buffbox).load(function(){callback()});
		},
		function(callback){
			img_fish = new Image();
			img_fish.src = "images/fish.png";
			$(img_fish).load(function(){callback()});
		},
		function(callback){
			img_gun = new Image();
			img_gun.src = "images/gun.png";
			$(img_gun).load(function(){callback()});
		},
		function(callback){
			img_gunplatform = new Image();
			img_gunplatform.src = "images/gunplatform.png";
			$(img_gunplatform).load(function(){callback()});
		},
		function(callback){
			StartMenu(callback);
		},
		function(callback){
			$('#greenhit').load(function(){callback()});
			$('#greenhit').trigger('load');
		},
		function(callback){
			$('#blackhit').load(function(){callback()});
			$('#blackhit').trigger('load');
		},
		function(callback){
			$('#gunshoot').load(function(){callback()});
			$('#gunshoot').trigger('load');
		},
		function(callback){
			$('#counting').load(function(){callback()});
			$('#counting').trigger('load');
		},
		function(callback){
			$('#background').load(function(){callback()});
			$('#background').trigger('load');
		},
		function(callback){
			$('#hitbox').load(function(){callback()});
			$('#hitbox').trigger('load');
		}
		], 
		function(err, results){
			if(err){
				alert("载入资源失败，请刷新重试");
			}else{
				StartTime = $.now();
				$('#background').trigger('play');
				GameLoop = setInterval(RunGameLoop, DrawInterval);
			}
		}
	);
};
function RunGameLoop(){
	_canvas.width = window.innerWidth;
	_canvas.height = window.innerHeight;
	_canvasBuffer.width = window.innerWidth;
	_canvasBuffer.height = window.innerHeight;
	gunPosition = window.innerHeight / 2;
	Update();
	Check();
	Draw();
};
function Update(){
	//update game varibles, handle user input, perform calculattions etc
	TimeLeft = TotalTime - ($.now() - StartTime);
	BuffTimeLeft = BuffTime - ($.now() - BuffTimeStart);
	//更新游戏
	//更新子弹
	var bullets_new = [];
	for (var i = 0; i < bullets.length; i++){
		if (bullets[i].x <= _canvas.width && bullets[i].y <= _canvas.height && bullets[i].x >= 0 && bullets[i].y >= 0){
			bullets_new.push(bullets[i]);
		}
	}
	bullets = bullets_new;
	if(keystate[32] === 1 && $.now() - lastbullettime >= 1000 / bullets_per_second){
		lastbullettime = $.now();
		var bullet = new GameElement('bullet');
		n_bullets++;
		if(n_bullets % 10 === 0){
			bullet.bullettype = 'green';
		}
		bullet.x = 90 * Math.cos(gun.di);
		bullet.y = gunPosition + 90 * Math.sin(gun.di);
		bullet.vx = bullet_speed * Math.cos(gun.di);
		bullet.vy = bullet_speed * Math.sin(gun.di);
		bullet.size = bullet_size;
		bullets.push(bullet);
		if(doublegun){
			var bullet2 = new GameElement('bullet');
			bullet2.x = 90 * Math.cos(gun.di);
			bullet2.y = gunPosition + 40 + 90 * Math.sin(gun.di);
			bullet2.vx = bullet_speed * Math.cos(gun.di);
			bullet2.vy = bullet_speed * Math.sin(gun.di);
			bullet2.size = bullet_size;
			bullets.push(bullet2);
		}
	}
	var dist, speed;
	
	for (var i = 0; i < bullets.length; i++){
		dist = Math.sqrt((fish.x - bullets[i].x) * (fish.x - bullets[i].x) + (fish.y - bullets[i].y) * (fish.y - bullets[i].y));
		bullets[i].ax = bullet_a * (fish.x - bullets[i].x) / dist;
		bullets[i].ay = bullet_a * (fish.y - bullets[i].y) / dist;
		if (bullet_a != bullet_a_debuff){
			speed = Math.sqrt((bullets[i].vx)*(bullets[i].vx)+(bullets[i].vy)*(bullets[i].vy));
			bullets[i].vx = bullets[i].vx * bullet_speed / speed;
			bullets[i].vy = bullets[i].vy * bullet_speed / speed;
		}
	}
	//更新宝箱
	var buffboxes_new = [];
	for (var i = 0; i < buffboxes.length; i++){
		if (buffboxes[i].x <= _canvas.width && buffboxes[i].y <= _canvas.height && buffboxes[i].x >= 0 && buffboxes[i].y >= 0){
			buffboxes_new.push(buffboxes[i]);
		}
	}
	buffboxes = buffboxes_new;
	var randomint = Math.floor(Math.random() * 1250);
	if (randomint === 7){
		var buffbox = new GameElement('buffbox');
		buffbox.x = _canvas.width * 0.2 + _canvas.width * 0.7 * Math.random();
		buffbox.y = 20;
		buffbox.size = 25;
		buffbox.vy = 1.5;
		buffboxes.push(buffbox);
	}
	UpdateElem(gun);
	UpdateElem(fish);
	for(var i = 0; i < bullets.length; i++){
		UpdateElem(bullets[i]);
	}
	for (var i = 0; i < buffboxes.length; i++){
		UpdateElem(buffboxes[i]);
	}
};
function Check(){
	//检查游戏是否结束
	if(FishHealth === 0)
		alert("鱼已死，勿念");
	if(TimeLeft <= 11000){
		$('#counting').trigger('play');
		$('#counting').unbind('play');
	}
	//检查鱼和子弹有没有碰撞
	var bullets_new = [];
	for (var i = 0; i  < bullets.length; i++){
		if (ifCollision(fish, bullets[i])){
			if(bullets[i].bullettype == 'black'){
				SoundEffect('blackhit');
				FishHealth -= BulletHurt;
			} else{
				SoundEffect('greenhit');
				FishHealth += BulletHurt;
				if(FishHealth >= 100){
					FishHealth = 100;
				}
			}
		}else{
			bullets_new.push(bullets[i]);
		}
	}
	bullets = bullets_new;
	//检查鱼和宝箱有没有碰撞
	var buffboxes_new = [];
	for (var i = 0; i < buffboxes.length; i++){
		if(ifCollision(fish, buffboxes[i])){
			SoundEffect('greenhit');
			BuffTimeStart = $.now();
			if(Math.random() < 0.5){
				Buff('fish');
			}else{
				Debuff('gun');
			}
		}else{
			buffboxes_new.push(buffboxes[i]);
		}
	}
	buffboxes = buffboxes_new;
	bullets_new = [];
	buffboxes_new = [];
	//检查子弹和宝箱有没有碰撞
	for (var i = 0; i < buffboxes.length; i++){
		for (var j = 0; j < bullets.length; j++){
			if (ifCollision(buffboxes[i], bullets[j])){
				SoundEffect('hitbox');
				BuffTimeStart = $.now();
				buffboxes[i].size = 0;
				bullets[j].size = 0;
				if(Math.random() < 0.5){
					Buff('gun');
				}else{
					Debuff('fish');
				}
				break;
			}
		}
	}
	for(var i = 0; i < bullets.length; i++){
		if(bullets[i].size != 0){
			bullets_new.push(bullets[i]);
		}
	}
	bullets = bullets_new;
	for(var i = 0; i < buffboxes.length; i++){
		if(buffboxes[i].size != 0){
			buffboxes_new.push(buffboxes[i]);
		}
	}
	buffboxes = buffboxes_new;
}
function Draw(){
	_canvasBufferContext.clearRect(0, 0, _canvasBuffer.width, _canvasBuffer.height);
	_canvasContext.clearRect(0, 0, _canvas.width, _canvas.height);
	drawBackGround(_canvasBufferContext);
	drawInformation();
	drawCursor();
	fish.drawElem();
	gun.drawElem();
	for(var i = 0; i < bullets.length; i++){
		bullets[i].drawElem();
	}
	for(var i = 0; i < buffboxes.length; i++){
		buffboxes[i].drawElem();
	}
	_canvasContext.drawImage(_canvasBuffer, 0, 0);
	//draw game frame
};

function Buff(name){
	is_buff = true;
	if(name == 'gun'){
		switch(Math.floor(Math.random() * 1000) % 5){
		case 0:
			bullet_size = bullet_size_buff;
			setTimeout(function(){bullet_size = bullet_size_normal;}, BuffTime);
			break;
		case 1:
			bullet_speed = bullet_speed_buff;
			setTimeout(function(){bullet_speed = bullet_speed_normal;}, BuffTime);
			break;
		case 2:
			bullets_per_second = bullets_per_second_buff;
			setTimeout(function(){bullets_per_second = bullets_per_second_normal;}, BuffTime);
			break;
		case 3:
			doublegun = true;
			setTimeout(function(){doublegun = false;}, BuffTime);
			break;
		case 4:
			bullet_a = bullet_a_buff;
			setTimeout(function(){bullet_a = bullet_a_normal;}, BuffTime);
			break;
		}
	} else{
		switch(Math.floor(Math.random() * 1000) % 2){
		case 0:
			fish_size = fish_size_buff;
			setTimeout(function(){fish_size = fish_size_normal;}, BuffTime);
			break;
		case 1:
			fish_recation = fish_recation_buff;
			setTimeout(function(){fish_recation = fish_recation_normal;}, BuffTime);
			break;
		}
	}
}

function Debuff(name){
	is_buff = true;
	if(name == 'gun'){
		switch(Math.floor(Math.random() * 1000) % 4){
		case 0:
			bullet_size = bullet_size_debuff;
			setTimeout(function(){bullet_size = bullet_size_normal;}, BuffTime);
			break;
		case 1:
			bullet_speed = bullet_speed_debuff;
			setTimeout(function(){bullet_speed = bullet_speed_normal;}, BuffTime);
			break;
		case 2:
			bullets_per_second = bullets_per_second_debuff;
			setTimeout(function(){bullets_per_second = bullets_per_second_normal;}, BuffTime);
			break;
		case 3:
			bullet_a = bullet_a_debuff;
			setTimeout(function(){bullet_a = bullet_a_normal;}, BuffTime);
			break;
		}		
	} else{
		switch(Math.floor(Math.random() * 1000) % 2){
		case 0:
			fish_size = fish_size_debuff;
			setTimeout(function(){fish_size = fish_size_normal;}, BuffTime);
			break;
		case 1:
			fish_stop = fish_stop_debuff;
			setTimeout(function(){fish_stop = fish_stop_normal;}, BuffTime);
			break;
		}
	}

}
function SoundEffect(soundname){
	if(soundname == 'gunshoot'){
		$('#gunshoot').trigger('play');
	}else if(soundname == 'blackhit'){
		$('#blackhit').trigger('play');
	}else if(soundname == 'greenhit'){
		$('#greenhit').trigger('play');
	}else if(soundname == 'hitbox'){
		$('#hitbox').trigger('play');
	}
}

function GameElement(classname){
	this.classname = classname;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.di = 0;
	this.ax = 0; 
	this.ay = 0;
	this.rv = 0;
	this.size = 0;
	this.bullettype = 'black';
	if (classname == 'gun'){
		this.drawElem = drawGun;
	}
	else if (classname == 'fish'){
		this.drawElem = drawFish;
	}
	else if (classname == 'bullet'){
		this.drawElem = drawBullet;
	}
	else if (classname == 'buffbox'){
		this.drawElem = drawBuffbox;
	}
}

function UpdateElem(item){
	if (item.classname == 'gun'){
		if(keystate[38] === 1){
			item.rv = -gun_rv;
			if(item.di <= -Math.PI/2){
				item.rv = 0;
			}
		}else if (keystate[40] === 1){
			item.rv = gun_rv;
			if(item.di >= Math.PI/2){
				item.rv = 0;
			}
		}else{
			item.rv = 0;
		}
		item.di += item.rv;
	} 
	else if (item.classname == 'fish'){
		item.size = fish_size;
		item.ax=(current_x+item.size * 2-(item.x+item.size * 2*Math.cos(item.di)))-item.vx/fish_stop;
		item.ay=(current_y-item.size-(item.y+item.size*2*Math.sin(item.di)))-item.vy/fish_stop;
		item.vx+=item.ax;
		if(item.vx > fish_speed_limit * fish_recation){
			item.vx = fish_speed_limit * fish_recation;
		}
		else if(item.vx < -fish_speed_limit * fish_recation){
			item.vx = -fish_speed_limit * fish_recation;
		}
		item.vy+=item.ay;
		if(item.vy > fish_speed_limit * fish_recation){
			item.vy = fish_speed_limit * fish_recation;
		}
		if(item.vy < -fish_speed_limit * fish_recation){
			item.vy = -fish_speed_limit * fish_recation;
		}
		item.x+=item.vx/fish_recation;
		item.y+=item.vy/fish_recation;
		if(item.x > _canvas.width){
			item.x = _canvas.width;
		}
		if(item.y > _canvas.height){
			item.y = _canvas.height;
		}
		item.di=-(Math.atan2(100,-(current_y-(item.y+item.size*2*Math.sin(item.di))))-Math.PI/2);
	}
	else if (item.classname == 'bullet'){
		item.x += item.vx;
		item.y += item.vy;
		item.vx += item.ax;
		item.vy += item.ay;
	}
	else if (item.classname == 'buffbox'){
		item.x += item.vx;
		item.y += item.vy;
	}
}
function hsvToRGB(h,s,v){
	var select = Math.floor(h/60);
	var f = h/60 - select;
	var u = Math.floor(255*v);
	var p = Math.floor(255*v*(1-s));
	var q = Math.floor(255*v*(1-f*s));
	var t = Math.floor(255*v*(1-(1-f)*s));
	var res=[
			{r:u,g:t,b:p},
			{r:q,g:u,b:p},
			{r:p,g:u,b:t},
			{r:p,g:q,b:u},
			{r:t,g:p,b:u},
			{r:u,g:p,b:q}
	];
	return res[select];
}
function drawBackGround(cv){	
	var b=hsvToRGB((startBackColor+$.now()/100)%360,0.14,0.92);//上方低饱和度颜色
	var c=hsvToRGB((startBackColor+$.now()/100)%360,0.57,0.77);//下方高饱和度颜色
	bg=cv.createLinearGradient(0,0,0,height);
	bg.addColorStop(0,'rgb('+b.r+','+b.g+','+b.b+')');
	bg.addColorStop(1,'rgb('+c.r+','+c.g+','+c.b+')'); 
	cv.save();
	cv.fillStyle=bg;
	cv.fillRect(0,0,width,height);
	cv.restore();
}
function drawInformation(){
	_canvasBufferContext.save();
	var txt = "FishHealth: "
	for(var i = 0; i < FishHealth/10; i++){
		txt+='❤';
	}
	txt += "   TimeLeft: ";
	txt += Math.floor(TimeLeft/1000);
	txt += "s";
	if(BuffTimeLeft > 0){
		txt += "   BuffTimeLeft: ";
		txt += Math.floor(BuffTimeLeft/1000);
		txt += "s";
	}
	_canvasBufferContext.font = "20px Arial";
	_canvasBufferContext.fillStyle='rgba(221,51,85,0.5)';
	_canvasBufferContext.fillText(txt,30,30);
	_canvasBufferContext.restore();
}
function drawGun(){
	_canvasBufferContext.save();
	_canvasBufferContext.translate(0, gunPosition);
	_canvasBufferContext.rotate(this.di);
	_canvasBufferContext.drawImage(img_gun, 0, -22.5);
	if(doublegun){
		_canvasBufferContext.drawImage(img_gun, 0, 40 - 22.5);
	}
	_canvasBufferContext.restore();
	_canvasBufferContext.drawImage(img_gunplatform, -40, gunPosition - 40);	
	if(doublegun){
		_canvasBufferContext.drawImage(img_gunplatform, -40, gunPosition);
	}
}
//画鱼
function drawFish(){
	var size = this.size;
	var x = this.x;
	var y = this.y;
	var di = this.di;
	_canvasBufferContext.save();
	_canvasBufferContext.translate(x, y);
	_canvasBufferContext.rotate(di);
	_canvasBufferContext.drawImage(img_fish, -size, -size, 2 * size, 2 * size);
	_canvasBufferContext.restore();
}
//画鼠标十字
function drawCursor(){
	$('html').css({cursor:'none'});
	_canvasBufferContext.save();
	_canvasBufferContext.beginPath();
	_canvasBufferContext.lineWidth = 1;
	_canvasBufferContext.strokeStyle = "#000";
	_canvasBufferContext.shadowOffsetX = 2;
	_canvasBufferContext.shadowOffsetY = 2;
	_canvasBufferContext.shadowBlur = 2;
	_canvasBufferContext.shadowColor = '#888';
	var u = 10;
	_canvasBufferContext.moveTo(current_x-2*fish.size-u,current_y);
	_canvasBufferContext.lineTo(current_x-2*fish.size+u,current_y);
	_canvasBufferContext.moveTo(current_x-2*fish.size,current_y-u);
	_canvasBufferContext.lineTo(current_x-2*fish.size,current_y+u);
	_canvasBufferContext.stroke();
	_canvasBufferContext.restore();
}
function drawBullet(){
	var bulletpath = new Path2D();
	bulletpath.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	if(this.bullettype == 'black'){
		_canvasBufferContext.fillStyle = "#000000";
	}else{
		_canvasBufferContext.fillStyle = "#00ff00";
	}
	
	_canvasBufferContext.fill(bulletpath);	
}

function drawBuffbox(){
	_canvasBufferContext.drawImage(img_buffbox, this.x - 29, this.y - 20);
}

function ifCollision(e1, e2){//判断两元素是否碰撞
	var dx = e1.x - e2.x;
	var dy = e1.y - e2.y;
	var dis = Math.sqrt(dx * dx + dy * dy);
	return (dis < e1.size + e2.size - 3);
}