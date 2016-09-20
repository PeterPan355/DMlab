window.fbAsyncInit = function () {
    FB.init({
        appId: '1235046306522295',
        xfbml: true,
        version: 'v2.5'
    });
    

    if (typeof facebookInit == 'function') {
        facebookInit();
    }

    FB.login(function (response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            showData();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
        }
    });
};


var genreID;



(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.com/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);    
}(document, 'script', 'facebook-jssdk'));





//FB.login(function (response) { 
//    // handle the response
//}, { scope: 'public_profile,email' });

function getLoginStatus() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;            
            var data = uid + "#" + accessToken;
            //console.log(response);
            //checkValidId(response);
        } else if (response.status === 'not_authorized') {
            console.log("The user is logged in to Facebook, but has not authenticated your app");
        } else {
            console.log("The user is not logged in to Facebook.");
        }
    });
}

//**********AJAX CONTROLLER CALL POST ***********
function checkValidId(data, url, id) {
    //console.log(JSON.stringify(data));
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: url,
        type: 'POST',
        contentType: 'application/json;',
        data: JSON.stringify(data),
        success: function (valid) {
            if (valid) {
            } else {
            }
        }
    });

    //*********** AJAX CONTROLLER CALL GET ***********
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: url + id,
        type: 'GET',
        contentType: 'application/json;',
        //data: JSON.stringify(data.Facebook_ID),
        success: function (valid) {
            if (valid) {
            } else {
            }
        }
    });
}
//***************************************************

FB.api('/me', function (response) {
});

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
        console.log('Successful login for: ' + response.name.split(" ")[0]);
        document.getElementById("zamolba").innerHTML =
          '<br /><br /><center>Hvala na prijavi, ' + response.name.split(" ")[0] + '!</center>';
        document.getElementById("zamolba").visibility = 'visible';
    });
    //getLoginStatus();
}

function checkLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        //var uid = response.authResponse.userID;
        //var accessToken = response.authResponse.accessToken;
        //var userID = response.authResponse.userID;
        //console.log(accessToken + "  " + userID);
        // Logged into your app and Facebook.

        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('UserPicture').innerHTML = '';
        document.getElementById('UserData').innerHTML = '';
        document.getElementById('UserMovies').innerHTML = '';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('UserPicture').innerHTML = '';
        document.getElementById('UserData').innerHTML = '';
        document.getElementById('UserMovies').innerHTML = '';
    }
}



function showFourth() {
    document.getElementById("dbFetchResult").innerHTML = '<li>Valentino Munda<\li>';
}

function userData() {
    if (document.getElementById('UserData').style.display == "none") {
        document.getElementById('UserData').style.display = 'block';


        FB.api('/me/picture?height=80&width=80', function (pictureResponse) {
            document.getElementById("UserData").innerHTML =
            '<img src="' + pictureResponse.data.url + '"></br><center>' +
            userInfo.Ime + ' ' +
            userInfo.Prezime + '<br>' +
            userInfo.Hometown + '<br>' +
            userInfo.DatumRodjenja + '<br>' +
            ' ' + '<br></center></br>';
        });
    }
    else {
        document.getElementById('UserData').style.display = 'none';
    }
}




