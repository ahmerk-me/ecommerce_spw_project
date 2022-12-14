/*scroll to top*/

$(document).ready(function () {
    $(function () {
        $.scrollUp({
            scrollName: 'scrollUp', // Element ID
            scrollDistance: 300, // Distance from top/bottom before showing element (px)
            scrollFrom: 'top', // 'top' or 'bottom'
            scrollSpeed: 300, // Speed back to top (ms)
            easingType: 'linear', // Scroll to top easing 
            animation: 'fade', // Fade, slide, none
            animationSpeed: 200, // Animation in speed (ms)
            scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
            //scrollTarget: false, // Set a custom target element for scrolling to the top
            scrollText: '<i class="fa fa-angle-up"></i>', // Text for element, can contain HTML
            scrollTitle: false, // Set a custom <a> title if required.
            scrollImg: false, // Set true to use image
            activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
            zIndex: 2147483647 // Z-Index for the overlay
        });
    });
    $("body").on("click", ".btn-subscribe", function() {
        $.ajax({
            url:"/subscribe",
            method: "POST",
            data : {
                email : $("#inp-subscribe").val()
            },
            cache : false,
            success : function (data) {          
                    alert("Thank you for subscribing");
            },
            error : function () {
                // some error handling part
                alert("Oops! Something went wrong. Please try again later");
            }
        });
          
    })

    // $("body").on("click", ".btn-contact", function() {
    //     $.ajax({
    //         url:"/contact-us",
    //         method: "POST",
    //         data : {
    //             fullName : $("#inp-fullName").val(),
    //             email : $("#inp-email").val(),
    //             subject : $("#inp-fullName").val(),
    //             contactMessage : $("#inp-message").val()
    //         },
    //         cache : false,
    //         success : function (data) {          
    //                 alert("Thank you for your message. We will get back to you as soon as possible.");
    //         },
    //         error : function () {
    //             // some error handling part
    //             alert("Oops! Something went wrong. Please try again later");
    //         }
    //     });
          
    // })
});


function initMap() {
    map = new google.maps.Map(document.getElementById('gmap'), {
        center: {lat: 60.222, lng: 24.805},
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: {lat: 53.349018842521396, lng: -6.2426923949376105}, 
        map: map,
        title: 'NCI Store'
    });
    marker.setMap(map);

    var contentString = '<b>NCI Store</b>' +
        '<p>Get your official NCI merch<br>' +
        'Get your official NCI merch<br>' +
        'Proud NCI-ian!!!</p>' +
        '<p>Address: Mayor Street Lower, IFSC, Dublin 1<br>' +
        'Tel: Group-8 012-3456789</p>';
    var infoWindows = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindows.open(map, marker);
}