$(document).ready(function () {
    $("#start-button").on("click", function () {
        event.preventDefault();
        getVideo();
        getExcercisecategories();
        var workoutWindow = $("#workoutChooser");
        workoutWindow.addClass("hide");
        

    })

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(elems, options);
      });
    
      // Or with jQuery
    
      $('.dropdown-trigger').dropdown();

    function getVideo() {
        var youtubeForm = $("#aligned-music").val()
        var musicGenerator = ("music%20" + youtubeForm);
        $.ajax({
          type: 'GET',
          url: 'https://www.googleapis.com/youtube/v3/search',
          data: {
              key: "AIzaSyAJ1ag4z7gAcPM3dQ14tX7COYqKiYeK6B4",
              q: musicGenerator,
              part: 'snippet',
              maxResults: 1,
              type: 'video',
              videoEmbeddable: true,
          },
          success: function(data){
              $("#youtube").attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId + "?autoplay=1") 
              console.log(youtubeForm)
          },
        })
        }
   


    //Categories are "arms", "legs", "abs", "chest", "back", "shoulders", "calves".
    function getExcercisecategories() {

        $.ajax({
            type: "Get",
            url: "https://wger.de/api/v2/exercisecategory/?format=json",
            dataType: "json",
            headers: {
                Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507"
            },
            success: function (response) {
                console.log(response)
                var results = response.results;
                for (var i = 0; i < results.length; i++) {
                    //displays results by "id"
                    getExercises(results[i].id);
                    //console.log(results[i]);
                }
            }
        })
    }
    //function will display filtered results based on the intial getExercise category function.
    function getExercisesuccess(response, filteredresults) {
        var results = response.results;

        for (var i = 0; i < results.length; i++) {
            //filtering results by if exercise has "name" only.  Also filtering results that do not contain license author=test.
            if (results[i].name && results[i].license_author !== "admintest123") {
                filteredresults.push(results[i])
            }
            //console.log(results[i]);
        }
        //console.log(filteredresults);
        //Loop will go through results again and filter out the next 20 exercises with "names".  Not all exercises in the api are named properly.
        if (filteredresults.length === 0) {
            $.ajax({
                type: "Get",
                url: response.next,
                dataType: "json",
                headers: {
                    Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507"
                },
                //recursive function, will keep calling until filter results.length is > 0. Instead of stoping at the alloted "20" results.
                success: function (results) {
                    getExercisesuccess(results, filteredresults)

                }
            })
        }

    }
    //exercises on api are listed by id.
    //each category is linked to individual apis, which resulted in using
    function getExercises(id) {
        var filteredresults = [];
        $.ajax({
            type: "Get",
            //filter by language by adding language query to url. English is (2) in url link.
            //Exercise category includes exercise description.
            url: "https://wger.de/api/v2/exercise/?format=json&language=2&category=" + id,
            dataType: "json",
            headers: {
                Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507"
            },
            success: function (resultscategory) {
                getExercisesuccess(resultscategory, filteredresults)
                $.ajax({
                    type: "Get",
                    url: "https://wger.de/api/v2/exerciseimage/" + id + "/thumbnails/?language=2",
                    dataType: "json",
                    headers: {
                        Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507"
                    },
                    success: function (resultsimgs) {
                        console.log("exercisenumber" + id)
                        console.log(resultscategory)
                        console.log(resultsimgs)
                        $("#workout").empty();
                        for(var i = 0; i < resultscategory.results.length; i++){
                            var card = $("<div>").addClass("card")
                            var cardbody = $("<div>").addClass("card-body" ).text(resultscategory.results[i].description)
                            var category = $("<p>").text(resultscategory.results[i].category)
                            var img = $("<img>").attr("src","https://wger.de"+resultsimgs.large_cropped.url)
                            card.append(img, category, cardbody)
                            
                            $("#workout").append(card)

                        }
                        

                    }

                })
            }


        })

    }



})
        //console.log(filteredresults)