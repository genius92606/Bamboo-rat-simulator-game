var phaserwidth = window.innerWidth;
var phaserheight = window.innerHeight;

var day = 1;
var trigger = {ach:0,end:0,set:0,mood:0,eat:0};
var gameTimer = 0;
var gameTimer2 = 0;
var gameTimer3 = 0;
var collide_num = 0;
var rat_life;
var rat_mood = 0;
var rat_jump = 0;
var move_num;
var up_num;
var device_type;
var i;
var rat_scale = 0.7;
var bar_input = 20;
var bar_type = 1;
var bar_value = [50,50,50,50];
var event_id = 0;
var content_data=[
["有朋自遠方來","今天主人的朋友來參觀農場，快要經過我的籠子了，我該怎麼辦?","開始大聲嚶嚶嚶的叫","安靜的在角落磨牙","主人和朋友注意到我把我抓起來把玩一番","平安度過",[0,0,5,20],[0,5,-10,0]],
["竹鼠聖誕交換禮物","聖誕節快到了，竹鼠們辦了交換禮物大會，面前剩下兩個禮物，你要選哪個?","紅色大禮物","綠色小禮物","裡面是個等身竹鼠玩偶","一根磨牙棒",[0,0,20,10],[10,10,10,0]],
["abv","def","ghi","kjl","end1","end2",[0,-10,-10,-20],[-30,0,0,10]]
];


function dowm() {
    switch (this.key) {
        case "end":
            trigger.end =1;
            break;
        default:
            break;
    }
};
function up() {
    switch (this.key) {
		case "ach":
			$("#cover").show();
			$("#setting").show();
			$("#return").show();
			$("#achieve").show();
			break;
        case "end":
            trigger.end = 0;
            break;
        case "set":
			$("#cover").show();
			$("#setting").show();
			$("#return").show();
            break;
        case "mood":
			$("#main").hide();
			game.state.start('littlegame');
            break;
		case "eat":
			$("#main").hide();
			game.state.start('spin');
			break;
        default:
            break;
    }       
};
function deviceType() {
	if(navigator.userAgent.match(/mobile/i)) {
		device_type = 0;
		var atemp = document.getElementById('a1');
		atemp.setAttribute('id','a3');
		document.getElementById("game").style.marginTop = phaserheight-(720*phaserwidth/420)+"px";
	} else {
		device_type = 1;
		$("#status").css({"width":"420px","height":"160px"});
		$("#day").css({"top":"90px","left":"300px","font-size":"1.8em"});
		$("#ratname").css({"position":"absolute","top":"668px","left":"190px"});
		$("#ratnamesize").css({"font-size":"1.2em"});
		var atemp = document.getElementById('a2');
		atemp.setAttribute('id','a3');
	}
};

var game = new Phaser.Game(420,720, Phaser.AUTO, 'game');

