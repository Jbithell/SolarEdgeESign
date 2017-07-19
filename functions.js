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

//Rounding Function
function round(value, precision) {
    //var multiplier = Math.pow(10, precision || 0);
    ///return Math.round(value * multiplier) / multiplier;
    return value.toFixed(precision)
}

//Data conversion function
var convertdata = function(data) {
    if (data < 1001) {
        return round(data,0) + " <sub>Wh</sub>";
    } else if (data > 1000000) {
        return round(data/1000000,2) + " <sub>MWh</sub>";
    } else {
        return round(data/1000,1) + " <sub>kWh</sub>";
    }
};

