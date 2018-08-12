//MANAGER JS 
const mysql = require('mysql');
const inquire = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gl0rf1&d3l',
    database: 'jdr_bamazon'
});

function main(){
    inquire.prompt([
        {
            name: 'process',
            message: 'Choose a process.',
            type: 'list',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add New Product']
        }
    ]).then(function(initialize){
        switch(initialize.process){
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add New Product':
                newProduct();
        }
    });
}

function mainReplay(){
    inquire.prompt([
        {
            name: 'again',
            message: 'Continue in management mode?',
            type: 'confirm'
        }
    ]).then(function(mainReplayRes){
        if (mainReplayRes.again){
            main();
        }
        else{
            console.log('Adios.');
            connection.end();
        }
    })
}

//console.tables each product in inventory--readability is sort of bad either way you slice it for viewing every product--this tabling method is my preferred way to view the products in the absence of the beautified table outputted by the terminal.
function viewProducts(){
    connection.query('SELECT * FROM `products`', function(err, res){
        if (err) console.log(err);
        for (let z = 0; z < res.length; z++){
            console.table(res[z]);
        }
        mainReplay();
    });
}


//Much the same as above, only the select statement is refined and the tabling function feels less necessary here. Setting cutoff to 10 for low inventory since the vast majority of items in the db are seeded with quantities in the hundreds--only the antikythera device should display if this program is run from the seeds.sql table unedited.

//Also, lowInventory queues up the addInventory function.
function lowInventory(){
    connection.query('SELECT * FROM `products` WHERE `stock_quantity` < 10', function(err, inventoryRes){
        if (err) console.log(err);
        console.log(inventoryRes);
        addInventory();
    });
}

//A little more complicated. This function asks that the manager specifify an item id to update (they could technically choose any id in the market from this function, but they would have to memorize it since at this functions call only the low inventory data will be visible to them), and the quantity they wish to add. The database is then updated appropriately.

function addInventory(){
    inquire.prompt([
        {
            name: 'reup',
            type: 'confirm',
            message: 'would you like to replenish the inventory?'
        }
    ]).then(function(inquiry){
        if (inquiry.reup){
            inquire.prompt([
                {
                    message: 'Enter the item ID you would like to replenish.',
                    name: 'itemIdChoice',
                    type: 'input'
                },
                {
                    message: 'How many would you like to add?',
                    name: 'quantity',
                    type: 'input'
                }
            ]).then(function(res){
                connection.query('UPDATE `products` SET `stock_quantity` = (' + parseInt(res.quantity) + ' + `stock_quantity`) WHERE `item_id` = ' + res.itemIdChoice, function(err){
                    if (err) throw err;
                    console.log('The inventory has been updated.');
                    mainReplay();
                });
            });
        } else {
            main();
        }
    });
}


//newProduct function allows the manager to bolster the store's inventory with new items. This adds a row to the database products table replete with all the vital product information.
function newProduct(){
    inquire.prompt([
        {
            name: 'productName',
            message: 'Enter the product\'s name.',
            type: 'input'
        },
        {
            name: 'productQuantity',
            message: 'Enter the quantity you wish to sell.',
            type: 'input'
        },
        {
            name: 'productPrice',
            message: 'Enter the price of the product.',
            type: 'input'
        },
        {
            name: 'productDept',
            message: 'Select, broadly, the department which will sell this item.',
            type: 'list',
            choices: ['War Goods', 'Household Goods', 'Food and Beverage', 'Books', 'Office Supplies']
        }
    ]).then(function(queryRes){
        let newProductName = queryRes.productName;
        let newProductQ = parseInt(queryRes.productQuantity);
        let newProductP = parseFloat(queryRes.productPrice);
        let newProductDept = queryRes.productDept;

        connection.query('INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`) VALUES ("' + newProductName + '", "' + newProductDept + '", ' + newProductP + ', ' + newProductQ + ')', function(err){
            if (err) throw err;
            console.log('You have added', newProductName, 'to the Agora.');
            mainReplay();
        });
    });
}

main();