# Webstore

This is my final assignment for the Web Development class

By Adam Ebied, Matriculation Number 577868

## Installation

[node.js](https://nodejs.org/en/) is required to run this project.

Install the necessary modules with: 
```
npm install express nedb nodemon express-session body-parser bcrypt
```

## Usage

To launch the project, use `npm start` or `npm run devstart`

The site will be available on `http://localhost:3000` by default

On the landing page you'll see the login window, below the login button you can click on "Create new account" to register. Every field will validate once it has at least one character typed. 

The login and register forms also check for a valid e-mail format (including special chars).

Once registered, the user will be stored in a server-side database, the password is also encrypted using the bcrypt library. The registered users are persistent and will remain after the server shuts down.

After logging in, the user can either log out or browse the available products. Products that are discounted will signal it with a text and the percentage of the discount.

After clicking on a product, it will show the description of the product and you can also apply a coupon code. Only one coupon code can be active at a time. For now I have added two coupons to every product: `TEST1` and `TEST2`

The user can then check if they already purchased the product by clicking on "Check purchase" or they can return back to the products screen. For the sake of simplicity, I didn't implement an actual payment method, but it could be done with either the Stripe API or PayPal API, and then validate if the purchase has been made or not.

After checking the purchase, the user can download the product, the price preview will also change to "Purchased" to indicate that the file has been purchased. Before you can download the file, the server first verifies if the purchase actually took place or not.

New products can be added by modifying the `/json/products.json` file.
The file stores the currency used, and also each individual product in an array.

Products have:
- an ID `productId`
- a name `productName`
- a description `productDescription`
- an image `productImage` as a preview image
- a product location `productLocation` which is the path to the file on the server that can be downloaded
- a price `productPrice`
- a discount `productDiscount` that ranges from 0 to 1, e.g. 0.2 is a 20% discount that is always active
- an array of coupons `coupons`, where each coupon has a code `code` and a discount value `discount`, with the same logic as the `productDiscount`

A product can be added by just adding it to the .json file.


## Stack
I decided to use node.js because it is easy to set everything up with it

I also went with HTML5 + Express to implement the whole website, and [NeDB](https://github.com/louischatriot/nedb) for data storage

## Additional Note
Tempering with the DB while the site is running can lead to it not working anymore, so I recommend not doing it!

The presentation to the website idea can be found [here](https://docs.google.com/presentation/d/1sRhLBZJ7PW9dC92h-BVK5sXEsUPuklnIzshECNmCeG0/edit#slide=id.g13779ad4e94_0_75) 

Or copy and paste the link: https://docs.google.com/presentation/d/1sRhLBZJ7PW9dC92h-BVK5sXEsUPuklnIzshECNmCeG0/edit#slide=id.g13779ad4e94_0_75

Thank you a lot for the semester :)

Modules used:

```
webstore@1.0.0 F:\Web Projects\Webstore
├── bcrypt@5.0.1
├── body-parser@1.20.0
├── express-session@1.17.3
├── express@4.18.1
├── nedb@1.8.0
└── nodemon@2.0.20
```
