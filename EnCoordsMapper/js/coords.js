function FindCoords(selector) {
    var degRegex = /(\s|\>|^)((?:([-+])|([NS])\s?)?([1-8]?\d\.(?:\d{0,8})?|90\.(?:0{0,8})?)\°?)(\D+?.*?)((?:([-+])|([EW])\s?)?((?:180\.(?:0{0,8})?|(?:(?:1[0-7]\d)|(?:0?\d?\d))\.(?:\d{0,8})?))\°?)/gmi;
    var degMinRegex = /(\s|\>|^)((?:(?:([-+])|([NS])\s?)?([1-8]?\d)\°(?:([0-5]?\d(?:\.\d{1,4})?)\')?|(90)\°(?:(0{1,2}(?:\.0{1,4})?)\')?)\s?([NS]?))(\D+?.*?)((?:([-+])|([EW])\s?)?(?:(180)\°(?:(0{1,2}(?:\.0{1,4})?)\')?|(?:(1[0-7]\d)|(0?\d?\d))\°(?:([0-5]?\d(?:\.\d{1,4})?)\')?)\s?([EW]?))/gmi;
    var degMinSecRegex = /(\s|\>|^)((?:([-+])|([NS])\s?)?(?:([1-8]?\d)\°(?:([0-5]?\d)\'(?:([0-5]?\d(?:\.\d{1,4})?)\")?)?|(90)\°(?:(0{1,2})\'(?:(0{1,2}(?:\.0{1,4})?)\")?)?)\s?([NS]?))(\D+?.*?)((?:([-+])|([EW])\s?)?(?:(180)\°(?:(0{1,2})\'(?:(0{1,2}(?:\.0{1,4})?)\")?)?|(?:(1[0-7]\d)|(0?\d?\d))\°(?:([0-5]?\d)\'(?:([0-5]?\d(?:\.\d{1,4})?)\")?)?)\s?([EW]?))/gmi;

    $(selector).each(function() {
        var $content = $(this);
        $content.html($content.html().replace(degMinSecRegex, "$1<span class='coords' data-coords='deg-min-sec' data-lat-hem='$3$4$11' data-lat-deg='$5$8' data-lat-min='$6$9' data-lat-sec='$7$10' data-lng-hem='$14$15$23' data-lng-deg='$16$19$20' data-lng-min='$17$21' data-lng-sec='$18$22'><span class='latitude'>$2</span>$12<span class='longitude'>$13</span></span>"));
        $content.html($content.html().replace(degMinRegex, "$1<span class='coords' data-coords='deg-min' data-lat-hem='$3$4$9' data-lat-deg='$5$7' data-lat-min='$6$8' data-lng-hem='$12$13$19' data-lng-deg='$14$16$17' data-lng-min='$15$18'><span class='latitude'>$2</span>$10<span class='longitude'>$11</span></span>"));
        $content.html($content.html().replace(degRegex, "$1<span class='coords' data-coords='deg' data-lat-hem='$3$4' data-lat-deg='$5' data-lng-hem='$8$9' data-lng-deg='$10'><span class='latitude'>$2</span>$6<span class='longitude'>$7</span></span>"));
    });
}

function InsertMap(selector, lat, lng) {
    $("<div>", {
            class: "spoiler"
        })
        .append($("<span>", {
                class: "spoiler-title"
            }).text("Карта")
            .click(function() {
                $(this).parent("div.spoiler")
                    .toggleClass("_opened")
                    .children("div.spoiler-content").toggle("fold");
            }))
        .append($("<div>", {
                class: "spoiler-content",
            }).hide()
            .append($("<iframe>", {
                src: chrome.extension.getURL("html/embedMap.html?lat=" + lat + "&lng=" + lng),
                frameborder: "0",
            }).attr("width", "600").attr("height", "450")))
        .insertAfter($(selector));
}

$(function() {
    FindCoords(".content p");

    $("[data-coords]").each(function() {
        var $this = $(this);
        var coordsType = $this.data("coords");
        var latHem = $this.data("lat-hem");
        var latDeg = $this.data("lat-deg");
        var latMin = $this.data("lat-min");
        var latSec = $this.data("lat-sec");
        var latitude = latDeg + (latMin ? (latMin + (latSec ? latSec / 60 : 0)) / 60 : 0);
        if (latHem.startsWith("-") || latHem.startsWith("S"))
            latitude = -latitude;
        else latitude = +latitude;

        var lngHem = $this.data("lng-hem");
        var lngDeg = $this.data("lng-deg");
        var lngMin = $this.data("lng-min");
        var lngSec = $this.data("lng-sec");
        var longitude = lngDeg + (lngMin ? (lngMin + (lngSec ? lngSec / 60 : 0)) / 60 : 0);
        if (lngHem.startsWith("-") || lngHem.startsWith("W"))
            longitude = -longitude;

        InsertMap(this, latitude, longitude);
    });
});
