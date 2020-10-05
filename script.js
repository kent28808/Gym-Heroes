$(document).ready(function () {
    $("#start-button").on("click", function () {
        event.preventDefault();
        getVideo();
        //getExcercisecategories();
        getExercises(choiceid);
        $("#dropdownCard").attr("class", "hide");
        $("#imgCard").removeClass("hide");

    })


    //event listener for drop choice options linking workout id with thumbnails and descriptions for each.
    var choiceid = 8
    $(document).on("click", ".dropChoice", function (event) {
        event.preventDefault();
        choiceid = $(this).attr("id");
        console.log(choiceid);
    })
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(elems, options);
        var workoutType = $(".dropChoice").val()
        console.log(workoutType)
    });

    // Or with jQuery

    $('.dropdown-trigger').dropdown();

    function getVideo() {
        var youtubeForm = $("#autocomplete-input").val()
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
            success: function (data) {
                $("#youtube").attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId + "?autoplay=1")
                console.log(youtubeForm)
            },
        })
    }




    //function will display filtered results based on the intial getExercise category function.
    function getExercisesuccess(response, filteredresults) {
        var results = response.results;

        for (var i = 0; i < results.length; i++) {
            //filtering results by if exercise has "name" only.  Also filtering results that do not contain license author=test.
            if ((results[i].name && results[i].license_author !== "admintest123") && (results[i].license_author !== "test+++") && (results[i].license_author !== "Magenta")

            ) {
                filteredresults.push(results[i]);
            }
            // console.log("This is filtered data", results[i]);
        } console.log("This is filtered data", filteredresults);
        //console.log(filteredresults);
        //Loop will go through results again and filter out the next 20 exercises with "names".  Not all exercises in the api are named properly.
        if (filteredresults.length === 0) {
            $.ajax({
                type: "Get",
                url: response.next,
                dataType: "json",
                headers: {
                    Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507",
                },
                //recursive function, will keep calling until filter results.length is > 0. Instead of stoping at the alloted "20" results.
                success: function (results) {
                    getExercisesuccess(results, filteredresults);

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
                Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507",
            },
            success: function (resultscategory) {
                getExercisesuccess(resultscategory, filteredresults);



                $.ajax({
                    type: "Get",
                    url: "https://wger.de/api/v2/exerciseimage/" + id + "/thumbnails/?language=2",
                    dataType: "json",
                    headers: {
                        Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507",
                    },
                    success: function (resultsimgs) {

                        var imageURL = ("https://wger.de" + resultsimgs.medium_cropped.url);
                        $(".workoutImg").attr("src", imageURL);


                    }

                })
            }


        })

    }



})
        //console.log(filteredresults)