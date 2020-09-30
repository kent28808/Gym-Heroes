$(document).ready(function (){
    $("#submit-button").on("click", function() {
        event.preventDefault()
        getVideo();
        getExcercise();
        
    })

function getVideo(){
    $.ajax({
        type: "GET",
        url: "'https://www.googleapis.com/youtube/v3/search?part=snippet&q=music&key=AIzaSyAJ1ag4z7gAcPM3dQ14tX7COYqKiYeK6B4",
        dataType: "json",
        success: function(response){
        console.log(response);
}}
    )}


function getExcercise (){
    
    $.ajax({
        type: "Get",
        url: "https://wger.de/api/v2/exercisecategory/?format=json",
        dataType: "json",
        headers: {
            Authorization: "Token 16a85a599865174319c1a5f12bced324e58d7507"
        },
        success: function(response) {
        console.log(response)

        }
    })
}
})