var mainpage ={
  preload:()=>{
	game.load.tilemap('map', 'assets/json/b_map.json', null,Phaser.Tilemap.TILED_JSON);
	game.load.image('bgimage','assets/img/bgimage.png');			
	game.load.image('endb','assets/img/endb3.png');
	game.load.image('achb','assets/img/achb2.png');
	game.load.image('setb','assets/img/setb2.png');		
	game.load.image('wall','assets/img/wall.png');
	game.load.image('wall2','assets/img/wall2.png');
	game.load.image('bowl','assets/img/bowl.png');
	game.load.image('bamboo','assets/img/bamboo2.png');
	game.load.image('corn','assets/img/corn.png');
	game.load.image('rice','assets/img/rice.png');
	game.load.image('grass','assets/img/grass.png');
	game.load.spritesheet('rat_player','assets/img/rat4.png', 210, 114);
	},
  create:()=>{	
    //物理引擎
    game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 0;
	game.time.desiredFps = 30;
	//視窗設定
	game.scale.setGameSize(420,720);
	if(device_type === 0){
		game.scale.scaleMode  = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignVertically = true;
		game.scale.pageAlignHorizontally = true;
	}
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);
	//載入
	map = game.add.tilemap('map');
	map.addTilesetImage('bgimage','bgimage');
	map.addTilesetImage('wall','wall');
	map.addTilesetImage('wall2','wall2');
	map.createLayer('layer3');
	layer = map.createLayer('layer1');
	map.createLayer('layer2');
	map.setCollision(1,true,layer);
	
	
	this.button_eat = game.add.button(160, 655, 'bowl');
	this.button_eat.scale.set(0.8);
	this.button_eat.onInputDown.add( dowm,{key:"eat"},this);
    this.button_eat.onInputUp.add(up, { key: "eat" }, this);
	rat_player = game.add.sprite(150,500, 'rat_player');
	game.physics.enable(rat_player,Phaser.Physics.ARCADE);
	rat_player.scale.set(rat_scale);
	rat_player.facing = 'right';
	rat_player.animations.add('left', [6,7,8,9], 7, true);
    rat_player.animations.add('right', [1,2,3,4], 7, true);
	rat_player.animations.add('catch', [10,11],12, true);
	rat_player.anchor.setTo(0.5,0.5);
	rat_player.body.collideWorldBounds = true;
	rat_player.inputEnabled = true;
	rat_player.input.enableDrag(true);
	bounds = new Phaser.Rectangle(30, 450, 360, 200);
	rat_player.input.boundsRect = bounds;
	//按鈕設定
	this.button_end = game.add.button(345, 655, 'endb');
	this.button_end.scale.set(0.9);
    this.button_end.onInputDown.add( dowm,{key:"end"},this);
    this.button_end.onInputUp.add(up, { key: "end" }, this);  
	
	this.button_ach = game.add.button(80, 655, 'achb');
	this.button_ach.scale.set(0.9);
    this.button_ach.onInputDown.add( dowm,{key:"ach"},this);
    this.button_ach.onInputUp.add(up, { key: "ach" }, this);  
	
	this.button_set = game.add.button(10, 655, 'setb');
	this.button_set.scale.set(0.9);
    this.button_set.onInputDown.add( dowm,{key:"set"},this);
    this.button_set.onInputUp.add(up, { key: "set" }, this);  
	
	game.time.events.loop(Phaser.Timer.SECOND*2,updateMoveNum, this);
	game.time.events.loop(Phaser.Timer.SECOND*2,updowm, this);
	
	},
  update:()=>{
	//按鍵觸發
	if(trigger.end === 1&& game.time.now > gameTimer)
	{
		day++;
		$('#day').text("DAY "+day);
		if(day%10 === 0 && rat_scale <= 1.6)
		{
			rat_player.body.x = 160;
			rat_player.body.y = 525;
			rat_scale += 0.09;
			rat_player.scale.set(rat_scale);
		}
		gameTimer = game.time.now + 750;
		$("#paper").show();
		$("#optionA").show();
		$("#optionB").show();
		$("#cover").show();
		$(".event_title").show();
		$(".event_content").show();
		$(".optionA_text").show();
		$(".optionB_text").show();
	}
	if(prize >= 0)
	{
		switch(prize)
		{
			case 0:
				bamboo = game.add.sprite(170,630,'bamboo');
				bamboo.scale.set(0.7);
				for(i = 0;i < 3;i++)
					bamboo.moveDown();
				prize = -1;
				break;
			case 1:
				corn = game.add.sprite(175,608,'corn');
				corn.scale.set(0.7);
				for(i = 0;i < 3;i++)
					corn.moveDown();
				prize = -1;
				break;
			case 2:
				rice = game.add.sprite(172,614,'rice');
				rice.scale.set(1.1);
				for(i = 0;i < 3;i++)
					rice.moveDown();
				prize = -1;
				break;
			case 3:
				grass = game.add.sprite(174,602,'grass');
				grass.scale.set(0.7);
				for(i = 0;i < 3;i++)
					grass.moveDown();
				prize = -1;
				break;
			default:
			break;
		}
	}
	if(game.physics.arcade.collide(rat_player, layer)&& rat_player.body.onWall())
		collide_num = 1;
	rat_player.angle = 0;
	if(rat_player.input.isDragged)
	{
		rat_player.body.velocity.x = 0;
		rat_player.body.velocity.y = 0;
		rat_player.angle = 90;
		rat_player.play('catch');
	}
	else
	{
		switch(move_num)
		{
			case 1:
			{
				if(collide_num === 1&& rat_player.facing === 'left')
				{
					rat_player.frame = 5;
					rat_player.body.velocity.y = 0;
				}
				else
				{
					rat_player.body.velocity.y = 50*up_num;
					collide_num = 0;
					rat_player.body.velocity.x = -100;
					rat_player.play('left');
					if (rat_player.facing !== 'left')
						rat_player.facing = 'left';
				}
			}
			break;
			case 2:
			{
				if(collide_num === 1&& rat_player.facing === 'right' )
				{
					rat_player.frame = 0;
					rat_player.body.velocity.y = 0;
				}
				else
				{
					rat_player.body.velocity.y = 50*up_num;
					collide_num = 0;
					rat_player.body.velocity.x = 100;
					rat_player.play('right');
					if (rat_player.facing !== 'right') 
						rat_player.facing = 'right';
				}
			}
			break;
			case 3:
			{
				rat_player.body.velocity.x = 0;
				rat_player.body.velocity.y = 0;
				if (rat_player.facing === 'left') 
					rat_player.frame = 5;
				if (rat_player.facing === 'right') 
					rat_player.frame = 0;
			}
			break;
			default:
			break;
		}
	}
	},
	render:()=>{
		//game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
		//game.debug.spriteInfo(rat_player,32,400);
		//game.debug.spriteBounds(rat_player);
	},
};

