/******
//By Marwa Syed
//This script reads a file into json format for readability and easy processing. 
//This is parsed to gather working timings of the employees.
//These are then calculated to return the employees monthly salary. The output is shown on the table.
*/

var fileInput;

window.onload = function() { 
    fileInput = document.getElementById("csv");
    fileInput.addEventListener('change', readFile); 
}

//Reads file, fetches data and converts to JSON  
function readFile() { 
    var reader = new FileReader();
    reader.onload = function() {
        PopulateTable(CSV2JSON(reader.result));
    };
    // starts reading the file. When it is done, calls the onload event defined above.
    reader.readAsBinaryString(fileInput.files[0]);
}

//Function calculates the data gathered from the csv fie
function PopulateTable(jsonString) {
    var table = document.getElementById("table-wages");
    var personDict = NumberOfUniqueNames(jsonString);
    var normalHourlyRate = 3.75;
    var eveningHourlyRate = normalHourlyRate + 1.15;
    var overtimeHourlyRate1 = ((0.25 * normalHourlyRate) + normalHourlyRate);
    var overtimeHourlyRate2 = ((0.5 * normalHourlyRate) + normalHourlyRate);
    var overtimeHourlyRate3 = normalHourlyRate * 2;

    for (var key in personDict) {
        if (key != "undefined") {
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(-1);
            var cell2 = row.insertCell(-1);
            var cell3 = row.insertCell(-1);

            cell1.innerHTML = personDict[key]; // Shows peron name on table 
            cell2.innerHTML = key; // Shows person ID on table 


            //The calculation for the normal pay, evening compensation and overtime pay
            var hoursworked = end - start;
            var salary = 0;
            var sizeOfJson = Object.keys(jsonString).length;
            for (var i = 0; i < sizeOfJson; i++) {
                if (jsonString[i]["Person Name"] == personDict[key]) {
                    var start = TimeToDecimal(jsonString[i]["Start"]); //start time to decimal format 
                    var end = TimeToDecimal(jsonString[i]["End"]); //End time to decimal format

                    // for overtime  
                    if (hoursworked > 8 && hoursworked > 11) {

                        salary = salary + overtimeHourlyRate1
                    } //overtime pay for 2 hours over the regular 8 hours 
                    else if (hoursworked > 10 && hoursworked < 13) {

                        salary = salary + overtimeHourlyRate2
                    } //overtime pay for the 2 hours after the initial extra 2 hours 
                    else if (hoursworked >= 13) {

                        salary = salary + overtimeHourlyRate3
                    } //overtime pay for more than 5 hours 


                    var normalHours = 18 - start; //Normal hours are from 6am to 18pm
                    var eveningHours = end - 18; //evening compensation is from 18pm to 6am

                    if (normalHours < 0) { 
                        normalHours = 0
                    }

                    if (end <= 6) { 
                        end = end + 24 // So that no negative value appears
                    } 
                    if (eveningHours < 0) { 
                        eveningHours = 0 
                    } 
                    salary = salary + (normalHours * normalHourlyRate) + (eveningHours * eveningHourlyRate); // total evening compensation and normal pay 
                }
            }
			// Shows salary on table 
            cell3.innerHTML = "$" + salary.toFixed(2); 
        }
    }
}


//Function: Parses time from HH:MM to decimal format
function TimeToDecimal(t) {
    var arr = t.split(':');
    return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
}

//Function: Parses Person Name and ID
function NumberOfUniqueNames(jsonString) {

    var lookup = {};
    var items = jsonString;
    var result = {};

    for (var item, i = 0; item = items[i++];) {
        var name = item["Person Name"];

        if (!(name in lookup)) {
            lookup[name] = 1;
            result[item["Person ID"]] = item["Person Name"];
        }
    }
    return result;

}

//Function: Converts data from array to json format
function CSV2JSON(csv) {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }
    return objArray;
}