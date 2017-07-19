var sitecode, apikey; //Set main function scope

var getdata = function () {
    console.log("Updating Data");

    var oneyearago = new Date();
    oneyearago.setTime(oneyearago.getTime() - 12614200000);

    var onemonthago = new Date();
    onemonthago.setTime(onemonthago.getTime() - 2419200000);

    var oneweekago = new Date(); //A week here is 5 days
    oneweekago.setTime(oneweekago.getTime() - 345600000);

    var now = new Date();
    $.jsonp({
        "url": "https://monitoringapi.solaredge.com/site/" + sitecode + "/energy.json?timeUnit=DAY&endDate=" + $.datepicker.formatDate('yy-mm-dd', new Date()) +  "&startDate=" + $.datepicker.formatDate('yy-mm-dd', oneyearago) + "&api_key=" + apikey + "&version=1.0.0&callback=?",
        "data": {},
        "success": function (data) {
            var thisdata = data.energy.values;

            var today = thisdata[thisdata.length-1].value;

            $("#todaysofar").html(convertdata(today));
            var yesterday = thisdata[thisdata.length-2].value;
            $("#yesterday").html(convertdata(yesterday));

            var week = 0;
            for (i = 1; i < 8; i++) {
                week += thisdata[thisdata.length-i].value
            }
            $("#week").html(convertdata(week));

            var month = 0;
            for (i = 1; i < 31; i++) {
                month += thisdata[thisdata.length-i].value
            }
            $("#month").html(convertdata(month));
        },
        "error": function (d, msg) {
            //HTTP 403 – forbidden s - if number of requests exceeds 300
            console.log(msg)
        }
    });
    $.jsonp({
        "url": "https://monitoringapi.solaredge.com/site/" + sitecode + "/power.json?&endTime=" + $.datepicker.formatDate('yy-mm-dd', now) + " " + now.getHours() + ":" + now.getMinutes() + ":00" + "&startTime=" + $.datepicker.formatDate('yy-mm-dd', oneweekago) + " 00:00:00&api_key=" + apikey + "&version=1.0.0&callback=?",
        "data": {},
        "success": function (data) {
            var times = [], values = [];
            $.each( data.power.values, function( index, value ){
                times.push(value.date);

                values.push(value.value);
            });
            console.log();
            var ctx = document.getElementById("lastWeekGraph").getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: times,
                    xValueType: "dateTime",
                    label: "",
                    datasets: [{
                        data: values,
                        fill:false,
                        borderColor:"rgb(0, 0, 0)",
                    }]

                },
                options: {
                    animation: {
                        duration: 0, // Turn off animations as this is for a screen
                    },
                    hover: {
                        animationDuration: 0, // Turn off animations as this is for a screen
                    },
                    responsiveAnimationDuration: 0, // Turn off animations as this is for a screen
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            position: 'bottom',
                            time: {
                                unit: "day",
                            },
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Power (W)'
                            }
                        }]
                    },
                }
            });
            $("#lastupdated").html("Updated: " + Date());
        },
        "error": function (d, msg) {
            console.log(msg)
        }
    });
};
$( document ).ready(function() {
    if (typeof $.QueryString["black"] !== 'undefined' && $.QueryString["black"] == "true") {
        //Black background mode
        console.log("Black Background")
        $('body').css('background-color', 'black');
        $('body').css('color', 'white');
    }
    sitecode = $.QueryString["code"];
    apikey = $.QueryString["key"];
    if (typeof sitecode === 'undefined' || !sitecode || typeof apikey === 'undefined' || !apikey || sitecode.length <6 || apikey.length <1 ) {
        bootbox.dialog({
            message: '<p class="text-center">Please pass a code and api key as get parameters - see <a target="_blank" href="https://github.com/Jbithell/SolarEdgeESign/blob/master/README.md">documentation</a></p>',
            closeButton: false
        });
    } else {
        getdata();
        setInterval(function() {
            var dateForNowHour = new Date(); // for now
            if (dateForNowHour.getHours() > 6 && dateForNowHour.getHours() < 21) { //Start display just after 6 and stop updating it around 9pm -> There's no point as there's no more sunshine!!!
                getdata();
            } else {
                console.log("Not updating because of dusk hours");
            }
        }, 1000 * 60 * 30);
    }

});

