var pid = $_GET("product");
var purchase = $_GET("purchase");
var id = $_GET("id");
var coupon = $_GET("coupon");

var cc;
var productLocation;

function readProductsFromJSON() {
    fetch("/json/products.json")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            var currency = jsondata.currency;
            var products = jsondata.products;

            var nameElement = document.getElementById("productName");
            var descriptionElement = document.getElementById("productDescription");
            var imageElement = document.getElementById("productImage");
            var priceElement = document.getElementById("productPrice");

            for (var i = 0; i < products.length; i++) {
                var currentDiv = document.createElement("div");
                currentDiv.setAttribute('class', 'product');

                var productId = products[i].productId;

                if (productId !== pid) {
                    continue;
                }

                var productDescription = products[i].productDescription;
                var validCoupons = products[i].coupons;
                cc = validCoupons;
                var productName = products[i].productName;
                var productImage = products[i].productImage;
                var productPriceOriginal = products[i].productPrice;
                var productPrice = Math.round((products[i].productPrice + Number.EPSILON) * 100) / 100;
                productLocation = products[i].productLocation;

                var productDiscount;
                var index;

                if (coupon) {
                    for (var j = 0; j < cc.length; j++) {
                        if (coupon === cc[j].code) {
                            index = j;
                        }
                    }
                    var productDiscount = 1 - products[i].productDiscount - validCoupons[index].discount;
                }else {
                    var productDiscount = 1 - products[i].productDiscount;
                }

                var priceText = productPrice + " " + currency;

                if (productDiscount < 1) {
                    productPrice = Math.round(((productPriceOriginal * productDiscount) + Number.EPSILON) * 100) / 100;
                    priceText = "<s>" + priceText + "</s> " + productPrice + " " + currency;
                }

                // name
                var h0 = document.createElement("p");
                h0.innerHTML = productName;
                nameElement.appendChild(h0);

                // description
                var h1 = document.createElement("p");
                h1.innerHTML = productDescription;
                descriptionElement.appendChild(h1);

                // image
                var h2 = document.createElement("img");
                h2.setAttribute('src', productImage);
                h2.innerHTML = productDescription;
                imageElement.appendChild(h2);

                //price
                var h3 = document.createElement("p");
                h3.innerHTML = priceText;
                priceElement.appendChild(h3);

                var post = document.getElementById("postProduct");
                post.setAttribute("value", productId);
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    readProductsFromJSON();

    fetch(`/validate?id=${id}`)
    .then((response) => {
        return response.json().then((data) => {
            var status = data.status;
            
            if (status == 'true') {
                var button = document.getElementById("actionButton");
                var priceTag = document.getElementById("productPrice").firstChild.innerHTML = "Purchased";
                button.firstChild.data = "Download";
                button.innerHTML = "Download";
            }
        })
    })

    
    var form = document.getElementById("submit");
    form.addEventListener('submit', e => {
        if (id == null) {
            return;
        }
        e.preventDefault();
        fetch(`/validate?id=${id}`)
        .then((response) => {
            return response.json().then((data) => {
                var status = data.status;
                if (status == 'true') {
                    downloadURI(productLocation, '');
                }else {
                    return true;
                }
            })
        })
    })
});

function applyCoupon() {
    if (coupon == null && id == null) {
        var input = document.getElementById("inputCoupon");
        var code = input.value;

        for (var i = 0; i < cc.length; i++) {
            if (code === cc[i].code) {
                location.href = `/product?product=${pid}&coupon=${code}`
                return;
            }
        }
    }
}

function downloadURI(uri, name) 
{
    var link = document.createElement("a");
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}