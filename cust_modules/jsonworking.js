var Argument ='' ;
var headersclolumn = '';
var firstname = [];
var lastname = [];
var sample = {};
var myArray = [];
var txt1 = '';
var txtb = '';
var txta = '';

String.prototype.rtrim = function() {
    var trimmed = this.replace(/\s+$/g, '');
    return trimmed;
};
function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }

    return result;
}
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
function setargument(value) {
    Argument = value;
}

function assignText(s) {
    txt1 = s;
}

function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups)
        .map(function (group) {
            return groups[group];
        });
}

function call(param) {
     var itemsarray = [];
     var itemsobject = {};
    var list = JSON.parse(txtb);
    var result = groupBy(list,
        function (item) {
            if (param.length == 1) {
                return [item[param[0]]];
            } else {
                return [item[param[0]], item[param[1]]];
            }
        });
    for (var i = 0, len = result.length; i < len; i++) {

        var myarray2 = [];

        // inner loop applies to sub-arrays
        for (var j = 0, len2 = result[i].length; j < len2; j++) {
            // accesses each element of each sub-array in turn
            if (param.length == 1) {
                firstname.push(result[i][j][param[0]]);
                delete result[i][j][param[0]];
            } else {
                firstname.push(result[i][j][param[0]]);
                delete result[i][j][param[0]];
                lastname.push(result[i][j][param[1]]);
                delete result[i][j][param[1]];
            }
            myarray2.push(result[i][j]);
        }
        if (param.length == 1) {
            firstname = firstname.filter(function (item, index, inputArray) {
                return inputArray.indexOf(item) == index;
            });
            myArray.push({ CIK: firstname[0], Fillings: myarray2 });
        } else {
            firstname = firstname.filter(function (item, index, inputArray) {
                return inputArray.indexOf(item) == index;
            });
            lastname = lastname.filter(function (item, index, inputArray) {
                return inputArray.indexOf(item) == index;
            });
            myArray.push({ CIK: firstname[0], "Company Name": lastname[0], Fillings: myarray2 });
        }


        firstname = [];
        lastname = [];
        sample = [];
    }
    
    itemsobject["items"]=myArray;
    itemsarray.push(itemsobject);
    txta = JSON.stringify(itemsarray);
    myArray = [];
}

function setheadercolumn(value) {
    headersclolumn = value;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function csvpipeJSON(csv,startline,Cikreq) {


    // break the textblock into an array of lines
    var lines = csv.split('\n');
    lines=filter_array(lines);
    // remove one line, starting at the first position
    lines.splice(0, startline);

    var result = [];

    var headers = headersclolumn.split("|");

    for (var i = 0; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split("|");

        for (var j = 0; j < headers.length; j++) {
            if(Cikreq==1&&(!obj.hasOwnProperty('CIK')))
            {
              obj["CIK"] =('C'+Math.round(getRandomArbitrary(10,1000000)));
            }
            else
            {
            obj[headers[j]] = currentline[j];
            }
        }
        if(obj.hasOwnProperty('CIK'))
             {
                if(obj["CIK"].trim().length==0)
                {
                    obj["CIK"]=('C'+Math.round(getRandomArbitrary(10,1000000)));
                }
             }
        result.push(obj);

    }

    //return result; //JavaScript object
    txtb = JSON.stringify(result); //JSON
}

function chkcsv() {
    // break the textblock into an array of lines
    var lines = txt1.split('\n');
    // remove one line, starting at the first position
    lines.splice(0, 12);
    // join the array back into a single string
    var newtext = lines.join('\n');

    if (newtext.split("|").length > 1)
        return true;
}

function csvspaceJSON(csv,startline,Cikreq) {


    // break the textblock into an array of lines
    var lines = csv.split('\n');
     lines=filter_array(lines);
    var splittedargument = Argument.split('|')
    // remove one line, starting at the first position
    lines.splice(0, startline);

    var result = [];

    var headers = headersclolumn.split("|");
    var alllines = [];
    for (var i = 0; i < lines.length; i++) {



        var currentline = [];
        for (var j = 0; j < splittedargument.length; j++) {
            var start = (splittedargument[j].split(','))[0];
            var stop = (splittedargument[j].split(','))[1];
            var currentlineval = lines[i].substring(start, stop);
            currentline.push(currentlineval);
        }
        alllines.push(currentline);


    }
    for (var i = 0; i < alllines.length; i++) {

        var a = alllines[i];
        var obj = {};
        for (var j = 0; j < a.length; j++) {
        
           if(Cikreq==1&&(!obj.hasOwnProperty('CIK')))
            {
              obj["CIK"] =('C'+Math.round(getRandomArbitrary(10,1000000)));
            }
            else
            {            
            var b = a[j];
            obj[headers[j]] = b.rtrim();             
            }
           
        }
           if(obj.hasOwnProperty('CIK'))
             {
                if(obj["CIK"].trim().length==0)
                {
                    obj["CIK"]=('C'+Math.round(getRandomArbitrary(10,1000000)));
                }
             }
        result.push(obj);
    }


    //return result; //JavaScript object
    txtb = JSON.stringify(result); //JSON
   
 
}

function Dotext(ResponseData,Headers_PipeDelimtre_String,Keys_Names_String,Columns_StartValue_Length_String,startline,Cikreq) {
  
    assignText(ResponseData);
     setheadercolumn(Headers_PipeDelimtre_String)
    if (chkcsv()) {       
        csvpipeJSON(txt1,startline,Cikreq);}
    else {     
        setargument(Columns_StartValue_Length_String)  
        csvspaceJSON(txt1,startline,Cikreq);}
    call(Keys_Names_String);
    return txta;
}

exports.Dotext = Dotext;




