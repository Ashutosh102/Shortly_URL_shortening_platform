//WOW js
new WOW().init();

$(document).ready(function () {
    //Smooth Scroll to Div
    $(".smooth-scroll").on('click', function (event) {
        event.preventDefault();
        var hash = '#header';
        var size = $("#header").height() / 2;
        $('html, body').animate({
            scrollTop: $(hash).offset().top + size
        }, 400, function () {
            window.location.hash = hash;
        });
    });
})

//Loader
$(window).on('load', function () {
    $("#loader").addClass("d-none");
})

//Change image on hover
$(".alt").hide();
$(".socmed").mouseover(function () {
    $(this).children(".main").hide();
    $(this).children(".alt").show();
}).mouseleave(function () {
    $(this).children(".main").show();
    $(this).children(".alt").hide();
});

//Check if valid URL
var theurl = $("#theurl");
var linkcont = $("#item");
//Get existing links
getLinks();

//Remove error message on change
$("#theurl").change(function () {
    $("#theurl").removeClass('err');
});

$("#form-shorten").submit(function (e) {
    e.preventDefault();
    $("#theurl").removeClass('err');
    if (URLIsValid(theurl.val())) {
        $(".ripple").css("display", "block");
        $("#theurl").prop('disabled', true);
        //Post to API
        fetch("https://api.shrtco.de/v2/shorten?url=" + theurl.val())
            .then((res) => res.json())
            .then((data) => {
                storeLink(theurl.val(), data.result.short_link);
                // $(".ripple").css("display", "none");
                // $(this).prop('disabled', false);
            });
    } else {
        $("#theurl").addClass('err');
        if (theurl.val() == "") {
            $("#err-msg").text('Please add a link.');
        } else {
            $("#err-msg").text('Please enter a valid URL.');
        }
    }
});

var temp = $("<input>");
$(".close").click(function (event) {
    event.preventDefault();
    $(".copy").removeClass("copied").text("Copy");
    temp.remove();
    //Delete an item
    var linkkey = $(this).data("linkkey");
    items = JSON.parse(sessionStorage.getItem("items"));
    items.splice(linkkey, 1);
    sessionStorage.setItem("items", JSON.stringify(items));
    // getLinks();
    location.reload();
});

$(".copy").click(function (e) {
    e.preventDefault();
    $(".copy").removeClass("copied").text("Copy");
    //Copy shortlink
    var copyText = $(this).data("copylink");
    $("body").append(temp);
    temp.val(copyText).select();
    document.execCommand("copy");
    temp.remove();
    //Copied! text
    $(this).addClass("copied").text("Copied!");
});


function URLIsValid(theurl) {
    return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(theurl)
}

function storeLink(link, shortlink) {
    let item = { link, shortlink }; //data to be stored
    let items = get(); // get existing links
    items.push(item); // add new links to existing links
    sessionStorage.setItem("items", JSON.stringify(items)); // store locally
    // getLinks();
    location.reload();
}

function get() {
    //Get items in local storage
    let items;
    if (sessionStorage.getItem("items") == null) {
        items = [];
    } else {
        items = JSON.parse(sessionStorage.getItem("items"));
    }
    return items;
}

function getLinks() {
    linkcont.html("");
    let items = get(); // get existing links
    // for each item run function showShortLinks
    var x = 0;
    items.forEach(i => {
        linkcont.append('<div class="item wow animate__animated animate__fadeIn"><div class="text"><p class="close" data-linkkey="' + x + '">x</p><span class="link">' + i.link + '</span><span class="result">' + i.shortlink + '<button class="copy button big" data-copylink="' + i.shortlink + '">Copy</button></span></div></div>');
        x++;
    })
}