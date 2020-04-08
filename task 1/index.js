const fs = require("fs");
const JSONPath = __dirname + "\\tmp\\";
const questPath =  "\\quest\\";
console.log(__dirname);

const paramJSON = JSONPath + process.argv[2];
var paramPath = process.argv[3];
var fullParamPath = __dirname + "\\" + paramPath;
const paramServe = process.argv[4];

if (paramPath == undefined || paramPath == 'false')
{
    paramPath = questPath;
    fullParamPath = __dirname + "\\" + questPath;
}
else
{
    fs.mkdir(fullParamPath, function() {});
}
console.log(fullParamPath);


const htmlwb4_start = '<!doctype html>' + '\n' +
'<html lang="rus">' + '\n' +
  '<head>' + '\n' +
    '   <title>Квест</title>' + '\n' +
    '   <!-- Required meta tags -->' + '\n' +
    '   <meta charset="utf-8">' + '\n' +
    '   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">' + '\n' +
    '   <!-- Bootstrap CSS -->' + '\n' +
    '   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">' + '\n' +

    '   <script src="index.js"></script>' + '\n' +
  '</head>' + '\n' +
  '<body>' + '\n' +
    '   <div class="container">' + '\n'; 
const htmlwb4_end = '   </div>' + '\n' +
'   <!-- Optional JavaScript -->' + '\n' +
'   <!-- jQuery first, then Popper.js, then Bootstrap JS -->' + '\n' +
'   <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>' + '\n' +
'   <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>' + '\n' +
'   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>' + '\n' +
'</body>' + '\n' +
'</html>';



var json = JSON.parse(fs.readFileSync(JSONPath + "quest.json", "utf8"));
var logJSON = JSON.parse(fs.readFileSync(JSONPath + "log.json", "utf8"));
//console.log(json);

function DataGenerator(id, datajson)
{
    let i = 0;
    let data = '';
    console.log(datajson);
    console.log(datajson[0].id, json.length);
    if (datajson[0].id != json.length)
    {
        while(i < datajson[0].answers.length)
        {
            if(i == 0)
            data += '<div><a href=".\\quest' + (datajson[0].id + 1) + '.html' + '">' + datajson[0].answers[i].text + '</a></div>' + '\n';
            else
            data += '<div><a href=".\\the-end' + datajson[0].id + '.html">' + datajson[0].answers[i].text + '</a></div>' + '\n';
    
            i++;
        }
    
    }
    
    return data;
}

function HTMLGenerator(id, modificate)
{
    console.log("id =", id, json)
    let data1 = findByID(id, json);
    if (data1[0] == false)
    return false;
    let data = data1[0].question;
    let title = "<div>" + data1[0].question + "</div>";
    if(id != json.length)
        data = DataGenerator(id, data1);
    let fp = fullParamPath + "\\quest" + data1[0].id + ".html"; //file path
    let file = htmlwb4_start + title + data + htmlwb4_end;
    fs.writeFile(fp, file, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    if(id != json.length)
    {
        fp = fullParamPath + "\\the-end" + data1[0].id + ".html"; //file path
        title = "<div>" + data1[0].end + "</div>";
        file = htmlwb4_start + title + htmlwb4_end;
        fs.writeFile(fp, file, (err) => {
            if(err) throw err;
            console.log('Data has been added!');
        });
    }
}

function objEqual (obj1, obj2){
    return JSON.stringify(obj1)===JSON.stringify(obj2);
 }

function findByID(id, jsonData)
{
    let i = 0;
    if(jsonData[0].mtime != undefined)
    i = 1;
    
    while (i < jsonData.length)
    {
        console.log(jsonData[i].id, id);
        if(jsonData[i].id == id)
            return [jsonData[i], i];
        i++;
    }
    return [false];
}

function HTMLRender(location)
{
    document.location.href = "location";
}

function Modificate()
{
    let i = 0;
    let data;
    while(i < json.length)
    {
        data = findByID(json[i].id, logJSON);
        console.log(data[0], json[i]);
        console.log(data[0].question != json[i].question);
        if(objEqual(data[0], json[i]) == false)
        {
            if (data[0] == false)
                logJSON.push(json[i]);
            else
                logJSON[data[1]] = json[i];
            logJSON[0].mid.push(json[i].id);
        }
        i++;
    }
    i = 0;
    while(i < logJSON[0].mid.length)
    {
        HTMLGenerator(logJSON[0].mid[i], true);
        i++;
    }
    fp = JSONPath + "log.json"; //file path
    
    fs.writeFile(fp, JSON.stringify(logJSON), (err) => {
        if(err) throw err;
        console.log('Data in log file has been updated!');
    });

}





fs.stat(paramJSON, function(err, stats) {
    console.log(paramJSON);
    console.log();
    console.log(stats);
    console.log();
    
    console.log(typeof(logJSON));
    let mtime = stats.mtime.toISOString();
    console.log(mtime, logJSON[0].mtime);
    if(paramServe)
    {
        logJSON[0].mtime = mtime;
        logJSON[0].mid = [];
        console.log("modificate");
        Modificate();
    }
    else 
    {
        let i = 1;
        while(i <= json.length)
        {
            HTMLGenerator(i, false);
            i++;
        }
    }
    git();
});

function git()
{
    var comand = 'git commit -m "test"';


    var execProcess = require("./exec_process.js");
    execProcess.result("git add -A", function (err, response) {
        if (!err) {
            execProcess.result(comand, function (err, response) {
            if (!err) {
                console.log(response);
                execProcess.result("git push", function (err, response) {
                if (!err) {
                    console.log("Запушено");
                } else {
                    console.log(err);
                }
                });
            } 
            else {
                console.log(err);
            }
            });
        }
    });
    
}
//

//

//NOTE: По красоте надо добавить функционал, проверки существует ли log файл, и если же существует, то проверять пустой ли он или нет, если пустой, то заполнить "по формату" моего log.json



//"C:\\Users\\WartVader\\Desktop\\Tasks 2020\\1\\index.js"