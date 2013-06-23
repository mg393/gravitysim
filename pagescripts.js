var winWidth = window.innerWidth;
var posit = (winWidth / 2);
var vector = 210;
var opac = 0.15;
var opacMod = 0.85;
var inverse = -1;
vector *= inverse;
posit += vector;
$(document).ready(function(){
	$("#menuBG").click(function(){
		$(this).animate({left:posit, opacity:opac}, 350, 'swing');
		$("#menuCanvas").animate({left:posit, opacity:opac}, 350, 'swing');
		opac += opacMod;
		opacMod *= inverse;
		vector *= inverse;
		posit += vector;
	});
});		//Wow I can't believe it actually works