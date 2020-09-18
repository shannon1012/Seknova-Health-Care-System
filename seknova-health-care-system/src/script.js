var year = new Date().getFullYear().toString();
var month = (new Date().getMonth() + 1).toString();
var date = (new Date().getDate() - 7).toString();
function timeAdd0(str) {
  if (str.length <= 1) {
    str = "0" + str;
  }
  return str;
}
year = timeAdd0(year);
month = timeAdd0(month);
date = timeAdd0(date);
var dateControl = document.querySelector('input[type="date"]');
dateControl.value = year + "-" + month + "-" + date;

function SendFormData() {
  var formElement = document.getElementById("form");
  var StartDateTime = [],
    EndDateTime = [];
  var UserID = String(formElement[0].value);
  StartDateTime.push(formElement[1].value[8]);
  StartDateTime.push(formElement[1].value[9]);
  StartDateTime.push("/");
  StartDateTime.push(formElement[1].value[5]);
  StartDateTime.push(formElement[1].value[6]);
  StartDateTime.push("/");
  StartDateTime.push(formElement[1].value[0]);
  StartDateTime.push(formElement[1].value[1]);
  StartDateTime.push(formElement[1].value[2]);
  StartDateTime.push(formElement[1].value[3]);
  StartDateTime = String(StartDateTime);
  StartDateTime = StartDateTime.replace(/,/g, "");
  StartDateTime = StartDateTime.concat("T00:00:00");

  var enddatetime = String(formElement[1].value);
  EndDateTime = new Date(
    parseInt(enddatetime.substring(0, 4)),
    parseInt(enddatetime.substring(5, 7)),
    parseInt(enddatetime.substring(8, 10))
  );
  Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
  };
  EndDateTime = EndDateTime.addDays(parseInt(formElement[2].value) * 7);
  var year = EndDateTime.getFullYear().toString();
  var month = EndDateTime.getMonth().toString();
  var date = EndDateTime.getDate().toString();
  function timeAdd0(str) {
    if (str.length <= 1) {
      str = "0" + str;
    }
    return str;
  }
  year = timeAdd0(year);
  month = timeAdd0(month);
  date = timeAdd0(date);
  document.getElementById("EndDateTime").innerHTML =
    year + "/" + month + "/" + date;
  //system time

  var NowDate = new Date();
  var year = NowDate.getFullYear();
  var month = NowDate.getMonth() + 1;
  var date = NowDate.getDate();
  
  function addMonths(date, months) {
    var NowDateCompare = NowDate.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != NowDateCompare) {
      date.setDate(0);
    }
    return date;
}
  NowDateCompare = addMonths(NowDate,1)
  
  document.getElementById("time").innerHTML = 
    year + "年" + month + "月" + date + "日";
  setTimeout("ShowTime()", 1000);
  

  if (NowDateCompare.valueOf() < EndDateTime.valueOf()) {
    alert("Time interval must be at least one week!");
  }

  var Enddatetime = date + "/" + month + "/" + year;
  Enddatetime = Enddatetime.concat("T00:00:00");
  //set variables and user information
  var SystemTime = [];
  var EventsStartTime = [],
    EventsEndTime = [];
  var Min = [],
    Max = [],
    Q1 = [],
    Q2 = [],
    Q3 = [],
    MaxMinRange = [],
    PercentageOfGlucose = [],
    Data = [],
    boxcolor = [];
  var SD,
    eA1C,
    CV,
    DataSufficency,
    AUC,
    TimesOfHypo,
    TimesOfHyper,
    EventCount,
    Mean,
    RecordsMaxCount;
  var RecordsIntervalTime = "";

  var information = {
    CmdID: 9,
    UserID: UserID,
    StartDatetime: StartDateTime,
    EndDatetime: Enddatetime
  };

  //get data with jquery
  $.ajax({
    url: "https://05q4eqlbt3.execute-api.us-east-1.amazonaws.com/default/web",
    data: JSON.stringify(information),
    dataType: "json",
    async: false,
    type: "POST",
    success: function (data) {
      //simple calculations
      SD = data.SD;
      eA1C = data.eA1C;
      CV = data.CV;
      DataSufficiency = data.DataSufficiency;
      AUC = data.AUC;
      TimesOfHypo = data.TimesOfHypo;
      TimesOfHyper = data.TimesOfHyper;
      document.getElementById("sd").innerHTML = SD;
      document.getElementById("ea1c").innerHTML = eA1C;
      document.getElementById("cv").innerHTML = CV;
      document.getElementById("datasufficiency").innerHTML =
        DataSufficiency + "%";
      document.getElementById("auc").innerHTML = AUC;
      document.getElementById("timesofhypo").innerHTML = TimesOfHypo;
      document.getElementById("timesofhyper").innerHTML = TimesOfHyper;

      //events count and event datails
      EventsCount = data.EventsCount;
      document.getElementById("eventscount").innerHTML = EventsCount;
      //turn json into talbes(Events)
      Data = data.Events;
      var forTable = $(".for-table tbody");
      var eventsum = Data.length;
      for (var i = 0; i < eventsum; i++) {
        forTable.append(
          "<tr>" +
            "<td>" +
            "#" +
            (i + 1) +
            "</td>" +
            "<td>" +
            Data[i].StartTime +
            "</td>" +
            "<td>" +
            Data[i].EndTime +
            "</td>" +
            "<td>" +
            Data[i].Note +
            "</td>" +
            "</tr>"
        );
      }

      //set events highlight data
      for (var i = 0; i < 15; i++) {
        if (Data[i] != null) {
          EventsStartTime.push(Data[i].StartTime);
          EventsEndTime.push(Data[i].EndTime);
        } else {
          EventsStartTime.push("none");
          EventsEndTime.push("none");
        }
      }

      //record informations(system time code is written after ajax code)
      RecordsIntervalTime = data.RecordsIntervalTime;
      RecordsMaxCount = data.RecordsMaxCount;
      Mean = data.Mean;
      document.getElementById(
        "recordsintervaltime"
      ).innerHTML = RecordsIntervalTime;
      document.getElementById("recordsmaxcount").innerHTML = RecordsMaxCount;
      document.getElementById("mean").innerHTML = Mean;

      //set data for charts
      //linechart
      for (var i = 0; i < data["Records"].length; i++) {
        SystemTime.push(data.Records[i].SystemTime);
        Min.push(data.Records[i].Min);
        Max.push(data.Records[i].Max);
        Q1.push(data.Records[i].Q1);
        Q2.push(data.Records[i].Q2);
        Q3.push(data.Records[i].Q3);
      }

      //barchart
      MaxMinRange.push(data.MinRangeAtSleep);
      MaxMinRange.push(data.MaxRangeAtSleep);
      MaxMinRange.push(data.MinRangeAtWake);
      MaxMinRange.push(data.MaxRangeAtWake);
      MaxMinRange.push(data.MinRangeAt24h);
      MaxMinRange.push(data.MaxRangeAt24h);

      //piechart
      PercentageOfGlucose.push(data.PercentageOfL2Hypo);
      PercentageOfGlucose.push(data.PercentageOfL1Hypo);
      PercentageOfGlucose.push(data.PercentageOfNormal);
      PercentageOfGlucose.push(data.PercentageOfL2Hyper);
      PercentageOfGlucose.push(data.PercentageOfL1Hyper);
    },
    error: function () {
      alert("error");
    }
  });

  //charts
  //set chart colors
  var chartColors = {
    transparent: "rgb(0,0,0,0)",
    red: "rgb(197, 23, 41)",
    darkgreen: "rgb(0,100,0)",
    yellow: "rgb(250, 250, 0)",
    lightgrey: "rgb(200, 200, 200)",
    darkgrey: "rgb(120, 120, 120)",
    darkorchid: "rgb(153,50,204)",
    blue: "rgb(0, 0, 150)"
  };

  //linechart
  var config = {
    type: "line",
    data: {
      labels: SystemTime,
      datasets: [
        {
          label: "Max",
          backgroundColor: chartColors.lightgrey,
          borderColor: chartColors.red,
          borderWidth: 2,
          data: Max,
          fill: false,
          lineTension: 1
        },
        {
          label: "Q3",
          backgroundColor: chartColors.lightgrey,
          borderColor: chartColors.yellow,
          borderWidth: 2,
          data: Q3,
          fill: false,
          lineTension: 1
        },
        {
          label: "Q2",
          fill: false,
          backgroundColor: chartColors.lightgrey,
          borderColor: chartColors.darkgreen,
          borderWidth: 2,
          data: Q2,
          fill: false,
          lineTension: 1
        },
        {
          label: "Q1",
          backgroundColor: chartColors.lightgrey,
          borderColor: chartColors.blue,
          borderWidth: 2,
          data: Q1,
          fill: "-2",
          lineTension: 1
        },

        {
          label: "Min",
          backgroundColor: chartColors.lightgrey,
          borderColor: chartColors.darkorchid,
          borderWidth: 2,
          data: Min,
          fill: false,
          lineTension: 1
        }
      ]
    },
    options: {
      annotation: {
        annotations: [
          {
            id: "event1",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[0],
            xMax: EventsEndTime[0],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event2",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[1],
            xMax: EventsEndTime[1],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event3",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[2],
            xMax: EventsEndTime[2],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event4",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[3],
            xMax: EventsEndTime[3],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event5",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[4],
            xMax: EventsEndTime[4],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event6",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[5],
            xMax: EventsEndTime[5],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event7",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[6],
            xMax: EventsEndTime[6],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event8",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[7],
            xMax: EventsEndTime[7],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event9",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[8],
            xMax: EventsEndTime[8],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event10",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[9],
            xMax: EventsEndTime[9],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event11",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[10],
            xMax: EventsEndTime[10],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event12",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[11],
            xMax: EventsEndTime[11],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event13",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[12],
            xMax: EventsEndTime[12],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event14",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[13],
            xMax: EventsEndTime[13],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          },
          {
            id: "event15",
            drawTime: "beforeDatasetsDraw",
            type: "box",
            xScaleID: "x-axis-0",
            yScaleID: "y-axis-0",
            xMin: EventsStartTime[14],
            xMax: EventsEndTime[14],
            yMin: 2,
            yMax: 498,
            backgroundColor: chartColors.transparent,
            borderColor: chartColors.darkgrey,
            borderWidth: 2
          }
        ]
      },
      responsive: true,
      tooltips: {
        mode: "index",
        intersect: false
      },
      hover: {
        mode: "nearest",
        intersect: true
      },
      elements: { point: { radius: 0 } },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Time"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 500
            }
          }
        ]
      }
    }
  };

  var line = document.getElementById("14days").getContext("2d");
  var myLine = new Chart(line, config);

  //barchart
  var barChartData = {
    labels: [
      "MinRangeAtSleep",
      "MaxRangeAtSleep",
      "MinRangeAtWake",
      "MaxRangeAtWake",
      "MaxRangeAt24h",
      "MaxRangeAt24h"
    ],
    datasets: [
      {
        backgroundColor: [
          chartColors.darkgrey,
          chartColors.darkgrey,
          chartColors.blue,
          chartColors.blue,
          chartColors.red,
          chartColors.red
        ],
        borderColor: "black",
        borderWidth: 1,

        data: MaxMinRange
      }
    ]
  };

  var chartOptions = {
    layout: {
      padding: {
        left: 20,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    plugins: {
      labels: {
        render: "value",
        precision: 0,
        fontSize: 12,
        fontStyle: "normal"
      }
    },
    responsive: true,

    legend: {
      display: false
    },
    scales: {
      xAxes: [{ barPercentage: 0.6 }],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 500
          }
        }
      ]
    }
  };

  var bar = document.getElementById("sleepwake").getContext("2d");
  myBar = new Chart(bar, {
    type: "bar",
    data: barChartData,
    options: chartOptions
  });

  //piechart
  var pie = document.getElementById("percentage");
  var myChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: ["L2Hypo", "L1Hypo", "Normal", "L2Hyper", "L1Hyper"],
      datasets: [
        {
          data: PercentageOfGlucose,
          backgroundColor: [
            chartColors.blue,
            chartColors.yellow,
            chartColors.lightgrey,
            chartColors.darkgrey,
            chartColors.red
          ],
          borderColor: "black",
          borderWidth: 1
        }
      ]
    },
    options: {
      layout: {
        padding: {
          left: 20,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      legend: {
        display: true,
        position: "right",
        align: "center"
      },
      responsive: true,
      plugins: {
        labels: {
          render: "percentage",
          precision: 0,
          fontSize: 15,
          fontStyle: "normal",
          position: "outside"
        }
      }
    }
  });
}
