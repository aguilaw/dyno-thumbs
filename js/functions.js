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
