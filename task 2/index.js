const mysql = require("mysql");
const fs = require("fs");
const migrationPath = __dirname + '\\tmp\\';
var dbPath = __dirname + '\\database\\';
var json;
var migration = JSON.parse(fs.readFileSync("./tmp/migration.json", "utf8"));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root"
  });

fs.readdir("./database/", (error, files) => {
    if(error) console.log(error)
    else
    {
        files.forEach(file => {
        console.log(file);
        });
        dbPath += files[0];
        json = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        console.log(dbPath);
        
        connection.query("CREATE DATABASE IF NOT EXISTS DB",
        function(err, results) {
            if(err) {
                console.log(err);
            }
            else 
            {
                console.log("База данных создана");
            }
        });

        connection.changeUser({database : 'DB'});
        
        let i = 0;
        

        /* while(i < json.length)
        {
            console.log(i);
            CreateTable(json[i]);
            InsertTable(json[i]);
            i++;
        } */
        Compare()
        //CompareData(migration[0].data[0], json[0].data[0]);
        //console.log(findByID(5, migration[0])[0]);
        //InsertData(json[0].name, json[0].data[4]);
        
        connection.end();
    }
});



function UpdateMigration()
{
    let fp = migrationPath + "migration.json"; //file path
    let file = JSON.stringify(json);
    console.log(file);
    fs.writeFile(fp, file, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
}

function Compare()
{
    let i = 0;
    let i1 = 0;
    let j = 0;
    while(i < migration.length)
    {
        //if(findByID(5, migration[0])[0] == false)

        j = 0;
        while(j < json.length)
        {
            //console.log(migration[i].data, findByID(json[j].data[i1].id, json[j])[0]);
            if(json[j].name == migration[i].name)
            {
                //CompareData(migration[i], json[j]);
                i1 = 0;
                while(i1 < json[j].data.length)
                {
                    //console.log("return", findByID(json[j].data[i1].id, migration[i])[0]);
                    let found = findByID(json[j].data[i1].id, migration[i]);
                    if(found[0] == false)
                    {
                        console.log("Нет данных у id = ", json[j].data[i1].id, json[j].data[i1]);
                        InsertData(json[j].name, json[j].data[i1]);
                    }
                    else
                    {
                        CompareData(json[j].data[i1], migration[i].data[found[1]], json[j]);
                        //console.log("obj",Object.seal(json[j].data[i1]));
                    }
                    i1++;
                }
                
            }
            
            j++;
            
        }
        i++;
    }
    i = 0;
    while(i < json.length)
    {
        j = 0;
        while(j < migration.length)
        {
            if(json[i].name == migration[j].name)
            {
                i1 = 0;
                while(i1 < migration[j].data.length)
                {
                    let found = findByID(migration[j].data[i1].id, json[i]);
                    if(found[0] == false)
                    {
                        console.log("Данные были удалены под id = ", migration[j].data[i1].id, migration[j].data[i1]);
                        DeleteData(migration[j].data[i1].id, migration[j].name);
                    }
                    i1++;
                }
                
            }
            
            j++;
            
        }
        i++;
    }
    UpdateMigration();
}

function CompareData(data1, data2, mainData)
{
    var newID = false;
    var k1 = 0;
    for (key1 in data1) {
        console.log(typeof(key1), key1, data1[key1]);
        
            if (data1[key1] != data2[key1] && data1.id == data2.id) 
            {
                Update(data1.id, mainData.name, key1, data1[key1]);
            }
        
    }
    
    return true;
}

function findByID(id, jsonData)
{
    let i = 0;

    
    while (i < jsonData.data.length)
    {
        console.log(jsonData.data[i].id, id, jsonData.data[i]);
        if(jsonData.data[i].id == id)
            return [jsonData.data[i], i];
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
        HTMLGenerator(logJSON[0].mid[i], true);
        i++;
    }
    fp = JSONPath + "log.json"; //file path
    
    fs.writeFile(fp, JSON.stringify(logJSON), (err) => {
        if(err) throw err;
        console.log('Data in log file has been updated!');
    });

}

function Update(id, table, columnName, value)
{
    let sql
    if(typeof(value) == 'string')
    sql = "UPDATE " + table + " SET " + columnName + '=\'' + value + "' WHERE id=" + id + ";";
    else
    sql = "UPDATE " + table + " SET " + columnName + '=' + value + " WHERE id=" + id + ";";
    connection.query(sql, function(err, results) {
        if(err) console.log(err);
        else 
        {
            
            console.log("Данные в таблице были изменены");
        }
    });
    
}

function CreateTable(table)
{
    let j = 0;
    let link = false;
    let sql = `create table if not exists ` + table.name + `(id int, `
    while(j < table.fields.length)
    {
        if(table.fields[j].type == undefined)
        {
            sql += table.fields[j].name + ' int' + ', foreign key (' + table.fields[j].name + ') references '+ table.fields[j].link + '(id) on delete cascade';
            link = true;
        }
        else
        {
            link = false;
            sql += table.fields[j].name + ' ';
            if(table.fields[j].type == 'string')
                sql += 'char(255)';
            else if(table.fields[j].type == 'integer')
                sql += 'int';
            else if(table.fields[j].type == 'datetime')
                sql += 'datetime';
            else if(table.fields[j].type == 'bool')
                sql += 'bool';
        }
        if (j < table.fields.length - 1)
        sql += ', ';

        j++;
    }

    if(link)
    sql += ', primary key(id, player_id, game_id)';
    else
    sql += ', primary key(id)';
    sql += ');'
        
    connection.query(sql, function(err, results) {
        if(err) console.log(err);
        else 
        {
            UpdateMigration();
            console.log("Таблица создана");
        }
    });
    console.log(sql);
    
}

function InsertTable(table)
{
    var sql = 'INSERT INTO ' + table.name + ' VALUES ';
    let j = 0;
    while(j < table.data.length)
    {
        sql += '(';
        let data = table.data[j];
        var k = 0;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                if(typeof(data[key]) == 'string' && (key != 'id' ))
                {
                    data[key] = data[key].replace(/'/g, "''");
                    data[key] = data[key].replace(/"/g, '""');
                    data[key] = data[key].replace(/`/g, "``");
                    sql += '\'' + data[key] + '\'';
                    
                }
                else 
                    sql += data[key];
                k++;

                if (k < (table.fields.length + 1))
                    sql += ', ';
            } 
        } 
        sql += ')';

        j++;

        if(j < table.data.length)
            sql += ',';
    }
    
        
    connection.query(sql, function(err, results) {
        if(err) console.log(err);
        else 
        {
            UpdateMigration();
            console.log("Таблица была создана");
        }
    });
}

function InsertData(tableName, table)
{
    var sql = 'INSERT INTO ' + tableName + ' VALUES (';
    //let j = 0;

    //let data = table.data[j];
    var k = 0;
    for (key in table) {
        if (table.hasOwnProperty(key)) {
            if(typeof(table[key]) == 'string' && (key != 'id' ))
            {
                table[key] = table[key].replace(/'/g, "''");
                table[key] = table[key].replace(/"/g, '""');
                table[key] = table[key].replace(/`/g, "``");
                sql += '\'' + table[key] + '\'';
                
            }
            else 
                sql += table[key];
            k++;
            console.log('k = '+ k, Object.keys(table).length);
            if(k != Object.keys(table).length)
            sql += ',';
        } 
    } 
    sql += ');';
    
    console.log(sql);
        
    connection.query(sql, function(err, results) {
        if(err) console.log(err);
        else 
        {
            UpdateMigration();
            console.log("Данные были занесены в таблицу " + tableName);
        }
    });
}

function DeleteData(id, table)
{
    let sql = "DELETE FROM " + table + " WHERE id=" + id + ";";
    connection.query(sql, function(err, results) {
        if(err) console.log(err);
        else 
        {
            UpdateMigration();
            console.log("Данные в таблице были удалены");
        }
    });
    
}




