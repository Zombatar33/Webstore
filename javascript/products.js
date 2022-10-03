function generateDropdown() {
    fetch("/json/products.json")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            var parentDiv = document.getElementById("products");

            var currency = jsondata.currency;
            var globalDiscount = jsondata.globalDiscount;
            var products = jsondata.products;

            for (var i = 0; i < products.length; i++) {
                var currentDiv = document.createElement("div");
                currentDiv.setAttribute('class', 'product');

                var productName = products[i].productName;
                var productDescription = products[i].productDescription;
                var productImage = products[i].productImage;
                var productPrice = products[i].productPrice + " " + jsondata.currency;
                var productDiscount = products[i].productDiscount;
                var displayDiscount = (productDiscount * 100) + " % Discounted";
                var coupons = products[i].coupons;

                var h0 = document.createElement("p"); // productName
                var h1 = document.createElement("p"); // productDescription
                var h2 = document.createElement("img"); // productImage
                var h3 = document.createElement("p"); // productPrice
                var h4 = document.createElement("p"); // displayDiscount
                var h5 = document.createElement("p"); // coupons

                h0.innerHTML = productName;
                h1.innerHTML = productDescription;
                h2.setAttribute('src', productImage)
                h2.setAttribute('width', 400);
                // h2.setAttribute('height', 'auto')
                h3.innerHTML = productPrice;
                h4.innerHTML = displayDiscount;
                h5.innerHTML = coupons;

                currentDiv.appendChild(h0);
                currentDiv.appendChild(h1);
                currentDiv.appendChild(h2);
                currentDiv.appendChild(h3);
                currentDiv.appendChild(h4);
                currentDiv.appendChild(h5);

                currentDiv.setAttribute('onclick', "location.href='#';");
                currentDiv.setAttribute('style', "cursor: pointer;");

                parentDiv.appendChild(currentDiv);
            }
        });
}

generateDropdown();