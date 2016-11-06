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
    var name = "";
    var email = "";
    var age = 0;
    var comment = "";


    // Capture Button Click
    $("#addUser").on("click", function () {

        // YOUR TASK!!!
        // Code in the logic for storing and retrieving the most recent user.
        // Dont forget to provide initial data to your Firebase database.
        name = $('#nameinput').val().trim();
        email = $('#emailinput').val().trim();
        age = $('#ageinput').val().trim();
        comment = $('#commentinput').val().trim();


        // Code for the push
        dataRef.ref().push({
            name: name,
            email: email,
            age: age,
            comment: comment,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
        // Don't refresh the page!
        return false;
    });

    //Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    dataRef.ref().on("child_added", function (childSnapshot) {
        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().email);
        console.log(childSnapshot.val().age);
        console.log(childSnapshot.val().comment);
        console.log(childSnapshot.val().dateAdded);

        // full list of items to the well

        var html = "<div class='well'>";
        html += "<span class='name'>Name: " + childSnapshot.val().name + "</span> ";
        html += "<span class='email'>Email: " + childSnapshot.val().email + "</span> ";
        html += "<span class='age'>Age: " + childSnapshot.val().age + "</span> ";
        html += "<span class='comment'>Comment: " + childSnapshot.val().comment + "</span>";
        html += "</div>";

        $('#full-member-list').append(html);


// Handle the errors
    }, function (errorObject) {
        //console.log("Errors handled: " + errorObject.code)
    });

    dataRef.ref().orderByChild("dateAdded").limitToLast(1)
            .on("child_added", function (snapshot) {
        // Change the HTML to reflect
        $("#namedisplay").html(snapshot.val().name);
        $("#emaildisplay").html(snapshot.val().email);
        $("#agedisplay").html(snapshot.val().age);
        $("#commentdisplay").html(snapshot.val().comment);
    });

