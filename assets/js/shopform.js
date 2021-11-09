
var errors = document.getElementById("errors"); //Error display veriable

//Regex for field validations
var regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var regexString = /^$/;
var regexCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
var regexZero = /^0/;

const validateString = (text) => {
    return regexString.test(text);
}

const validateCard = (text) => {
    return regexCard.test(text);
}

//Load all Product list on window load into tablle
window.addEventListener("load", function () {
    var products = ["Iphone", "Samsung", "Nokia", "Sony", "Motorola"];
    var price = [2, 3, 1, 3, 5];

    html = "<table id='phonetable'>";
    html += "<tr><th>Products</th><th>Price($)</th><th>Quantity</th></tr>";

    for (var i = 0; i < products.length; i++) {
        html += `<tr id='${products[i]}'><td>${products[i]}</td><td>${price[i]}</td><td><input id='${products[i]}${[i]}' placeholder='10' type='number' onblur="AddQuantity('${products[i]}', '${[i]}')" ></td></tr>`;
    }
    html += "</table>";

    document.getElementById("container").innerHTML = html;
});

function AddQuantity(product, rowId)//Check quantity input type 
{

    var quantity = document.getElementById(product + rowId); // Quantity field input
    var getQuantity = quantity.value; // Quantity field values
    getQuantity = parseInt(getQuantity);
    checkZero(product, rowId);
    if (Number.isInteger(+getQuantity) && getQuantity >= 1) {
        quantityCheck();
        errors.style.display = "none"
        return;
    }
    else if (getQuantity == 0) {
        quantityCheck();
        errors.style.display = "none"
        return;
    }
    else {
        errors.style.display = "block"
        errors.innerHTML = "Please quantity should be in number and not negative";
        quantityCheck();
        quantity.value = 0;
    }
}

function quantityCheck()// Check Customer quantity request to process checkout
{
    var qty = 0;
    var sTableName = document.getElementById("phonetable");
    for (var i = 0; i < sTableName.children[0].childElementCount; i++)//Read all quantity field
    {
        if (i == 0) {
            continue;
        }
        var lv_input = sTableName.rows[i].cells[2].querySelector('input').value;
        if (Number.isInteger(+lv_input) && lv_input >= 1) {
            qty += parseInt(lv_input);
        }
    }
    qty = parseInt(qty);
    if (qty >= 1)//Block or Show check out div base on quantity request 
    {
        document.getElementById("customerInfo").style.display = "block";
        document.getElementById("btnCheckout").style.display = "block";
        return;
    }
    document.getElementById("customerInfo").style.display = "none";
    document.getElementById("btnCheckout").style.display = "none";
}

