# anonacy Express REST API Repo

This backend is where we will handle authentication requests for auth3.


## Get Your Coffee & Let's Get Started

First and foremost, we must follow the [12 factor app commandments](https://12factor.net/port-binding). Study these factor's when building out the platform. If you're here in the early days, I'm sorry. If this has progressed exponentially well, which I know it will have, then welcome and I hope you're eyes feast on this magnificent codebase that we've worked so hard to make.


The express server contains the api for all anonacy apps. To run:

1) Clone the repo:

`$ git clone https://github.com/hewham/auth3-server.git`

2) Install dependencies:

`$ npm install`

3) Start the server:

`$ npm start`

***

Local instances will now be able to connect to the server at: 

`http://localhost:3000`

_Note:_ Make sure you have a local mySQL server running at localhost:3306 for the express server to connect to.


***

The server is setup using `dotenv`, which means test and live keys are stored in the `.env.prod` and `.env.dev` files. Default is dev. To connect to the production server use the `--prod` tag.

`$ npm start --prod`


*** 

HOW TO GET STARTED WITH DB

install mysql community server (in my case it was version 8.0.19)

set password as AaKaCa123

run the following two commands in mysql workbench (or your choice of tableplus or whatever)
`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`

`flush privileges`

then after that go into terminal in express directory and run

`npm run sql:create`

`npm run sql:migrate`

`npm run sql:seed`

now db database is set
