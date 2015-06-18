var sidebar = $('.sidebar');
var setting = $('.settings-component');

sidebar.hover(function() {
  $(this).find('.fa-cog').addClass('fa-spin');
}, function() {
  $(this).find('.fa-cog').removeClass('fa-spin');
});

setting.on('click', function(e) {
  var node = $(e.currentTarget),
      action = node.data('action');

  switch(action) {
    case 'print':
      print();
      break;
    case 'clear':
      clear();
      break;
    case 'pause':
      pause();
      break;
    default:
      break;
  }
});

function print() {
  console.log(objects);
}

function clear() {
  /*console.log('not sure why, but this don\'t do shit, even though it deletes all the objects.');
  console.log('Look: ', objects);
  objects = [];
  console.log('Look again: ', objects);
  console.log('Look at the screen...');
  console.log('...what');*/
  clearObjects();
}

function pause() {
  paused = !paused;
  if (paused == false)
  {
     document.getElementById("settings-option").innerHTML = "Pause Simulation";
  } else {
     document.getElementById("settings-option").innerHTML = "Resume Simualtion";
  }
}
