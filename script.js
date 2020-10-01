$(document).ready(function () {
    $("#choose-button").on("click", function () {
        event.preventDefault()
        getVideo();
        getExcercisecategories();

    })

    function getVideo() {
        $.ajax({
            type: "GET",
            url: "'https://www.googleapis.com/youtube/v3/search?part=snippet&q=music&key=AIzaSyAJ1ag4z7gAcPM3dQ14tX7COYqKiYeK6B4",
            dataType: "json",
            success: function (response) {
                console.log(response);
            }
        }
        )
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
                    getExercises(results[i].id)
                    console.log(results[i]);
                }
            }
        })
    }
    //function will display filtered results based on the intial getExercise category function.
    function getExercisesuccess(response, filteredresults){
        var results = response.results;
        
        for (var i = 0; i < results.length; i++) {
        //filtering results by if exercise has "name" only.  Also filtering results that do not contain license author=test.
            if(results[i].name && results[i].license_author !== "admintest123") {
            filteredresults.push(results[i])
        }
            //console.log(results[i]);
        }
        //console.log(filteredresults);
        //Loop will go through results again and filter out the next 20 exercises with "names".  Not all exercises in the api are named properly.
        if(filteredresults.length === 0){
            $.ajax({
                type: "Get",
                url: response.next,
                dataType: "json",
                headers: {
                    Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507"
                },    
                //recursive function, will keep calling until filter results.length is > 0. Instead of stoping at the alloted "20" results.
                success: function(results){
                    getExercisesuccess(results, filteredresults)
                }
            })
        }
        
    }

    function getExercises(id){
        var filteredresults = [];
        $.ajax({
            type: "Get",
            //filter by language for english (2) in url link.
            url: "https://wger.de/api/v2/exercise/?format=json&language=2&category=" + id,
            dataType: "json",
            headers: {
                Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507"
            },
            success: function(results){
                getExercisesuccess(results, filteredresults)
            }
              
               
            
        })
        console.log(filteredresults)
    }

})