const mysql = require('mysql');
const inquire = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gl0rf1&d3l',
    database: 'jdr_bamazon'
});

connection.connect();

function customer(){
    inquire.prompt([
        {
            name: 'department',
            message: 'What are you looking for today?',
            type: 'list', 
            choices: ['War Goods', 'Household Goods', 'Office Supplies', 'Books', 'Food and Beverage']    
        }
    ]).then(function(inquiry){
        let deptChoice;
        switch (inquiry.department) {
            case 'War Goods': 
                deptChoice = 'War Goods';
                break;
            case 'Household Goods':
                deptChoice = 'Household Goods';
                break; 
            case 'Office Supplies': 
                deptChoice = 'Office Supplies';
                break;
            case 'Books': 
                deptChoice = 'Books';
                break;
            case 'Food and Beverage': 
                deptChoice = 'Food and Beverage';
                break;
            default:
                break;
        }
        var qString = 'SELECT * FROM `products` WHERE `department_name` = "' + deptChoice + '"';

        connection.query(qString, function (error, results){
            if (error) throw error;
            console.log(results);
            inquire.prompt([
                {
                    name: 'selection',
                    message: 'Which Item would you like?',
                    type: 'input'
                },
                {
                    name: 'quantity',
                    message:'How many do you want?',
                    type: 'input'
                }
            ]).then(function(selInq){
                //Variable for user's selection.
                let selection = selInq.selection;
                let isFound = false;
                //Iterating through the objects in the store...
                for (let i = 0; i < results.length; i++){
                    //If the selected id, we match user's selection to an entry in the database.
                    if (results[i].item_id == selection){
                        isFound = true;
                        //Checking the item name and price against the user's selection.
                        console.log("You have selected", results[i].product_name);
                        console.log("This item costs", results[i].price, 'drachma.');

                        //Defining two variables to hold the current stock quantity and net sales as they exist for the item in the database.
                        let stock = results[i].stock_quantity;
                        let netSales = results[i].product_sales;

                        //If there's enough stock that the user can purchase the number of items they want...
                        if (stock >= selInq.quantity){
                            //The stock is locally depleted by the quantity ordered.
                            stock = stock - selInq.quantity;
                            //The net sales is locally incremented by the price of the item in question multiplied by the number the individual ordered.
                            netSales += (results[i].price * selInq.quantity);

                            //Running, probably inefficiently, a pair of update queries (have not managed to get them work simultaneously) to overwrite database figures for the stock and net sales of the item in question by pushing the locally stored changed variables to the database. 
                            connection.query('UPDATE `products` SET `stock_quantity` = ' + stock + ' WHERE `item_id` = ' + selection);
                            connection.query('UPDATE `products` SET `product_sales` = ' + netSales + ' WHERE `item_id` = ' + selection);

                            connection.query('INSERT INTO `myCart` (`product_name`, `price`, `quantity_bought`) VALUES ("' + results[i].product_name + '", ' + results[i].price + ', ' + selInq.quantity + ')');

                            console.log('You have purchased ' + selInq.quantity + ' ' + results[i].product_name + '(s) for ' + (results[i].price * selInq.quantity) + ' drachma.');
                        
                        } else {
                            //If there aren't enough items to complete the transaction, we exit the function.
                            console.log("Insufficient Stock.");
                        }
                        runAgain();
                    }
                    //So, essentially, if the user submits a dummy id instead of a proper id, they're taken back through to the main menu.
                } if (!isFound){
                    runAgain2();
                } 
            });
        });
    });
}

//function runAgain allows the user to make another transaction.
function runAgain(){
    inquire.prompt([
        {
            name: 'again',
            message: 'Would you like to make another purchase?',
            type: 'confirm'
        }
    ]).then(function(res){
        if (res.again){
            customer();
        } else {
            console.log('We hope to see you at the Agora again!');
            checkout();
        }
    })
}

//A basically identical function that also supplies error handling for bad item id entries. With this, error handling is running smoothly.
function runAgain2(){
    console.log('That item ID was not found in our records.');
    inquire.prompt([
        {
            name: 'again',
            message: 'Would you like to make another purchase?',
            type: 'confirm'
        }
    ]).then(function(res){
        if (res.again){
            customer();
        } else {
            console.log('We hope to see you at the Agora again!');
            checkout();
        }
    })
}

customer();

function checkout(){
    console.log('Here are the items in your cart: ');
    connection.query('SELECT * FROM `myCart`', function(err, res){
        if (err) throw err;
        console.log(res);
        inquire.prompt([
            {
                name: 'checkout',
                message: 'Are you ready to checkout?',
                type: 'confirm'
            }
        ]).then(function(CheckInq){
            if (CheckInq.checkout){
                let total = 0;
                for (let m = 0; m < res.length; m++){
                    total += (res[m].price * res[m].quantity_bought);
                }
                console.log('Your total is ' + (total.toFixed(2)));
                console.log('Thank you for shopping with Agora today.');
                connection.query('DELETE FROM `myCart`');
                connection.end();
            } else {
                runAgain();
            }
        });
    });
}

