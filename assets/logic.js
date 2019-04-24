
// Steps to complete:
/*
1. Create Firebase link
2. Create initial train data in database
3. Create button for adding new trains - then update the html + update the database
4. Create a way to retrieve trains from the trainlist.
5. Create a way to calculate the time way. Using difference between start and current time.Then take the difference and modulus by frequency.
*/
 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDOK2O_GgSYJah_vuQW3UT1l1p-b-BjoJA",
    authDomain: "spicymango-8d8f7.firebaseapp.com",
    databaseURL: "https://spicymango-8d8f7.firebaseio.com",
    projectId: "spicymango-8d8f7",
    storageBucket: "spicymango-8d8f7.appspot.com",
    messagingSenderId: "606501343593"
  };
  firebase.initializeApp(config);

var database = firebase.database();
console.log(database);
var TrainSchedule = database.ref("/TrainSchedule");
console.log("TrainSchedule"  , TrainSchedule );


var newTrain = {};;


// Capture Button Click
$("#button").on("click", function() {
  event.preventDefault();

// Grabs user input
   newTrain.name = $("#trainName").val().trim();
   newTrain.destination = $("#destination").val().trim();
   newTrain.frequency = $("#frequency").val().trim();
   newTrain.firstTrainTime = $("#firstTrain").val().trim();
   

// Logs everything to console
console.log(newTrain.name);
console.log(newTrain.destination); 
console.log(newTrain.firstTrainTime);
console.log(newTrain.frequency)

TrainSchedule.push(newTrain);


 

  // Clears all of the text-boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");
  
  // Don't refresh the page!
  return false; 
});


// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
TrainSchedule.on("child_added", function(childSnapshot,  prevChildKey) {
    var tFrequency = childSnapshot.val().frequency;
    // Time is 3:30 AM
    var firstTime = childSnapshot.val().firstTrainTime;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + nextTrain);
    
 var newRow = $('<tr><td>'+childSnapshot.val().name+'</td><td>'+childSnapshot.val().destination+'</td><td>'+childSnapshot.val().frequency+'</td><td>'+ nextTrain +'</td><td>'+ tMinutesTillTrain +'</td></tr>');
            $(".set").append(newRow);
        
     });