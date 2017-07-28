/********************************************************
 *                      Main.js
 * This file sets the initial state for the web app
 * The controller files are responsible for the interactions
 * between the model and the view layers. Ideally, you will 
 * have a new controller for each HTML page.
 * 
 *******************************************************/

// Do stuff when the window loads
window.onload = function() {
    // Some listeners
    var searchButton = document.getElementById("searchButton");
    //searchButton.addEventListener("click", searchImages, true);
    $(searchButton).on("click", searchImages);
    
    var searchForm = document.getElementById("searchForm");
    //searchForm.addEventListener("onkeypress", searchImages)   // Searches field prior to keypress
    $(searchForm).on("keyup", searchImages);                    // Uses JQuery to search field as it changes
    
    // Set initial images
    // var images = getImages();
    //console.log(images);
    //displayImages(images);
    
    // Wait for page to load
    $( document ).ready(loadPage());
    $('#showPage').click(showPage);
    $('#goToSplash').click(showSplash);
};


$(document).ready(function(){
    $("#searchBtn").on("click",function(){
        search($("#searchBox").val());
    })
    
    $("#searchBox").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            search($("#searchBox").val());
            $( "#results" ).focus();
        }
    });
})

// Splash Screen
function loadPage(){
    //$(splash).html("Page loaded. Click <a href='#' id='showPage'>HERE</a> to continue");
    showPage();
}

function showPage(){
    console.log("showpage");
    $('#splash').addClass('hidden');
    $('#body').removeClass('hidden');
    $('#nav').removeClass('hidden');
}
function showSplash(){
    console.log("showsplash");
    $('#splash').removeClass('hidden');
    $('#body').addClass('hidden');
    $('#nav').addClass('hidden');
}

// Search Images
function searchImages() {
    var keyword = document.getElementById('searchForm').value;
    
    // Clear gallery and get image array
    clearGallery();
    var images = searchFlickr();
    
    // Search results
    var results = search(keyword, images);
    displayImages(results, true);
}

// Search an array for keywords
function search(keyword, images){
    keyword.trim();
    keyword.toLowerCase();
    var results = [];
    for(var i=0; i < images.length; i++){
        if(images[i].title.toLowerCase().indexOf(keyword) !== -1){
            results.push(images[i]);
        }
    }
    
    return results;
}

// Choose what images to display
function displayImages(images, search = false) {
    var row;
    if(images.length == 0){
        // No images in results -- Provide visual feedback that there are no valid results
        
        row = document.createElement("div");
        row.setAttribute("class", "col-md-12");
        row.setAttribute("style", "margin: 10px");
        
        
        // Create Image Container
        var container = document.createElement("div");
        container.setAttribute("class", "col-md-12");
        row.appendChild(container);

        // Create Image Div
        var div = document.createElement("div");
        div.setAttribute("class", "text-center");
        div.setAttribute("style", "padding: 30px; border-style: solid; border-width:0px;");
        // If search is true
        if (search && i % 2 == 0) {
            div.setAttribute("style", "padding: 30px; border-style: solid; border-width:1px; background-color: #666");
        }
        container.appendChild(div);

        // Create Caption
        var title = document.createTextNode("No image found");
        div.appendChild(title);

        // Attach row to body
        var parent = document.getElementById("body");
        parent.appendChild(row);
    } else {
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
    
            // Create a row for every 3 divs
            if (i % 3 == 0) {
                row = document.createElement("div");
                row.setAttribute("class", "col-md-12");
                row.setAttribute("style", "margin: 10px");
            }
    
            // Create Image Container
            var container = document.createElement("div");
            container.setAttribute("id", image.id);
            container.setAttribute("class", "col-md-4");
            row.appendChild(container);
    
            // Create Image Div
            var div = document.createElement("div");
            div.setAttribute("id", image.id);
            div.setAttribute("class", "text-center")
            div.setAttribute("style", "padding: 30px; border-style: solid; border-width:1px;");
            container.appendChild(div);
    
            // Create Image
            var img = document.createElement("img");
            img.setAttribute('src', image.URL());
            img.setAttribute('class', 'img-responsive');
            div.appendChild(img);
    
            // Create Caption
            var title = document.createTextNode(image.title);
            div.appendChild(title);
    
            // Attach row to body
            var parent = document.getElementById("body");
            parent.appendChild(row);
        }
    }
}

// This function clears the body section
function clearGallery() {
    document.getElementById('body').innerHTML = "";
}

// Maintains an array of all the images stored for the lab
function getImages() {
    var images = [{
        fname: 'DSC01049.jpg',
        title: 'City View'
    }, {
        fname: 'DSC01066.jpg',
        title: 'Ferris Wheel'
    }, {
        fname: 'DSC02511.jpg',
        title: 'A building in the forbidden city with extra long text'
    }, {
        fname: 'DSC03810.jpg',
        title: 'City from Mt Gravatt'

    }, {
        fname: 'DSC05750.jpg',
        title: 'Sunrise?'
    }];

    var imgArr = [];
    for (var i = 0; i < images.length; i++) {
        var item = images[i];
        var img = new Image(i + 1, item.title, item.title, item.fname);
        imgArr.push(img);
    }

    return imgArr;
}