function showData() {
    
    var genres = {};
    reccomend = function () {
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: genreUrl,
            type: 'GET',
            contentType: 'application/json;',
            //data: id,
            success: function (valid) {
                valid.forEach(function (genre) {
                    var temp = genre.genre_id;
                    genres[temp] = 0;
                });
                userMoviesReccomend();
            }
        });
    }

    userMoviesReccomend = function () {
        
        };

    var movie;
    var userUrl = 'api/UserInfo/';
    var movieUrl = 'api/MovieInfo/';
    var genreUrl = 'api/Genres/';

    var userInfo =
            {
                Facebook_ID:"",
                Ime:"",
                Prezime:"",
                Email:"",
                DatumRodjenja:"",
                Hometown:"",
                ProfilePictureLink: "",
            }

    var movieInfo =
        {
            themoviedb_id:"",
            original_title: "",            
            overview:"",
            release_date:"",           
            cast: "",
            crew: "",
            trailer: "",
            poster_url:"",
        }
    
    var genre = { genre_id: "", genre_type: "" };

    FB.api('/me', { fields: 'first_name,last_name,hometown,birthday,relationship_status' }, function (response) {

        var status;
        if (response.relationship_status == "undefined") {
            status += " ";
        }
        else {
            status += response.relationship_status;
        }
        
        userInfo.Facebook_ID += response.id;
        userInfo.Ime += response.first_name;
        userInfo.Prezime += response.last_name;
        userInfo.Email += response.Email;
        userInfo.DatumRodjenja += response.birthday;
        userInfo.Hometown += response.hometown.name;
        userInfo.Movies = {};
        var allMovies = {};
        var i = 0;
        reccomend();
        FB.api('/me/movies', function (response) {
            
           
            response.data.forEach(function (entry)
            {
                var detailMovieInfoUrl = 'http://api.themoviedb.org/3/' + 'search/movie?query='+entry.name +'&api_key=dbe4d58f24fb7262fd2fd134e6e21ea1';
                userInfo.Movies[i] = { Title: entry.name };
                $.getJSON(detailMovieInfoUrl, { format: "json" })
               .done(function (valid) {
                   valid.results[0].genre_ids.forEach(function (data) {
                       if(genres.hasOwnProperty(data))
                       {
                           genres[data] += 1;
                       }
                   })
               })
                i++;
                
            });
            setTimeout(myFunction, 3000);
            i = 0;
            checkValidId(userInfo, userUrl, userInfo.Facebook_ID);
        });

        myFunction = function () {
            console.log(genres);
            var sortable = [];
            for (var genre in genres)
                sortable.push([genre, genres[genre]])
            sortable.sort(function (a, b) { return b[1] - a[1] })
            console.log(sortable[0][0]);
            console.log(sortable[1][0]);
            console.log(sortable[2][0]);
            var sendThis = 0+','+ sortable[0][0] + ',' + sortable[1][0] +','+ sortable[2][0];
            getThisMovies(sendThis, 50);

            function getThisMovies(id, limit) {
                var element = document.getElementById("UserMovies");
                data =  id + "," + limit;
                console.log(data);
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: movieUrl + data,
                    type: 'GET',
                    contentType: 'application/json;',
                    success: function (valid) {                        
                        if (valid) {
                            valid.forEach(function (movie) {
                                console.log(i);
                                i++;

                                element.innerHTML = element.innerHTML + '<div class="sve">' +
                                                                            '<div class="FilmItem">' +
                                                                                      '<div class="Infomation">' +
                                                                                             '<div class="posterFilm">' +
                                                                                                  '<a href=""> <img src=https://image.tmdb.org/t/p/w185/' + movie.poster_url + ' alt="' + movie.original_title + 'hspace="3px" vspace="3px"  style="width:150px;height:220px;"></a>' +
                                                                                             '</div>' +
                                                                                             '<div class="NaslovIOpis" >' +
                                                                                                  '<div class="Naslov"> Title: ' + movie.original_title +
                                                                                                  '</div>' +
                                                                                                  '<div class="releaseDate"><b>Release date:</b> ' + movie.release_date +
                                                                                                  '</div>' +
                                                                                                  '<div class="cast"><b>Cast:</b> ' + movie.cast +
                                                                                                  '</div>' +
                                                                                                  '<div class="Opis"></br><b>Overwiev:</b></br> ' + movie.overview +
                                                                                                  '</div>' +
                                                                                              '</div>' +
                                                                                              '<div class="rating" style="float:left;margin-right:10px;margin-top:10px;">' +
                                                                                              '<img src="/Content/IMDb.png" style="width:50px; height:30px;margin-top:-1.5px;">' + movie.vote_average +
                                                                                              '<img src="/Content/youtube.png" style="width:35px;height:22px;margin-top:-2px;margin-left:15px;border-right:1px solid black;">' +
                                                                                              "<button type='button' style='background-color:#e64a41;border:none;color:white;' onclick='showTrailer(" + movie.themoviedb_id + ',' + JSON.stringify(movie.trailer) + ")'>Watch Trailer!</button>" +
                                                                                              '</div>' +
                                                                                      '</div>' +
                                                                            '</div>' +
                                                                            '<div class="Trailer" id="' + movie.themoviedb_id + '">' +
                                                                            '</div>' +
                                                                        '</div>';
                            });
                        } else {
                        }

                    }
                });
            }
        };

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: 'api/Genres/',
            type: 'GET',
            contentType: 'application/json;',
            //data: JSON.stringify(data.Facebook_ID),
            success: function (valid) {
                if (valid) {
                    console.log("AAAAA");
                    valid.forEach(function (category) {
                        document.getElementById('listOfCategories').innerHTML += " <li id='" + category.genre_id + "'class='categoryList' onClick=thisCategory('" + category.genre_id + "')>"
                        +category.genre_type+"</li>";
                    });
                } else {
                }
            }
        });
      
    });
    

    thisCategory = function(id)
    {
        genreID =  id;
        var i = 0;
        data = 1 + ',' + id;
        var element = document.getElementById("UserMovies");
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: movieUrl + data,
            type: 'GET',
            contentType: 'application/json;',
            //data: id,
            success: function (valid) {
                element.innerHTML = "";
                if (valid) {
                    valid.forEach(function (movie) {
                        console.log(i);
                        i++;

                        element.innerHTML = element.innerHTML + '<div class="sve">' +
                                                                    '<div class="FilmItem">' +
                                                                              '<div class="Infomation">' +
                                                                                     '<div class="posterFilm">' +
                                                                                          '<a href=""> <img src=https://image.tmdb.org/t/p/w185/' + movie.poster_url+ ' alt="' + movie.original_title + 'hspace="3px" vspace="3px"  style="width:150px;height:220px;"></a>' +
                                                                                     '</div>' +
                                                                                     '<div class="NaslovIOpis" >' +
                                                                                          '<div class="Naslov"> Title: ' + movie.original_title +
                                                                                          '</div>' +
                                                                                          '<div class="releaseDate"><b>Release date:</b> ' + movie.release_date +
                                                                                          '</div>' +
                                                                                          '<div class="cast"><b>Cast:</b> ' + movie.cast +
                                                                                          '</div>' +
                                                                                          '<div class="Opis"></br><b>Overwiev:</b></br> ' + movie.overview +
                                                                                          '</div>' +
                                                                                      '</div>' +
                                                                                      '<div class="rating" style="float:left;margin-right:10px;margin-top:10px;">' +
                                                                                      '<img src="/Content/IMDb.png" style="width:50px; height:30px;margin-top:-1.5px;">' + movie.vote_average +
                                                                                      '<img src="/Content/youtube.png" style="width:35px;height:22px;margin-top:-2px;margin-left:15px;border-right:1px solid black;">' +
                                                                                      "<button type='button' style='background-color:#e64a41;border:none;color:white;' onclick='showTrailer(" + movie.themoviedb_id + ',' + JSON.stringify(movie.trailer) + ")'>Watch Trailer!</button>" +
                                                                                      '</div>' +
                                                                              '</div>' +
                                                                    '</div>' +
                                                                    '<div class="Trailer" id="' + movie.themoviedb_id + '">' +
                                                                    '</div>' +
                                                                '</div>';
                    });
                } else {
                }
           
            }
        });
    }

    showTrailer = function(id, trailer)
    {
        document.getElementById(id).innerHTML = '<iframe display:block title="YouTube video player" class="youtube-player" type="text/html" src=http://www.youtube.com/embed/' + trailer + ' width="540" height="390"  frameborder="0" allowFullScreen></iframe>';
        toggleOnOff(id);
    }
    giveMeMyMovies();

    FB.api('/me/picture?height=30&width=30', function (response) {
        document.getElementById("UserPicture").innerHTML = '<br><br><img id=ProfilePic src="' + response.data.url + '">';
        userInfo.ProfilePictureLink += response.data.url;
    });



    //*****
    //****

    collectGenres = function()
        {
            $.getJSON('http://api.themoviedb.org/3/genre/movie/list?api_key=dbe4d58f24fb7262fd2fd134e6e21ea1', { format: "json" })
                .done(function (genreList)
                {
                    genreList.genres.forEach(function (entry) {
                        resetGenreInfo();
                        genre.genre_id += entry.id;
                        genre.genre_type += entry.name;
                        //console.log(genre);
                        checkValidId(genre, genreUrl, entry.id);
           })
       })
    }
    
    //******Popunjavanje baze filmovima*******
    test = function(counter) {
        if (counter < 214)
        {
            setTimeout(fillDatabaseWithMovies(counter), 1000);            
        }
    }

    fillDatabaseWithMovies = function (counter) {
        
          results = []
          for (i = counter; i <= counter + 1; i++) {
              console.log(counter);
              $.getJSON('http://api.themoviedb.org/3/movie/top_rated?api_key=dbe4d58f24fb7262fd2fd134e6e21ea1&page=' + i.toString(), { format: "json" }).done(function (obj) {
                  results.push(obj);
                  //console.log(obj.results);            
                  obj.results.forEach(function (entry)
                  {
                      var detailMovieInfoUrl = 'http://api.themoviedb.org/3/' + 'movie/' + entry.id + '/credits' + '?api_key=dbe4d58f24fb7262fd2fd134e6e21ea1';
                      $.getJSON(detailMovieInfoUrl, { format: "json" })
                      .done(function (detailInfo) {
                          var movieTrailerUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAVUHIT23VFvUNSfVDcblA5opQZkQ7SE94&q=' + entry.original_title;
                          $.getJSON(movieTrailerUrl, { format: "json" })
                      .done(function (movieTrailer) {                         
                          resetMovieInfo();
                          movieInfo.genreIDs = {};
                          var i = 0;
                          entry.genre_ids.forEach(function (genre) {
                              movieInfo.genreIDs[i] = { ID: genre };
                              i++
                          })
                          i = 0;
                          movieInfo.themoviedb_id += entry.id;
                          movieInfo.original_title += entry.original_title;
                          movieInfo.overview += entry.overview;
                          movieInfo.release_date += entry.release_date;
                          movieInfo.vote_average += entry.vote_average;
                          movieInfo.cast += detailInfo.cast[0].name + ", " + detailInfo.cast[1].name + ", " + detailInfo.cast[2].name;
                          movieInfo.crew += detailInfo.crew[0].name + ", " + detailInfo.crew[1].name + ", " + detailInfo.crew[2].name;
                          movieInfo.trailer += movieTrailer.items[0].id.videoId;
                          movieInfo.poster_url += entry.poster_path;

                      console.log(movieInfo);
                      checkValidId(movieInfo, movieUrl, movieInfo.themoviedb_id);
                      });
                      })
                  })
              })
          }
          counter++;
          if (counter < 214) { test(counter); };
          
    }
    //******************************

  FB.api('/me/movies', function (response) {        
      response.data.forEach(function (entry) {         
          //userInfo.Movies += entry.id+'#';
          var a = entry.id;
          FB.api(a + '/picture?width=130&height=200', function (response) {
              var element = document.getElementById("UserMovies");
              var myurl = response.data.url;

              FB.api(a, { fields: 'link' }, function (response) {
                  //**************
                  var url = 'http://api.themoviedb.org/3/',
                  mode = 'search/movie?query=',
                  input,
                  movieName,
                  key = '&api_key=dbe4d58f24fb7262fd2fd134e6e21ea1';
                  var input = entry.name,
                  movieName = encodeURI(input);
                  var finalUrl = url + mode + movieName + key;
                  var youTubeKey = 'AIzaSyAVUHIT23VFvUNSfVDcblA5opQZkQ7SE94';
                  
                  //*************
                  
                  $.getJSON(finalUrl, { format: "json" })
                      .done(function (data) {                            
                          var detailMovieInfoUrl = url + 'movie/' + data.results[0].id + '/credits' + '?api_key=dbe4d58f24fb7262fd2fd134e6e21ea1';
                          $.getJSON(detailMovieInfoUrl, { format: "json" })
                          .done(function (detailInfo) {
                              var movieTrailerUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAVUHIT23VFvUNSfVDcblA5opQZkQ7SE94&q=' + movieName;
                              $.getJSON(movieTrailerUrl, { format: "json" })
                          .done(function (movieTrailer)
                          {
                              //   resetMovieInfo();
                              //   movieInfo.themoviedb_id += data.results[0].id;
                              //   movieInfo.genreIDs += '{' + data.results[0].genre_ids + '}';
                              //   movieInfo.original_title += data.results[0].original_title;
                              //   movieInfo.overview += data.results[0].overview;
                              //   movieInfo.release_date += data.results[0].release_date;
                              //   movieInfo.vote_average += data.results[0].vote_average;
                              //   movieInfo.cast += detailInfo.cast[0].name + ", " + detailInfo.cast[1].name + ", " + detailInfo.cast[2].name;
                              //   movieInfo.crew += detailInfo.crew[0].name + ", " + detailInfo.crew[1].name + ", " + detailInfo.crew[2].name;
                              //   movieInfo.trailer += movieTrailer.items[0].id.videoId;                             
                              //   checkValidId(movieInfo, movieUrl, movieInfo.themoviedb_id);                               
                                
                              //    element.innerHTML = element.innerHTML + '<div class="sve"><div class="FilmItem">' +
                              //                                                '<div class="Infomation">' +
                              //                                                       '<div class="posterFilm">' +
                              //                                                            '<a href="' + response.link + '"> <img src=' + myurl + ' alt="' + entry.name + 'hspace="3px" vspace="3px"  style="width:150px;height:220px;"></a>' +
                              //                                                       '</div>' +
                              //                                                       '<div class="NaslovIOpis" >' +
                              //                                                            '<div class="Naslov"> Title: ' + entry.name +
                              //                                                            '</div>' +
                              //                                                            '<div class="releaseDate"><b>Release date:</b> ' + data.results[0].release_date +
                              //                                                            '</div>' +
                              //                                                            '<div class="cast"><b>Cast:</b> ' + movieInfo.cast +
                              //                                                            '</div>' +
                              //                                                            '<div class="Opis"></br><b>Overwiev:</b></br> ' + data.results[0].overview +
                              //                                                            '</div>' +
                              //                                                        '</div>' +
                              //                                                        '<div class="rating" style="float:left;margin-right:10px;margin-top:10px;"><img src="/Content/IMDb.png" style="width:50px; height:30px;margin-top:-1.5px;">' + data.results[0].vote_average +
                              //                                                        '<img src="/Content/youtube.png" style="width:35px;height:22px;margin-top:-2px;margin-left:15px;border-right:1px solid black;"><button type="button" style="background-color:#e64a41;border:none;color:white;" onclick="toggleOnOff(' + movieInfo.themoviedb_id + ')">Watch Trailer!</button></div></div>' +
                              //                                                 
                              //                                            '</div><div class="Trailer" id="' + movieInfo.themoviedb_id + '"><iframe display:block title="YouTube video player" class="youtube-player" type="text/html" width="540" height="390" src=http://www.youtube.com/embed/' + movieInfo.trailer + ' frameborder="0" allowFullScreen></iframe></div></div>';
                              //    
                          });
                          });
                      });
              });
                });
            });
  });
    


    function giveMeMyMovies()
    {
        var movieUrl = 'api/MovieInfo/';
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: movieUrl,
            type: 'GET',
            contentType: 'application/json;',
            //data: JSON.stringify(data.Facebook_ID),
            success: function (valid) {
                if (valid) {
                } else {
                }
            }
        });
    }

    function getFromDataBase(url)
    {
       
    }
    



    resetMovieInfo = function()
    {
        movieInfo.themoviedb_id = "";
        movieInfo.original_title = "";
        movieInfo.overview = "";
        movieInfo.release_date = "";
        movieInfo.vote_average = "";
        movieInfo.cast = "";
        movieInfo.crew = "";
        movieInfo.trailer = "";
        movieInfo.genreIDs = "";
        movieInfo.poster_url = "";
    }

    resetGenreInfo = function()
    {
        genre.genre_id = "";
        genre.genre_type = "";
    }

    waitMe = function () {
        if (document.getElementById('wait').style.display == "none")
        {
            document.getElementById('wait').style.display = 'block';
            document.getElementById('start').style.display = 'block';
        }
        setTimeout(
       function () {
           
           document.getElementById('wait').style.display = 'none';
           document.getElementById('start').style.display = 'none';
       }, 10000);
    }
    
    toggleOnOff = function(id)
    {
        if(document.getElementById(id).style.display == "none")
        {
            document.getElementById(id).style.display = 'block';
        }
        else
        {
            document.getElementById(id).style.display = 'none';
        }
    }
    //
    waitMe();
        //
    FB.api(a + '/picture?width=100&height=100', function (response) {
        //console.log(response);
    });
}

