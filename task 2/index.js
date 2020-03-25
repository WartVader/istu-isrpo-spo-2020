const mysql = require("mysql");
const fs = require("fs");
var json = JSON.parse(fs.readFileSync("database.json", "utf8"));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root"
});

connection.query("CREATE DATABASE IF NOT EXISTS DB",
  function(err, results) {
    if(err) console.log(err);
    else console.log("База данных создана");
});
 
connection.end();

connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "DB"
});

let i = 0;

while(i < json.length)
{
    
    /* connection.query("SELECT * FROM ", function(err, results) {
        if(err) console.log(err);
        else console.log(results);
    }); */
    let j = 0;
    let sql = `create table if not exists ` + json[i].name + `(id int primary key auto_increment, `
    while(j < json[i].fields.length)
    {
        if(json[i].fields[j].type == undefined)
            sql += json[i].fields[j].name + ' int' + ', foreign key (' + json[i].fields[j].name + ') references '+ json[i].fields[j].link + '(id) on delete cascade';
        else
        {
            sql += json[i].fields[j].name + ' ';
            if(json[i].fields[j].type == 'string')
                sql += 'char(255)';
            else if(json[i].fields[j].type == 'integer')
                sql += 'int';
            else if(json[i].fields[j].type == 'datetime')
                sql += 'datetime';
            else if(json[i].fields[j].type == 'bool')
                sql += 'bool';
        }
        if (j < json[i].fields.length - 1)
        sql += ', ';

        j++;
    }
    sql += ');'
        
    connection.query(sql, function(err, results) {
        if(err) console.log(err);
        else console.log("Таблица создана");
    });
    i++;
}
i = 0;
while(i < json.length)
{
//INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
//VALUES ('Cardinal', 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');

    var sql = 'INSERT INTO ' + json[i].name + ' VALUES '
    let j = 0;
    while(j < json[i].data.length)
    {
        sql += '(';
        let data = json[i].data[j];
        var k = 0;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                if(typeof(data[key]) == 'string')
                    sql += "\'" + data[key] + "\'";
                else 
                    sql += data[key];
                k++;

                if (k < (json[i].fields.length + 1))
                    sql += ', ';
            } 
        } 
        sql += ')';
        j++;

        if(j < json[i].data.length)
            sql += ',';
    }
    
        
    connection.query(sql, function(err, results) {
        if(err) console.log(err);
        else console.log("Данные записаны");
        //console.log(sql);
    });
    console.log(sql);

    i++;
}


connection.end();