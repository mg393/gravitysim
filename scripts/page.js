// lol look at me
// 2cool2usejquery
// swag

var sidebar = document.querySelector('.sidebar');
var settingsWheel = document.querySelector('.fa-cog');

sidebar.addEventListener('mouseenter', function() {
  settingsWheel.classList.add('fa-spin');
});

sidebar.addEventListener('mouseleave', function() {
  settingsWheel.classList.remove('fa-spin');
});