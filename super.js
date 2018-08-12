const mysql = require('mysql');
const inquire = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gl0rf1&d3l',
    database: 'jdr_bamazon'
});

let depts = [];

connection.connect();

//boots up the main menu.
function main(){
    inquire.prompt([
        {
            name: 'process',
            message: 'Welcome, Supervisor. Select a process.',
            type: 'list',
            choices: ['Show Profit Tables', 'View Department Sales']
        }
    ]).then(function(mainInq){
        switch (mainInq.process){
            case 'Show Profit Tables':
                showTables();
                break;
            case 'View Department Sales':
                salesByDept();
                break;
        }
    });
}

profitCalc();
main();

//So this wound up being more convoluted than I anticipated. Getting the depts array to be callable within the scope of an inquirer call was impossible to do with a neat, modular style so now it's all jumbled togeter. I'm running a selector on our products table, asking the supervisor what department they would like to see, then showing them product sales for every product in that department. 
function salesByDept(){

    //Creating our department list.
    connection.query('SELECT * FROM `products`', function(err, res){
        if (err) throw err;
        for (let i = 0; i < res.length; i++){
            if (!depts.includes(res[i].department_name)){
                depts.push(res[i].department_name);
            }
        }
        inquire.prompt([
            {
                name: 'deptChoice',
                message: 'Which Department would you like to view?',
                type: 'list',
                choices: depts
            }
        ]).then(function(res){
            let deptChoice = res.deptChoice;
            //querying products where the department name is equivalent to the super's choice.
            connection.query('SELECT `item_id`, `product_name`, `product_sales` FROM `products` WHERE `department_name` = "' + res.deptChoice + '"', function(err, res){
                if (err) throw err;
                console.log(res);
                let total = 0;
                //locally setting a total sales variable by iterating through the resultant array.
                for (let k = 0; k < res.length; k++){
                    total += res[k].product_sales;
                }
                //now, res.deptChoice has inexplicably left it's scope. 

                connection.query('UPDATE `departments` SET `sales` = ' + total + ' WHERE `department_name` = "' + deptChoice + '"', function(err){
                    if (err) throw err;
                    connection.end();
                });
            });
        });
    });   
}

 
function profitCalc(){
    connection.query('SELECT * FROM `departments`', function(err, res){
        if (err) throw err;
        for (let n = 0; n < res.length; n++){
            let profit = (res[n].overhead - res[n].sales).toFixed(2);
            connection.query('UPDATE `departments` SET `profit` = ' + profit + ' WHERE `department_name` = "' + res[n].department_name + '"');
        }
    });
}

function showTables(){
    connection.query('SELECT * FROM `departments`', function(err, res){
        if (err) throw err;
        let totalOverhead = 0;
        let totalSales = 0;
        let netProfit = 0;
        for (let o = 0; o < res.length; o++){
            totalOverhead += res[o].overhead;
            totalSales += res[o].sales;
            netProfit += res[o].profit;
        }
        console.log(res);
        console.log('--------------------------------------');
        console.log('TOTAL OVERHEAD:', totalOverhead.toFixed(2));
        console.log('TOTAL SALES:', totalSales.toFixed(2));
        console.log('NET PROFITS:', netProfit.toFixed(2));
        connection.end();
    });
}
