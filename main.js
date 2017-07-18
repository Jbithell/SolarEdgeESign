//Get function
(function($) {
    $.QueryString = (function(paramsArray) {
        let params = {};

        for (let i = 0; i < paramsArray.length; ++i)
        {
            let param = paramsArray[i]
                .split('=', 2);

            if (param.length !== 2)
                continue;

            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }

        return params;
    })(window.location.search.substr(1).split('&'))
})(jQuery);



//Begin code
var sitecode = $.QueryString["code"];
var apikey = $.QueryString["key"];

var getdata = function () {
    $.jsonp({
        "url": "https://monitoringapi.solaredge.com/site/" + sitecode + "/energy.json?timeUnit=DAY&endDate=" + $.datepicker.formatDate('yy-mm-dd', new Date()) + "&startDate=" + $.datepicker.formatDate('yy-mm-dd', new Date()) + "&api_key=" + apikey + "&callback=?",
        "data": {},
        "success": function (data) {
            console.log(data)
        },
        "error": function (d, msg) {
            console.log(msg);
        }
    });
};
$( document ).ready(function() {
    getdata();
});

