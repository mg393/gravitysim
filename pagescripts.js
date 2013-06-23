var winWidth = window.innerWidth;
var posit = (winWidth / 2);
var vector = 210;
var inverse = -1;
vector *= inverse;
posit += vector;
$(document).ready(function(){
	$("#menuBG").click(function(){
		$(this).animate({left:posit}, 350, 'swing');
		$("#menuCanvas").animate({left:posit}, 350, 'swing');
		vector *= inverse;
		posit += vector;
	});
});		//Wow I can't believe it actually works