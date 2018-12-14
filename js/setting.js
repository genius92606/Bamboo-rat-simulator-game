var volume_slider = document.getElementById("volume_slider");
var bamboorat1_voice = document.getElementById("bamboorat1");
var achieve_num = 20;

volume_slider.oninput = function() {
	bamboorat1_voice.load();
	bamboorat1_voice.volume = volume_slider.value/100;
	bamboorat1_voice.play();
}


/*load achieve content*/
$("#achieve").ready(function(){
	var i;
	var css_grid_row = "";
	for(i = 0 ; i < achieve_num ; i++){
		/*create achieve icon container*/
		var ach_div_icon = document.createElement("div");
		ach_div_icon.className = "achieve_icon";

		/*create achieve icon element*/
		var ach_img = document.createElement("IMG");
		ach_img.className = "achieve_icon_img";
		ach_img.src = "./assets/img/health.png";
		ach_div_icon.appendChild(ach_img);

		/*create achieve title container*/
		var ach_div_title = document.createElement("div");
		ach_div_title.className = "achieve_title";

		/*create achieve content container*/
		var ach_div_content = document.createElement("div");
		ach_div_content.className = "achieve_content";
		$("#achieve").append(ach_div_icon,ach_div_title,ach_div_content);
		css_grid_row = css_grid_row + "10%";
	}
	$(".achieve_container").css("grid-template-rows",css_grid_row);
})

/*show achieve page*/ 
$("#achieve_btn").click(function(){
	$("#achieve").show();
})

/*data saving !*/
$("#save_img").click(finction(){

})
