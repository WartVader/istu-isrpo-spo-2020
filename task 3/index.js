const fs = require("fs");
var documentPath = __dirname + "\\index.html";
var document = fs.readFileSync(documentPath, "utf8");
var s_document = document.split(/ +/);
var result = "";

console.log(s_document);


var f = 0;
var i = 0;
let j = 0;
var firstSpace = false;
var notSpace = false;
var countSpace = 0;
var start_pre = false;
var start_code = false;
var start_area = false;
while(i < s_document.length)
{
    if(s_document[i] == '<link' && s_document[i + 1] == 'rel="stylesheet"')
    {
        console.log(123);
        let index1 = s_document[i + 2].indexOf('"');
        let index2 = s_document[i + 2].lastIndexOf('"');
        let href = s_document[i + 2].slice(index1 + 1, index2);
        if(href[0] == '/')
        href = '.' + href;
        console.log(href);
        LinkDescriptor(href);
        i += 2;
        console.log(123);
    }
    else if(s_document[i] == '<pre>\r\n')
    {
        start_pre = true;
        f = 123;
        console.log(123);
        let slices = SearchForNonEditablePlaces();
        result += document.slice(slices[j], slices[j+1]);
        j += 2;
        
        //console.log("char = ", document.slice(slices[0], slices[1]));
    }
    else if(s_document[i] == '</pre>\r\n')
    {
        start_pre = false;
        result += s_document[i];
    }
    else if(!start_pre && s_document[i] != '\r\n')
    {
        if(!s_document[i].endsWith('\n'))
            result += s_document[i] + ' ';
        else
        result += s_document[i];
        console.log(s_document[i] + ' ' + s_document[i].length + ' ' + s_document[i].charCodeAt(s_document[i].length - 2) + ' ' + s_document[i].charCodeAt(s_document[i].length - 1));
    }
    i++;
    /* if(document[i] == ' ' && notSpace == true)
    {
        result += document[i];
        notSpace = false;
    }
    else
    {
        notSpace = true;
        result += document[i];
    }
    i++; */
}
console.log(SearchForNonEditablePlaces());
function SearchForNonEditablePlaces()
{
    let i = 0;
    let indexes = [];
    let found1, found2;
    found1 = document.indexOf("<pre>");
    if(found1 != -1)
    {
        found2 = document.indexOf("</pre>");
        indexes.push(found1);
        indexes.push(found2);
        i += 1;
        while(document.indexOf("<pre>", indexes[i] + 1) != -1)
        {
            console.log(document.indexOf("<pre>", indexes[i]+ 1), indexes[i]);
            found1 = document.indexOf("<pre>", indexes[i]+ 1);
            found2 = document.indexOf("</pre>", indexes[i]+ 1);
            indexes.push(found1);
            indexes.push(found2);
            i += 2;
        }
    }
    

    found1 = document.indexOf("<code>");
    if(found1 != -1)
    {
        found2 = document.indexOf("</code>");
        indexes.push(found1);
        indexes.push(found2);
        i += 1;
        while(document.indexOf("<code>", indexes[i]) != -1)
        {
            found1 = document.indexOf("<code>", indexes[i]);
            found2 = document.indexOf("</code>", indexes[i]);
            indexes.push(found1);
            indexes.push(found2);
            i += 2;
        }

    }
    
    found1 = document.indexOf("<textarea>");
    if(found1 != -1)
    {
        found2 = document.indexOf("</textarea>");
        indexes.push(found1);
        indexes.push(found2);
        i += 1;
        while(document.indexOf("<textarea>", indexes[i]) != -1)
        {
            found1 = document.indexOf("<textarea>", indexes[i]);
            found2 = document.indexOf("</textarea>", indexes[i]);
            indexes.push(found1);
            indexes.push(found2);
            i += 2;
        }
    }

    return indexes;

}

function LinkDescriptor (href)
{
    console.log(href);
    var text = "<style>\r\n";
    text += fs.readFileSync(href, "utf8") + '\r\n</style>\r\n';
    result += text;
}

console.log('\n', f);
console.log('\n' + result, s_document.length);
fs.writeFile(__dirname + "\\changed.html", result, (err) => {
    if(err) throw err;
    console.log('Data has been added!');
});