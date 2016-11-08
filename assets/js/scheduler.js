"use strict";

      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyBuKCWponF0dCeDh2w3al3BTtTdvYpSjj0",
        authDomain: "train-scheduler-c1f14.firebaseapp.com",
        databaseURL: "https://train-scheduler-c1f14.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "960995332424"
    };
    firebase.initializeApp(config);

    var dataRef = firebase.database();


    // Initial Values
    var trainName = "";
    var destination = "";
    var firstTime = 0;
    var frequency = 0;


    // Capture Button Click
    $("#submitBtn").on("click", function (e) {
        e.preventDefault();

        // YOUR TASK!!!
        // Code in the logic for storing and retrieving the most recent train info.
        var trainName = $('#trainName').val().trim();
        var destination = $('#destination').val().trim();
        var firstTime = $('#firstTime').val().trim();
        
        // if(moment(firstTime, "HH:mm").isAfter(moment()))
        // {
        //     $("#timeModal").modal();
        //     return;
        // }
        var frequency = parseInt($('#frequency').val().trim());


        // Code for the push
        dataRef.ref().push({
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // Don't refresh the page!
        return false;
    });

    //Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    dataRef.ref().on("child_added", function (childSnapshot) {

        if(childSnapshot == null) return;

        console.log(childSnapshot);
        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().trainName);
        console.log(childSnapshot.val().destination);
        console.log(moment(childSnapshot.val().firstTime, "HH:mm").minutes());
        console.log(childSnapshot.val().frequency);
        console.log(childSnapshot.val().dateAdded);

        //calculate next arrival time and minutes away
        // First Time (pushed back 1 year to make sure it comes before current time)
        //Don't need this because I checked to make sure start time of day is less than or equal to current time
        var firstTimeConverted = moment(childSnapshot.val().firstTime,"HH:mm");//.subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + currentTime.format("HH:mm"));

        // Difference between the times
        var diffTime = currentTime.diff(firstTimeConverted, "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var tMinutesTillTrain;
        if(diffTime > 0)
        {
            // Time apart (remainder)
            var tRemainder = diffTime % childSnapshot.val().frequency;
            console.log(tRemainder);

            // Minute Until Train
            tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;
        }
        else
        {
            tMinutesTillTrain = diffTime * -1;
        }

        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

        // make row
        var row = "<tr>";
        row += "<td><button class = 'btn btn-danger' id = '" + childSnapshot.key + "'>X</button></td>";
        row += "<td>" + childSnapshot.val().trainName + "</td> ";
        row += "<td>" + childSnapshot.val().destination + "</td> ";
        row += "<td>" + childSnapshot.val().frequency + "</td> ";
        row += "<td>" + moment(nextTrain).format("hh:mm A") + "</td>";
        row += "<td>" + tMinutesTillTrain + "</td>";
        row += "</tr>";

        $('#rowSpace').append(row);
        $("#rowSpace button").on("click", function(){
            var id = $(this).attr("id");
            dataRef.ref(id).set(null);
        });
// Handle the errors
}, function (errorObject) {
        //console.log("Errors handled: " + errorObject.code)
    });


    // dataRef.ref().orderByChild("dateAdded").limitToLast(1)
    //         .on("child_added", function (snapshot) {
    //     // Change the HTML to reflect
    //     $("#namedisplay").html(snapshot.val().name);
    //     $("#emaildisplay").html(snapshot.val().email);
    //     $("#agedisplay").html(snapshot.val().age);
    //     $("#commentdisplay").html(snapshot.val().comment);
    // });

    dataRef.ref().on("child_removed", function(childSnapshot){
        dataRef.ref().update();
    });