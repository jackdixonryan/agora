# Welcome to the Agora

## About Agora

Agora is an online marketplace emulator designed to run on the node JS command line. It communicates with several SQL tables to create a dynamic user/manager experience. 

View a demo [here](https://youtu.be/Nei7iVYjaO0).

## Specs 

Agora runs on the node command line and is dependent on both the mySQL and Inquirer NPM packages. 

Additionally, to run Agora locally on your machine, you will have to run the seed.sql file in your local mySQL interface. 
* Run seed.sql through the creation of the `myCart` table for customer.js and manager.js functionality.
* Run the entire seed.sql file to gain access to super.js functions.

Run node on any of the following files; the interface is easily-followed from that point on.

### `node customer.js`

customer.js will lead a user through selecting items from the inventory and building a cart. At the conclusion of the program, they will receive a message telling them their total. 

### `node manager.js`

manager.js allows the manager to view the current inventory, bolster the inventory of items that are about to run out, and add new items to the inventory. 

### `node super.js`

Super.js calls on different SQL tables to view the profitability of each department separately, and to view the net profits of the entire web store. 
