/* ======================================================
    Diderson Baka Web and Mobile Application Developer  
    www.diderson.com

    NOTE: This code is intellectual property of
    Diderson Baka  and may not be
    reproduced or used without prior permission.

    Copyright 2016 Diderson Baka Web and Mobile Application Developer 
    ======================================================  */
$(document).ready(function() {
  // Closes the Responsive Menu on Menu Item Click
    $('#loading-vote').hide();
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    $(document).on("scroll", onScroll);
    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        
        $('a').each(function () {
            $(this).removeClass('nav-active');
        })
        $(this).addClass('nav-active');
      
        var target = this.hash;
        var menu = target;

        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });

    var canVote = $.cookie("canVote");
    var clickedSquareIdCookie = $.cookie("clickedSquareId");
    //$.removeCookie("canVote");
    //$.removeCookie("clickedSquareIdCookie");

    //checking the cookie if the user already vote
    if (canVote !== null){
        highlightClickedOption(clickedSquareIdCookie);
        styleSquareVote();
    }
    //handeling vote script
    $('.square').on('click', function () {
        //console.log(canVote);
        //checking if user didn't vote yet
        if (canVote === null) {
            //setting up cookies
            $.cookie("canVote","No",1);
            /*From here I can work on the vote data */
            $('#loading-vote').show();
            var clickedSquare = $(this);
            var sidekickId = clickedSquare.data("id");
            var clickedSquareId = 'square_'+sidekickId;
            $.cookie("clickedSquareId",clickedSquareId,1);

            tweetTitleData = $('#bar-vote_'+clickedSquareId).next('strong').html();
            $("#tweetSidekick").attr("data-tweettitle",tweetTitleData);

            var scorArr = [];

            /*
            *From here empty square content and styling it
            */
            $('.square').css("border-color", "#9f9f9f");
            $('.square').empty();
            
            highlightClickedOption(clickedSquareId);//higliting clicked options

            //the ajax to post data
            $.ajax({ 
                url: "/Base/Sidekick/Scores", 
                dataType: "json", 
                contentType: "application/json", 
                type: "post", 
                data: "{\"Id\":\"" + sidekickId + "\"}",
                success: function(data, textStatus, jqXHR)
                {
                    //data - response from server
                },
                error: function (jqXHR, textStatus, errorThrown)
                {
             
                }
            });

            styleSquareVote();
            setTimeout(function() { location.reload(); }, 5000);//this must be move in success AJAX to make the cookies work
            $('#loading-vote').hide();
        }
    });

    /*Highlight text in vote*/
    $( ".box-cnt" )
      .mouseover(function() {
        $( this ).find(".bar-bg").addClass("txt-nred");
      })
      .mouseout(function() {
        $( this ).find(".bar-bg").removeClass("txt-nred");
      });

        //perform quick tweet 
        $("#tweetSidekick").click(function(event){
          //console.log('tweet click', getTweetTitle);
          var getTweetTitle = $("#tweetSidekick").data('tweettitle');
          event.preventDefault();
          var tweetedLink = window.location.href;
          window.open("http://twitter.com/intent/tweet?url=" + tweetedLink + "&text=" + getTweetTitle + "&via=bluegrass&", "twitterwindow", "height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0");
        });
});

//shrink the menu to stay on top
$(window).scroll(function() {
  if ($(document).scrollTop() > 70) {
    $('#mainNav').addClass('shrink');
  } else {
    $('#mainNav').removeClass('shrink');
  }
});

//smoothScroll.init();
function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('.page-scroll-link').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('.page-scroll-link').removeClass("nav-active");
            currLink.addClass("nav-active");
        }
        else{
            currLink.removeClass("nav-active");
        }
    });
}

//progress vote
function setVotes(ans_id, ans_prc){
  var bar = document.getElementById(ans_id).style.width = ans_prc + '%';
}

function styleSquareVote(){
    var scorArr = [];
    $('.square').each(function () {
        var currSquare = $(this);
        var squareId = currSquare.attr("id");
        var voteId = currSquare.data("id");
        var voteScore = currSquare.data("score");
        var bareId = 'bar-vote_'+voteId;
        var ScorePercentage = voteScore
        scorArr.push(voteScore);
        if(voteScore > 0){
            ScorePercentage =Math.round((voteScore * 100) / 50); //I am using the average to get percentage
        }
        setVotes(bareId, ScorePercentage);
    });

    /*
    *Hight light text for higher value
    */
    var indexHiValue = findHighestMountainIndex(scorArr);
    var highValue = scorArr[indexHiValue];
    $(".badge-img").remove();

    $('.square').each(function () {
        var square = $(this);
        var voteScore = square.data("score");
        var voteId = square.data("id");
        var bareId = 'bar-vote_'+voteId;

        /*
        *adding badge for the highest score and styling it
        */
        if(voteScore === highValue){
            $('#bar-vote_'+voteId).next('strong').css( "color", "#e12522" );
            $(".box-cnt").css( "z-index", "inherit" );
            $('#bar-vote_'+voteId).closest(".box-cnt").css( "z-index", "inherit" ).append('<img class="badge-img" src="img/1st-trans.png">');          
        }
    });

}

//function to add ok mark to the clicked option
function highlightClickedOption(clickedSquareIdCookie){
    //console.log('clickedSquareIdCookie: ', clickedSquareIdCookie);
    $('#'+clickedSquareIdCookie).css("border-color", "#e12522");
    $('#'+clickedSquareIdCookie).html('<i class="fa fa-check" aria-hidden="true"></i>').css(
        {   'display' : 'table-cell', 
            'text-align' : 'center', 
            'padding-top': '10px' , 
            'font-size': '20px' , 
            'padding-top': '10px',
            'color': '#e12522'
        });
}

//function find the highest score in array
function findHighestMountainIndex(mountainHeights){
    var counter = 1;
    var indexOfHighestMountain = 0;

    for(counter; counter < mountainHeights.length; counter++){
        if(mountainHeights[indexOfHighestMountain] < mountainHeights[counter]){
            indexOfHighestMountain = counter;
        }
    }

    return indexOfHighestMountain;
}

function popitup(url) {
    newwindow=window.open(url,'name','height=450,width=450');
    if (window.focus) {newwindow.focus()}
    return false;
}