function updateMoveNum(){
	move_num = game.rnd.integerInRange(1,3);
};
function updowm(){
	up_num = game.rnd.integerInRange(-1,1);
};
	
game.state.add('mainpage', mainpage);
game.state.start('mainpage');

var littlegame ={
  preload:()=>{
	game.load.spritesheet('rat_player','assets/img/rat3.png', 210, 182);
	game.load.image('background','assets/img/rat_race_bg.png');		
	game.load.image('rat_race','assets/img/rat_race.png');
	game.load.image('obstacle','assets/img/spike.png');	
	game.load.image('obstacle2','assets/img/rock.png');		
	},
  create:()=>{	
	$("#ratname").hide();
    //物理引擎
    game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 350;
	game.time.desiredFps = 30;
	game.scale.setGameSize(1050,600);
	//視窗設定
	if(device_type === 0){
		game.scale.scaleMode  = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignVertically = true;
		game.scale.pageAlignHorizontally = true;
	}
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);
	//載入
	bg = game.add.tileSprite(0, 0,1280, 600, 'background');
	bg.autoScroll(-250,0);
	rat_race = game.add.sprite(0,472,'rat_race');
	
	rat_player = game.add.sprite(50,200, 'rat_player');
	game.physics.enable(rat_player,Phaser.Physics.ARCADE);

	game.physics.enable(rat_race,Phaser.Physics.ARCADE);
	rat_race.body.allowGravity = false;
	rat_race.body.immovable = true;
	
	rat_player.facing = 'right';
    rat_player.animations.add('right', [1,2,3,4], 9, true);
	rat_player.body.collideWorldBounds = true;
	rat_player.animations.add('jump', [5,6,7], 2, false);
	//game.input.onDown.add(function(){rat_jump = 1;});
	game.input.onUp.add(function(){rat_jump = 1;});

	rat_life = 3;
	gameTimer2 = 1000;
	lifeText = game.add.text(20,50,'生命: '+rat_life, {fontSize: '24px', fill: '#000000'});
	},
  update:()=>{
	/*$(window).on("orientationchange",function(){
		if(window.orientation != 0)
		{
				game.scale.setGameSize(1050,600);
		}
	});*/
	if(rat_jump && game.time.now > gameTimer && game.physics.arcade.collide(rat_player, rat_race))
	{
		rat_player.play('jump');
		rat_player.body.velocity.y = -350;
		gameTimer = game.time.now + 1300;
	}
	else if(game.physics.arcade.collide(rat_player, rat_race)&& rat_jump === 0)
	{
		rat_player.play('right');
	}
	rat_jump = 0;
	if(game.time.now > gameTimer2)
	{
		obstacle = game.add.sprite(1000,395,'obstacle');
		game.physics.enable(obstacle,Phaser.Physics.ARCADE);
		obstacle.scale.set(0.3);
		obstacle.body.allowGravity = false;
		obstacle.body.immovable = true;
		obstacle.body.velocity.x = -350;
		gameTimer2 = game.time.now +4000;
	}
	if(game.physics.arcade.overlap(rat_player, obstacle) && game.time.now > gameTimer3)
	{
		rat_life--;
		lifeText.setText("生命: " + rat_life);
		gameTimer3 = game.time.now +2000;
	}
	if(obstacle.body.x < 1)
		obstacle.kill();
	if(rat_life === 0)
	{
		$("#main").show();
		game.state.start('mainpage');
	}
	},
	render:()=>{
		//game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
		//game.debug.spriteInfo(rat_player,32,32);
		 //game.debug.spriteBounds(rat_player);
	},

};

game.state.add('littlegame',littlegame);

