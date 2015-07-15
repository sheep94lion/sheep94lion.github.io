			;
			var xmlhttp;
			var h = [0, 0, 0, 0, 0];//四列的高度
			var xmlhttp_comment;
			var flag = 1;
			var flag_ginfo;
			var page = 1;
			var index = 1;
			var picid;
			var lat, lon;
			var pic_array_all = eval('[{"picname":"1.jpg","height":228,"position":{"latitude":10,"longitude":10}},{"picname":"2.jpg","height":359,"position":{"latitude":20,"longitude":20}},{"picname":"3.jpg","height":494,"position":{"latitude":30,"longitude":30}},{"picname":"4.jpg","height":257,"position":{"latitude":40,"longitude":40}},{"picname":"5.jpg","height":228,"position":{"latitude":50,"longitude":50}},{"picname":"6.jpg","height":227,"position":{"latitude":60,"longitude":60}},{"picname":"7.jpg","height":257,"position":{"latitude":70,"longitude":70}},{"picname":"8.jpg","height":243,"position":{"latitude":80,"longitude":80}},{"picname":"9.jpg","height":257,"position":{"latitude":0,"longitude":90}},{"picname":"10.jpg","height":335,"position":{"latitude":10,"longitude":100}},{"picname":"11.jpg","height":213,"position":{"latitude":20,"longitude":110}},{"picname":"12.jpg","height":343,"position":{"latitude":30,"longitude":120}},{"picname":"13.jpg","height":289,"position":{"latitude":40,"longitude":130}},{"picname":"14.jpg","height":228,"position":{"latitude":50,"longitude":140}},{"picname":"15.jpg","height":227,"position":{"latitude":60,"longitude":150}},{"picname":"16.jpg","height":228,"position":{"latitude":70,"longitude":160}},{"picname":"17.jpg","height":343,"position":{"latitude":80,"longitude":170}},{"picname":"18.jpg","height":343,"position":{"latitude":0,"longitude":0}},{"picname":"19.jpg","height":218,"position":{"latitude":10,"longitude":10}},{"picname":"20.jpg","height":248,"position":{"latitude":20,"longitude":20}},{"picname":"21.jpg","height":237,"position":{"latitude":30,"longitude":30}},{"picname":"22.jpg","height":213,"position":{"latitude":40,"longitude":40}},{"picname":"23.jpg","height":228,"position":{"latitude":50,"longitude":50}},{"picname":"24.jpg","height":257,"position":{"latitude":60,"longitude":60}},{"picname":"25.jpg","height":242,"position":{"latitude":70,"longitude":70}}]');//一开始加载的25张图片的信息
			function getLocation() {//获取位置信息
    			if (navigator.geolocation) {
        			navigator.geolocation.getCurrentPosition(solvePosition, showError);
    			} else { 
        			alert("浏览器不支持位置获取");
    			}
			}

			function solvePosition(position) {//获取位置信息成功后的处理函数
				flag_ginfo = 1;
     			lat = position.coords.latitude;
    			lon = position.coords.longitude;
    			for (var i = 0; i < pic_array_all.length; i++){
    				var dist = distance(lat, lon, pic_array_all[i].position.latitude, pic_array_all[i].position.longitude, 'K');
    				dist = Math.floor(dist);
    				$('#p' + (i + 1)).html(dist.toString() + "千米");
    			}
			}

			function showError(error) {//获取位置信息失败的处理函数
				flag_ginfo = 0;
    			switch(error.code) {
        		case error.PERMISSION_DENIED:
            		break;
        		case error.POSITION_UNAVAILABLE:
            		alert("无法获取位置信息");
            		break;
        		case error.TIMEOUT:
            		alert("获取位置信息超时");
            		break;
        		case error.UNKNOWN_ERROR:
            		alert("发生了未知错误");
            		break;
    			}
			}
			function distance(lat1, lon1, lat2, lon2, unit) {//根据经纬度计算两个地点之间的距离，来自http://www.geodatasource.com/developers/javascript
    			var radlat1 = Math.PI * lat1/180;
				var radlat2 = Math.PI * lat2/180;
				var radlon1 = Math.PI * lon1/180;
				var radlon2 = Math.PI * lon2/180;
    			var theta = lon1-lon2;
    			var radtheta = Math.PI * theta/180;
    			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
				dist = Math.acos(dist);
				dist = dist * 180/Math.PI;
				dist = dist * 60 * 1.1515;
				if (unit=="K") { dist = dist * 1.609344 }
				if (unit=="N") { dist = dist * 0.8684 }
    			return dist;
			}

			function clickpic(){//图片单击响应函数
				page = 1;
				//下面这片是定义大图展示界面的尺寸和位置（居中）
				$('#bigpic_pic_img').attr('src', this.src);
				$('#bigpic').css('height', $('#bigpic_pic_img').css('height'));
				$('#bigpic').css('left', (($(window).width()- $('#bigpic').width()) / 2).toString() + 'px');
				$('#bigpic').css('top', (($(window).height() - $('#bigpic').height()) / 2).toString() + 'px');
				$('#bigpic_pic_div').css('height', $('#bigpic_pic_img').css('height'));
				$('#bigpic_comment').css('height', $('#bigpic_pic_img').css('height'));
				$('#commenttext').css('height', ($('#bigpic_comment').height() - $('#turnpage').height()).toString() - 18 + 'px');
				$('#close').css('right', $('#bigpic').css('left'));
				$('#close').css('top', $('#bigpic').css('top'));
				$('.shelter').css('visibility', 'visible');
				$('#bigpic').css('visibility', 'visible');
				//下面获取评论 根据图片id获取对应评论，但此处只准备了第一张图片的评论，为所有图片公用。
				picid = 1;//var picid = parseInt($(this).attr('id'));
				xmlhttp_comment = new XMLHttpRequest();
				xmlhttp_comment.onreadystatechange = function(){
					if (xmlhttp_comment.readyState == 4 && xmlhttp_comment.status == 200){
						eval('var ocomment = ' + xmlhttp_comment.responseText);
						$('#pages').html(ocomment.nowpage.toString() + '/' + ocomment.allpages.toString());
						if (ocomment.nowpage == 1){
							$('#zuo').css('visibility', 'hidden');
						}else{
							$('#zuo').css('visibility', 'visible');
						}
						if (ocomment.nowpage == ocomment.allpages){
							$('#you').css('visibility', 'hidden');
						}else{
							$('#you').css('visibility', 'visible');
						}
						$('#commentsul').html('');
						var n = ocomment.list.length;
						if ($('#bigpic').height() < 380){
							n = 3;
						};
						if ($('#bigpic').height() < 280) {
							n = 2;
						};
						if ($('#bigpic').height() < 200) {
							n = 1;
						};
						for (var j = 0; j < n; j++){
							var date = ocomment.list[j].date;
							var date_s = date.year.toString() + "年" + date.month + "月" + date.day + "日";
							var li = document.createElement("li");
							var li_img = document.createElement("img");
							$(li_img).attr("class", "li_img").attr("src", "icon/" + ocomment.list[j].icon);
							$(li).append(li_img);
							$(li).append(ocomment.list[j].username + ' ' + date_s);
							$('#commentsul').append(li);
							li = document.createElement("li");
							$(li).html(ocomment.list[j].text);
							$('#commentsul').append(li);
						}
						

					}
				};
				var filename = 'comments/' + picid + '.' + page + '.json';
				xmlhttp_comment.open("GET", filename, true);
				xmlhttp_comment.send();
			}
			function addonepic(picname, height, plat, plon){//这个函数的作用是将图片picname插入到最短的一列
				var minid = 1;//找到最短的一列
				if (h[2] < h[minid]){
					minid = 2;
				}
				if (h[3] < h[minid]){
					minid = 3;
				}
				if (h[4] < h[minid]){
					minid = 4;
				}
				h[minid] += height;
				var image = document.createElement("img");
				$(image).attr('id', (parseInt(picname)).toString());
				$(image).attr('src', 'images/' + picname).attr('class', "waterfall-picitem").click(clickpic);
				$(image).load(function(){//加载后经过过渡动画呈现图片
					$(this).animate({width: "90%"});
					$('.waterfall-item').css('background-image', 'url()');
				});
				var div = document.createElement("div");
				$(div).attr('class', 'waterfall-item').append(image);
				var p = document.createElement('p');
				var dist = distance(lat, lon, plat, plon, 'K');
				dist = Math.floor(dist);
				if (flag_ginfo){
					var p_content = dist.toString() + '千米';
				}else{
					var p_content = "流年似水 留下美好瞬间";//获取位置信息失败时显示的内容
				}
				$(p).html(p_content).attr('class', 'distance').attr('id', 'p' + (parseInt(picname)).toString());
				$(div).append(p);
				$('#col' + minid).append(div);
			}
			addPrimaryPics = function(){//记载最初25张图片的函数
				$('#close').click(function(){
					$('.shelter').css('visibility', 'hidden');
					$('#bigpic').css('visibility', 'hidden')
					$('#zuo').css('visibility', 'hidden');
					$('#you').css('visibility', 'hidden');
				});
				setInterval(function(){//调整遮罩的大小，使其依然能覆盖整个body
					$('.shelter').css('height', $('body').css('height'));
				}, 500);
				$('#zuo').click(function(){//向前翻页
					if (page > 1){
						page--;
					}
					var filename = 'comments/' + picid + '.' + page + '.json';
					xmlhttp_comment.open("GET", filename, true);
					xmlhttp_comment.send();
				});
				$('#you').click(function(){//向后翻页
					page++;
					var filename = 'comments/' + picid + '.' + page + '.json';
					xmlhttp_comment.open("GET", filename, true);
					xmlhttp_comment.send();
				});
				getLocation();//获取位置
				for (var i = 0; i < pic_array_all.length; i++){
					var picname = pic_array_all[i].picname;
					var h = pic_array_all[i].height;
					addonepic(picname, h, pic_array_all[i].position.latitude, pic_array_all[i].position.longitude);
				}
			};
			window.onload = addPrimaryPics;//加载一开始的25张图片
			$(document).scroll(function(event){//检查是不是快到页面底部了
				if(flag == 0){return;}
				flag = 0;//在此次要加载的图片加载完成之前不再响应scroll事件。
				if (($(document).height() - document.body.scrollTop) < 1600){
					xmlhttp = new XMLHttpRequest();
					xmlhttp.onreadystatechange = function(){
						if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
							var pic_array_part = eval(xmlhttp.responseText);
							for(var i = 0; i < pic_array_part.length; i++){
								pic_array_all.push(pic_array_part[i]);
								addonepic(pic_array_part[i].picname, pic_array_part[i].height, pic_array_part[i].position.latitude, pic_array_part[i].position.longitude);
							}
							flag = 1;
						}
					}
					var s = 'data/' + index.toString() + '.json';
					xmlhttp.open("GET", s, true);
					xmlhttp.send();
					index++;
					if(index == 4){
						$(document).unbind();
						$('#loadingstat').html(">所有图片已加载完<");
					}
				}
				else{
					flag = 1;
				}
			});