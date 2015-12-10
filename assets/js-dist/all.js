var allThumbs=[];

var droppedList= $('#dropped-list');
var resizingStation=$('#canvas-container');

/*********************************************
Set up the drag and drop container and
add event listeners
*********************************************/
$(function(){
	dragAndDropSetup();

	$('#continue-bttn').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		$('.drag-drop-wrap').fadeOut(500);
		$('.thumb-factory-wrap').fadeIn(1000);
		createCanvases();
	});

	$('.js-crop').on('click', crop);
});

/*********************************************
Set up the drag and drop container
*********************************************/
function dragAndDropSetup(){
	var holder = $('#drop-container'),
			state = $('#status');

	if (typeof window.FileReader === 'undefined') {
		alert("Sorry. This browser isn't suported");
	} else {
	}

	holder.on('dragover', function () {
		event.preventDefault();
    event.stopPropagation();
		$(this).addClass('hover');});

	holder.on('dragleave' , function () {
		event.preventDefault();
    event.stopPropagation();
		$(this).removeClass('hover'); });

	holder.on('drop' , function (e) {
		e.preventDefault();
    e.stopPropagation();
		//all dropped files saved in this variable
		var files = event.dataTransfer.files;

		addDroppedToDOM(files);
		return false;
	});
}

/*********************************************
Read the dropped files and add a small preview
the drop container and and <img> to the resizing station
*********************************************/
function addDroppedToDOM(files){
	//loop over every image dripped in the container
	$.each(files,function(index, value){

		var reader = new FileReader();

		reader.onload = function (event) {
			droppedList.append("<li ><img class='dropped-image' src='"+event.target.result+"'></li>");
			resizingStation.append("<img class='resize-img' src='"+event.target.result+"'>");
		}.bind(this);

		reader.readAsDataURL(value);
	});
}

/*********************************************
Loop through the tumbnail array and
crop/download all the new thumbnails
*********************************************/
function createCanvases(e){
  var thumbWidth,
   		thumbHeight;
	//read the user provided thumbnail height and width
 	thumbWidth  = parseInt($('#thumb-width').val());
	thumbHeight = parseInt($('#thumb-height').val());
	$('.resize-img' ).each( function(  ){
		//create a new thumb object
		var thumb= new resizeableImage($(this),thumbWidth,thumbHeight);
		allThumbs.push(thumb);
	});
}

/*********************************************
Loop through the tumbnail array and
crop/download all the new thumbnails
*********************************************/
function crop(){
	$.each(allThumbs,function(index, thumb){

		thumb.crop();
	});
}

