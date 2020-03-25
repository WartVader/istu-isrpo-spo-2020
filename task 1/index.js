const paramJSON = process.argv[2];
const paramPath = process.argv[3];
const paramServe = process.argv[4];


const fs = require("fs");
const _dirname = "C:\\Users\\WartVader\\Desktop\\Tasks 2020\\1\\quest\\";
const JSONPath = "C:\\Users\\WartVader\\Desktop\\Tasks 2020\\1\\tmp\\";
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

function DataGenerator(id)
{
    let i = 0;
    let data = '';
    while(i < json[id].answers.length)
    {
        if(i == 0)
        data += '<div><a href=".\\quest\\quest' + (json[id].id + 1) + '.html' + '">' + json[id].answers[i].text + '</a></div>' + '\n';
        else
        data += '<div><a href=".\\quest\\the-end' + json[id].id + '.html">' + json[id].answers[i].text + '</a></div>' + '\n';

        i++;
    }
    
    return data;
}

function HTMLGenerator(id, jsonData)
{
    let title = "<div>" + json[id].question + "</div>";
    let data;
    if(id != json.length - 1)
        data = DataGenerator(id);
    let fp = _dirname + "quest" + json[id].id + ".html"; //file path
    let file = htmlwb4_start + title + data + htmlwb4_end;
    fs.writeFile(fp, file, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
    if(id != json.length - 1)
    {
        fp = _dirname + "the-end" + json[id].id + ".html"; //file path
        title = "<div>" + json[id].end + "</div>";
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
        HTMLGenerator(logJSON[0].mid[i]);
        i++;
    }
    fp = JSONPath + "log.json"; //file path
    fs.writeFile(fp, JSON.stringify(logJSON), (err) => {
        if(err) throw err;
        console.log('Data has been updated!');
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
    if(mtime != logJSON[0].mtime)
    {
        logJSON[0].mtime = mtime;
        logJSON[0].mid = [];
        Modificate();
    }
    else 
    {
        let i = 0;
        while(i < json.length)
        {
            HTMLGenerator(i);
            i++;
        }
    }
});
//"C:\\Users\\WartVader\\Desktop\\Tasks 2020\\1\\index.js"