
window.addEventListener("load", function () {
    var products = ["Iphone", "Samsung", "Nokia", "Sony", "Motorola"];
    var price = [784, 534, 345, 433, 788];

    html = "<table id='phonetable'>";
    html += "<tr><th>Products</th><th>Price($)</th><th>Quantity</th><th></th></tr>";

    for (var i = 0; i < products.length; i++) {
        html += `<tr id='${products[i]}'><td>${products[i]}</td><td>${price[i]}</td><td id='${products[i]}${[i]}'></td><td><input type='button' onclick="AddQuantity('${products[i]}', '${[i]}')" value='Add to cart'></td></tr>`;
    }
    html += "</table>";

    document.getElementById("container").innerHTML = html;
    document.getElementById("btnCheckout").style.display = "none";
});

function AddQuantity(product, rowId) {
    var getQuantity = prompt("Enter quantity of " + product + " phone:");

    if (Number.isInteger(+getQuantity) && getQuantity > 0) {
        document.getElementById(product + rowId).innerHTML = getQuantity;
        quantityCheck();
        return;
    }
    else {
        alert("Please quantity in number and not negative");
    }
}

function quantityCheck() {
    var qty = 0;
    var sTableName = document.getElementById("phonetable");
    for (var i = 0; i < sTableName.children[0].childElementCount; i++) {
        var tableRow = sTableName.children[0].children[i];
        for (var j = 0; j < tableRow.childElementCount; j++) {
            if (j != 2) {
                continue;
            }
            var tableColumn = tableRow.children[j];
            if (tableColumn.innerText != '' && Number.isInteger(+tableColumn.innerText)) {
                qty += tableColumn.innerText;
            }
        }
    }

    if (qty != 0) {
        document.getElementById("btnCheckout").style.display = "block";
        document.getElementById("receiptTitle").innerHTML = "";
        document.getElementById("customerId").innerHTML = "";
        document.getElementById("shoppingInfo").innerHTML = "";
    }else{
        document.getElementById("btnCheckout").style.display = "none";
    }
}

function checkOut() {
    var name = prompt("Enter your name:");
    var trCost = 0;
    var gst = 0.13;
    var totalCost = 0;
    var checkoutHtml = "<table id='receipttable'>";
    checkoutHtml += `<tr><th>Product</th><th>QTY</th><th>Total</th></tr>`

    var sTableName = document.getElementById("phonetable");
    for (var i = 0; i < sTableName.children[0].childElementCount; i++) {
        if (i == 0) {
            continue;
        }
        var tableRow = sTableName.children[0].children[i];
        if (tableRow.children[2].innerText != '' && Number.isInteger(+tableRow.children[2].innerText)) {
            var unit = tableRow.children[1].innerText;
            var rqty = tableRow.children[2].innerText;
            var qtyCost = unit * rqty;
            trCost += qtyCost;
            checkoutHtml += `<tr><td><b>${tableRow.children[0].innerText}</b></td><td>${tableRow.children[2].innerText}</td><td>$${qtyCost}</td></tr>`;
        }
    }

    var discount = trCost * gst;
    totalCost = trCost + discount;

    discount = discount.toFixed(2);
    totalCost = totalCost.toFixed(2);

    checkoutHtml += `<tr><td colspan='2'><b>GST @ 13%</b></td><td>$${discount}</td></tr>`
    checkoutHtml += `<tr><td colspan='2'><b>Total</b></td><td>$${totalCost}</td></tr>`
    checkoutHtml += "</table>";

    document.getElementById("receiptTitle").innerHTML = "<h2>Receipt</h2>";
    document.getElementById("customerId").innerHTML = "<b>Customer name: " + name + "</b>";
    document.getElementById("shoppingInfo").innerHTML = checkoutHtml;
}