// This function presents the first image in the array for N times
/* Deprecated
function repeat(n, images) {
    var results = [];

    for (var i = 0; i < n; i++) {
        results.push(images[0]);
    }

    return results;
}
//*/

function searchFlickr(term){
    console.log("searchFlickr");
    console.log("term="+term);
    var imgArr;
    var method="flickr.photos.getRecent";
    if(term != ""){
        method = "flickr.photos.search";
    }
    var url = "https://api.flickr.com/services/rest/?method="+method+"&api_key=dc140afe3fd3a251c2fdf9dcd835be5c&tags="+term+"&safe_search=1&per_page=20";
    var src;
    $.getJSON(url + "&format=json&jsoncallback=?", function(data){
        var results = (data);
        console.log(results);
        displayOutputFlickr(results);
    /*$.each(data.photos.photo, function(i,item){
        console.log(item);
        src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
        displayImg(item);
        console.log(src);
       // $("<img/>").attr("src", src).appendTo("#images");
        //if ( i == 3 ) return false;
      
    });*/
});
    return imgArr;
}


function searchInstagram(term){
    console.log("searchInstagram");
    console.log("term="+term);
    var imgArr;
    var method="flickr.photos.getRecent";
    if(term != ""){
        method = "flickr.photos.search";
    }
  
    var url = "https://api.instagram.com/v1/users/self/?access_token=5399513485.7bcc1f9.47279f18017646508ddc0a57cbcb69d3"
    //var url = "https://api.flickr.com/services/rest/?method="+method+"&api_key=dc140afe3fd3a251c2fdf9dcd835be5c&tags="+term+"&safe_search=1&per_page=20";
    var src;
    
    
    $.ajax({
        url: "https://api.instagram.com/v1/tags/coffee/media/recent?access_token=5399513485.7bcc1f9.47279f18017646508ddc0a57cbcb69d3&callback=callbackFunction",
        type: 'POST',
        success: function (result) {
            console.log(result);
        },
    
        error: function () {
            alert("error");
        }
    });
    /*
    $.getJSON(url, function(data){
        var results = (data);
        console.log(results);
        displayOutputFlickr(results);
    /*$.each(data.photos.photo, function(i,item){
        console.log(item);
        src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
        displayImg(item);
        console.log(src);
       // $("<img/>").attr("src", src).appendTo("#images");
        //if ( i == 3 ) return false;
      
    });*/
//});
    return imgArr;
    
}

function callbackFunction(response){
    console.log(response);
}
function displayImg(){
    
}
function search(searchItem){
    console.log("Search");
   var term = {term:searchItem};
    var output = $("#results");
    output.empty();
    $(".sk-cube-grid").toggleClass("hidden");
    
    /* nodejs version 
    $.get('/search',term, function(response) {
        var results = (response);
        console.log(results);
        displayOutput(results);
    },'json');
    */ 
    searchFlickr(searchItem);
    //searchInstagram(searchItem);

}
function newSearch(e){
    debugger;
    console.log(e.text);
}
function displayOutputFlickr(data){
    var htmlOutput="";
    var output = $("#results");
    $(".sk-cube-grid").toggleClass("hidden");
   // data = JSON.stringify(data);

        
    data.photos.photo.forEach(function(elem) {
        //console.log(elem.text);
        var src = "https://farm"+ elem.farm +".static.flickr.com/"+ elem.server +"/"+ elem.id +"_"+ elem.secret +"_m.jpg";
        htmlOutput += '<div class="pure-u-1-3"><div class="gridBox"><img src="'+src+'"></div></div>';
    });
    output.append(htmlOutput);

}

function displayOutput(data){
    var htmlOutput="";
    var output = $("#results");
    $(".sk-cube-grid").toggleClass("hidden");
   // data = JSON.stringify(data);

    data.statuses.forEach(function(elem) {
        //console.log(elem.text);
        htmlOutput += '<div class="pure-u-1-3"><div class="gridBox">' + twitterize(elem.text) + '</div></div>';
    });
    output.append(htmlOutput);

}

function twitterize(text){
    var output;
    if (typeof text == 'undefined'){
        console.log("undefined text");
        return output;
    }

    output = text.replace(/(#)\w+/g,function(v){return '<a class="twitLink" onclick="newSearch(this)">'+v+'</a>'});
    //output = text.replace(/(https:)\w+/g,function(v){return '<a class="twitLink" onclick="newSearch(this)">'+v+'</a>'});
    //output = text;

    return output;
}