function checkOut() {

    //Getting Customer credit CARD information
    var flname = document.getElementById("flname").value;
    var email = document.getElementById("email").value;
    var credit = document.getElementById("creditcard").value;
    var expmonth = document.getElementById("expmonth").value;
    var expyear = document.getElementById("expyear").value;

    if (validateString(flname))// Validating Name string
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter your full name";
        return;
    }
    else if (validateString(email))// Validating Email string is empty
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter your email";
        return;
    }
    else if (!validateEmail(email))// Validating for valid email address
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter valid email";
        return;
    }
    else if (validateString(credit))// Validating CreditCard string
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter CreditCard number";
        return;
    }
    else if (credit.length < 19) // Validating CreditCard
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter valid CreditCard number";
        return;
    }
    else if (validateCard(credit)) // Validating CreditCard
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter valid CreditCard number";
        return;
    }
    else if (validateString(expmonth))// Validating Name string
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter CreditCard Expiring Month";
        return;
    }
    else if (validateString(expyear))// Validating expiring year string
    {
        errors.style.display = "block"
        errors.innerHTML = "Please enter CreditCard Expiring Year";
        return;
    }
    else if (!Number.isInteger(+expyear)) {
        errors.style.display = "block"
        errors.innerHTML = "Invalid year, please enter expiring year in mnumber.";
        return;
    }
    else {
        errors.style.display = "none"
    }

    //Stop showing product and CreditCard information
    document.getElementById("producttable").style.display = "none";
    document.getElementById("customerInfo").style.display = "none";
    document.getElementById("btnCheckout").style.display = "none";

    //Displaying Shopping receipt information
    document.getElementById("formData").style.display = "block";

    //Setting Customer credit CARD information for Displaying
    document.getElementById("lblflname").innerHTML = flname;
    document.getElementById("lblEmailAddress").innerHTML = email;
    credit = "xxxx-xxxx-xxxx-" + credit.slice(credit.length - 4);//Pick last 4 digit of the creditcard number
    document.getElementById("lblCreditCard").innerHTML = credit;

    var trCost = 0;
    var gst = 0.10;
    var totalCost = 0;

    //Create Receipt Table wit Order information and Customer details
    var checkoutHtml = "<table id='receipttable'>";
    checkoutHtml += `<tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>`

    var sTableName = document.getElementById("phonetable");
    for (var i = 0; i < sTableName.children[0].childElementCount; i++) {
        if (i == 0) {
            continue;
        }

        var lv_itemname = sTableName.rows[i].cells[0].innerText;
        var itemname = lv_itemname;

        var lv_unit = sTableName.rows[i].cells[1].innerText;
        var unit = parseInt(lv_unit);

        var lv_input = sTableName.rows[i].cells[2].querySelector('input').value;
        var rqty = parseInt(lv_input);

        if (rqty != '' && Number.isInteger(+rqty) && rqty > 0) {
            var qtyCost = unit * rqty;
            trCost += qtyCost;
            checkoutHtml += `<tr><td><b>${itemname}</b></td><td>${rqty}</td><td>$${unit}</td><td>$${qtyCost}</td></tr>`;
        }
    }

    var discount = trCost * gst;
    if (discount < 10) {
        discount = 10;
    }
    totalCost = trCost + discount;

    discount = discount.toFixed(2);
    totalCost = totalCost.toFixed(2);

    checkoutHtml += `<tr><td>Donation</td><td colspan='2'><b>Minimum @ 10%</b></td><td>$${discount}</td></tr>`
    checkoutHtml += `<tr><td colspan='3'><b>Total</b></td><td>$${totalCost}</td></tr>`
    checkoutHtml += "</table>";

    document.getElementById("receipt").innerHTML = checkoutHtml;
}

function validateEmail(inputText) {
    if (regexEmail.test(inputText)) {
        return true;
    }
    return false;
}

function onlyNumbers(evt) {
    var e = event || evt; // for trans-browser compatibility
    var charCode = e.which || e.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function checkZero(product, rowId) {

    var quantity = document.getElementById(product + rowId); // Quantity field input
    var getQuantity = quantity.value; // Quantity field values
    while (getQuantity.charAt(0) === '0') {
        getQuantity = getQuantity.substring(1);
        quantity.value = getQuantity;
    }
}

function OnlyCharacter(objEvt) {
    var charCode = (objEvt.which) ? objEvt.which : event.keyCode
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
        //document.getElementById("expmonth").style.backgroundColor = "#B2D8B2";
        document.getElementById("expmonth").value.toUpperCase();
        return true;
    }
    //document.getElementById("expmonth").style.backgroundColor = "#FFB2B2";
    return false;
}

function newOrder()// Start new order function
{
    //Stop showing product and CreditCard information
    document.getElementById("formData").style.display = "none";
    document.getElementById("customerInfo").style.display = "none";
    document.getElementById("btnCheckout").style.display = "none";

    //Displaying Shopping receipt information
    document.getElementById("producttable").style.display = "block";

    //Clear previouse quantity requested by customer
    var sTableName = document.getElementById("phonetable");
    for (var i = 0; i < sTableName.children[0].childElementCount; i++) {
        if (i == 0) {
            continue;
        }
        sTableName.rows[i].cells[2].querySelector('input').value = 0;
    }
}