var wheel; 
var canSpin;
var slices = 4;
var slicePrizes = ["新鮮嫩竹子","玉米","米糠拌飯","芒草"];
var prize;
var prizeText;
var spinGame = function(game){};
spinGame.prototype ={
	preload:function(){
		game.load.image("wheel", "./assets/img/plat.png");
		game.load.image("pin", "./assets/img/spin.png");     
    },
  	create:function(){
		game.time.desiredFps = 60;
  		game.stage.backgroundColor = "#99ffcc";
  		wheel = game.add.sprite(game.width / 2, game.width / 2, "wheel");
		wheel.scale.set(0.5);
        wheel.anchor.set(0.5);
        var pin = game.add.sprite(game.width / 2, game.width / 2, "pin");
        pin.anchor.set(0.5);
        prizeText = game.add.text(game.world.centerX, 400, "");
        prizeText.anchor.set(0.5);
        prizeText.align = "center";
        canSpin = true;
        game.input.onDown.add(this.spin, this);		
		i= 0;
	},
    spin(){
          if(canSpin){  
               prizeText.text = "";
               var rounds = game.rnd.between(200, 600);
               var degrees = game.rnd.between(0, 360);
               prize = slices - 1 - Math.floor(degrees / (360 / slices));
               canSpin = false;
               var spinTween = game.add.tween(wheel).to({
                    angle: 360 * rounds + degrees
               }, 1500, Phaser.Easing.Quadratic.Out, true);
               spinTween.onComplete.add(this.winPrize, this);
          }
    },
    winPrize(){
          prizeText.text = slicePrizes[prize];
		  gameTimer = game.time.now;
		  i = 1;
		  
    },
	update:function(){
		if(game.time.now > gameTimer + 3000 && i == 1)
		{
			$("#main").show();
			game.state.start("mainpage");
		}
	}
}
game.state.add("spin",spinGame);
$("#return").click(function(){
		$("#cover").hide();		
		$("#achieve").hide();
		$("#setting").hide();
		$("#return").hide();
	});
function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
};
$(".optionA_text").click(function(){
	four_bar_conrtrol(content_data[event_id][6][0],content_data[event_id][6][1],content_data[event_id][6][2],content_data[event_id][6][3]);
	$("#optionA").hide();
	$("#optionB").hide();
	$(".optionA_text").hide();
	$(".optionB_text").hide();
	document.getElementById("T1-1").innerHTML="結果";
	document.getElementById("C1-1").innerHTML=content_data[event_id][4];
	event_end();
});

$(".optionB_text").click(function(){
	four_bar_conrtrol(content_data[event_id][7][0],content_data[event_id][6][1],content_data[event_id][6][2],content_data[event_id][6][3]);
	$("#optionA").hide();
	$("#optionB").hide();
	$(".optionA_text").hide();
	$(".optionB_text").hide();
	document.getElementById("T1-1").innerHTML="結果";
	document.getElementById("C1-1").innerHTML=content_data[event_id][5];
	event_end();
});
function event_end(){
	$("#paper").click(function(){
		$("#cover").hide();
	    $("#paper").hide();
	    $(".event_title").hide();
	    $(".event_content").hide();
		event_id = getRandom(0,2);
		document.getElementById("T1-1").innerHTML=content_data[event_id][0];
		document.getElementById("C1-1").innerHTML=content_data[event_id][1];
		document.getElementById("A1-1").innerHTML=content_data[event_id][2];
		document.getElementById("B1-1").innerHTML=content_data[event_id][3];
	});
};
function four_bar_conrtrol(a,b,c,d){
	if(a != 0)
		bar_control(a,1);
	if(b != 0)
		bar_control(b,2);
	if(c != 0)
		bar_control(c,3);
	if(d != 0)
		bar_control(d,4);
};
function bar_control(b_input,b_type){
	bar_value[b_type-1] += b_input;
	if(bar_value[b_type-1] > 100)
		bar_value[b_type-1] = 100;
	else if(bar_value[b_type-1] < 0)
		bar_value[b_type-1] = 0;
	$("#bar"+b_type).animate({width: bar_value[b_type-1]/100*59+'vw'},1000);
};
$("#weather").click(function(){
		$("#main").hide();
		game.state.start('littlegame')
});
$(document).ready(function(){	
	$("#cover").hide();
	$("#setting").hide();
	$("#achieve").hide();
	$("#return").hide();
    $("#paper").hide();
    $("#optionA").hide();
    $("#optionB").hide();
    $(".event_title").hide();
    $(".event_content").hide();
    $(".optionA_text").hide();
    $(".optionB_text").hide();
	$('#day').text("DAY "+day);
	deviceType();
});
