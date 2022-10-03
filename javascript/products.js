/*
var productName = products[i].productName;
var productDescription = products[i].productDescription;
var productImage = products[i].productImage;
var productPrice = products[i].productPrice + " " + jsondata.currency;
var productDiscount = products[i].productDiscount;
var displayDiscount = (productDiscount * 100) + " % Discounted";
var coupons = products[i].coupons;
*/

function readProductsFromJSON() {
    fetch("/json/products.json")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            var parentDiv = document.getElementById("container");

            var currency = jsondata.currency;
            var products = jsondata.products;

            for (var i = 0; i < products.length; i++) {
                var currentDiv = document.createElement("div");
                currentDiv.setAttribute('class', 'product');

                var productId = products[i].productId;
                var productName = products[i].productName;
                var productImage = products[i].productImage;
                var productPriceOriginal = products[i].productPrice;
                var productPrice = Math.round((products[i].productPrice + Number.EPSILON) * 100) / 100;
                var productDiscount = 1 - products[i].productDiscount;
                var displayDiscount = (100 - productDiscount * 100) + " % OFF";

                var priceText = productPrice + " " + currency;

                if (productDiscount < 1) {
                    productPrice = Math.round(((productPriceOriginal * productDiscount) + Number.EPSILON) * 100) / 100;
                    priceText = "<s>" + priceText + "</s> " + productPrice + " " + currency;
                }

                var h0 = document.createElement("p"); // productName
                var h2 = document.createElement("img"); // productImage
                var h3 = document.createElement("p"); // productPrice
                var h4 = document.createElement("p"); // displayDiscount

                h0.innerHTML = productName;
                h0.setAttribute('class', "product__name");
                h2.setAttribute('src', productImage)
                h2.setAttribute('class', 'product__image');
                h3.innerHTML = priceText;
                h3.setAttribute('class', 'product__price');
                h4.innerHTML = displayDiscount;

                currentDiv.appendChild(h0);
                currentDiv.appendChild(h2);
                currentDiv.appendChild(h3);

                if (productDiscount < 1) {
                    h4.setAttribute('class', 'product__discount');
                    currentDiv.appendChild(h4);
                }

                currentDiv.setAttribute('onclick', `location.href="/product?product=${productId}"`);
                currentDiv.setAttribute('style', "cursor: pointer;");
                currentDiv.setAttribute('id', `product-${i}`)

                parentDiv.appendChild(currentDiv);
            }
        });
}

readProductsFromJSON();