function resizeableImage(image_target,width,height) {
  // Some variables and settings
   var $container,
    $overlay,
    orig_src = new Image(),
    event_state = {},
    min_width = 100,
    min_height = 100,
    max_width =1000,
    max_height = 1000,
    src_img_height=0,
    src_img_width=0,
    final_thumb_height=height,
    final_thumb_width=width,
    container_height=0,
    container_width=0,
    resize_canvas = document.createElement('canvas');

    var link = document.createElement('a');
    var scaleImg= function(){
      var scale_factor=1;

      if (( src_img_height > src_img_width) && (final_thumb_width < final_thumb_height)){
          container_width=(final_thumb_width+15);
          scale_factor=container_width/src_img_width;
          container_height=src_img_height*scale_factor;
      }else{
        container_height=(final_thumb_height+15);
        scale_factor=container_height/src_img_height;
        container_width=src_img_width*scale_factor;
      }
    };
    var init = function(){
        orig_src.src = image_target[0].src;
        src_img_height= image_target[0].naturalHeight;
        src_img_width= image_target[0].naturalWidth;

        scaleImg();
        $('<style>.overlay:after,.overlay:before{width:'+final_thumb_width+'px;}.overlay-inner:after,.overlay-inner:before{height:'+final_thumb_height+'px;}</style>').appendTo('head');
        var overlay = "<div class='overlay' style='height:"+height+"px;width:"+width+"px;margin-left:"+((width/2)*-1)+"px;margin-top:"+((height/2)*-1)+"px;'><div class='overlay-inner'></div></div>";
        // Wrap the image with the container and add resize handles
        image_target.wrap('<div class="resize-container" style="height:'+container_height+'px;width:'+container_width+'px;"></div>')
        .before('<span class="resize-handle resize-handle-nw"></span>')
        .before('<span class="resize-handle resize-handle-ne"></span>')
        .after('<span class="resize-handle resize-handle-se"></span>')
        .after('<span class="resize-handle resize-handle-sw"></span>');



        // save the container to a variable
        $container=image_target.parent('.resize-container');
       resizeImage($container.width(),$container.height());

        $container.wrap('<div class="resize-unit-wrap" style="height:'+final_thumb_height*2+'px;width:'+final_thumb_width*2+'px;"></div>');
        $container.parent('.resize-unit-wrap').prepend(overlay);
        $overlay=$container.parent('.resize-unit-wrap').children('.overlay');
        // Add events
        $container.on('mousedown touchstart', '.resize-handle', startResize);
        $container.on('mousedown', startMoving);
      }.bind(this);

    var saveEventState = function(e){
      // Save the event details and container state
      event_state.evnt = e;
      event_state.container_width = $container.width();
      event_state.container_height = $container.height();
      event_state.container_left = $container.offset().left;
      event_state.container_top = $container.offset().top;
      event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
      event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
    }.bind(this);

    var startMoving = function(e){
      e.preventDefault();
      e.stopPropagation();
      saveEventState(e);
        $(document).on('mousemove', moving);
        $(document).on('mouseup', endMoving);
    }.bind(this);

    var moving = function(e){
      var  mouse={};
      e.preventDefault();
      e.stopPropagation();

      mouse.x = $(window).scrollLeft() + (e.clientX || e.pageX );
      mouse.y = $(window).scrollTop() + (e.clientY || e.pageY );
      $container.offset({
        'left': mouse.x - ( event_state.mouse_x - event_state.container_left ),
        'top': mouse.y - ( event_state.mouse_y - event_state.container_top )
      });
    }.bind(this);

    var endMoving = function(e){
      e.preventDefault();
        $(document).off('mouseup', endMoving);
        $(document).off('mousemove', moving);
    }.bind(this);

    var startResize = function(e){
      e.preventDefault();
      e.stopPropagation();
      saveEventState(e);
      $(document).on('mousemove', resizing);
      $(document).on('mouseup', endResize);
    }.bind(this);

    var endResize = function(e){
      e.preventDefault();
      $(document).off('mouseup touchend', endResize);
      $(document).off('mousemove touchmove', resizing);
    }.bind(this);

    var resizing = function(e){
      var mouse={},width,height,left,top,offset=$container.offset();
      mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
      mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

      // Position image differently depending on the corner dragged
     if( $(event_state.evnt.target).hasClass('resize-handle-se') ){
        width = mouse.x - event_state.container_left;
        height = width / orig_src.width * orig_src.height;
        left = event_state.container_left;
        top = event_state.container_top;
      } else if($(event_state.evnt.target).hasClass('resize-handle-sw') ){
        width = event_state.container_width - (mouse.x - event_state.container_left);
        height = width / orig_src.width * orig_src.height;
        left = mouse.x;
        top = event_state.container_top;
      }
      else if($(event_state.evnt.target).hasClass('resize-handle-nw') ){
        width = event_state.container_width - (mouse.x - event_state.container_left);
        height = width / orig_src.width * orig_src.height;
        left = mouse.x;
        top = mouse.y - ((width / orig_src.width * orig_src.height) - height);

      } else if($(event_state.evnt.target).hasClass('resize-handle-ne') ){
        width = mouse.x - event_state.container_left;
        height = width / orig_src.width * orig_src.height;
        left = event_state.container_left;
          top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
      }

      if(width > min_width && height > min_height && width <= max_width && height <= max_height){
        resizeImage(width, height);
        $container.offset({'left': left, 'top': top});
      }
    };

    var resizeImage = function(width, height){
      resize_canvas.width = width;
      resize_canvas.height = height;
      resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
      image_target.attr('src', resize_canvas.toDataURL("image/jpeg"));
      $container.attr('style','');
    }.bind(this);

    this.crop = function(){
      //Find the part of the image that is inside the crop box
      var crop_canvas,
          left = $overlay.offset().left - $container.offset().left,
          top =  $overlay.offset().top - $container.offset().top,
          width = $overlay.width(),
          height = $overlay.height();

      crop_canvas = document.createElement('canvas');
      crop_canvas.width = width;
      crop_canvas.height = height;
      crop_canvas.getContext('2d').drawImage(image_target[0], left, top, width, height, 0, 0, width, height);

      //download using download attribute of anchor tag
      var link= document.createElement('a');
      link.addEventListener('click', function(ev) {
        link.href = crop_canvas.toDataURL();
        link.download = "thumb.jpg";
      }, false);

      link.click();
    }.bind(this);

    init();
}
