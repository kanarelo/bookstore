$(document).ready(function(){
    $(".book-card").hover(function(){  
        $(this).addClass("shadow-lg");  //Add the active class to the area is hovered
    }, function () {
        $(this).removeClass("shadow-lg");
    });
    $(".book-list-item").hover(function(){  
        $(this).addClass("shadow-lg");  //Add the active class to the area is hovered
    }, function () {
        $(this).removeClass("shadow-lg");
    });
});