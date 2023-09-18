let pizzaList;
let allergenList;

const fetchPizzas = fetch('/api/pizza')
    .then((resp) => resp.json())
    .then(data => pizzaList = data)
    .catch(err => console.log(err))

const fetchAllergens = fetch('/api/allergens')
    .then((resp) => resp.json())
    .then(data => allergenList = data)
    .catch(err => console.log(err))

const allData = Promise.all([fetchPizzas, fetchAllergens]);

allData
    .then((res) => buildSite())
    .then(() => addEventListeners())
    .catch(err => console.log(err));

const orderSchema = {
    pizzas: [
    ],
    customer: {
        name: "",
        email: "",
        phone: "",
        address: {
            postcode: "",
            city: "",
            street: "",
            doorbell: ""
        }
    },
    comments: ""
}

let myOrder = JSON.parse(JSON.stringify(orderSchema));

function buildSite() {
    buildMenubar();
    buildHeader();
    buildContent();
    buildFooter();
}

function addEventListeners() {
    const addToCartButtons = document.getElementsByClassName("addToCartButton")
    for (let button of addToCartButtons) {
        button.addEventListener('click', addToCart);
    }
    const orderButton = document.getElementById('orderButton');
    orderButton.addEventListener('click', postOrder);
}

function addToCart(event) {
    const form = document.querySelector('form');
    const clickedID = event.target.getAttribute('pizzaid');
    const pizzaAmountField = document.getElementById(`pizza${clickedID}number`);
    const pizzaAmount = Number(document.getElementById(`pizza${clickedID}number`).value);
    if (!pizzaAmountField.checkValidity()) {
        pizzaAmountField.reportValidity();
    } else if (pizzaAmount > 0 && Number.isInteger(pizzaAmount)) { //might be unnecessary
        if (myOrder.pizzas.some(pizza => pizza.id == clickedID)) { //Is there a pizza with the clicked ID? true/false
            myOrder.pizzas.map(pizza => pizza.amount += pizza.id == clickedID ? pizzaAmount : 0); //increase pizza amount, if id matches
        } else {
            myOrder.pizzas.push({
                id: clickedID,
                amount: pizzaAmount
            });
        }
        updateCart();
        totalCost.classList.remove("hidden");
        orderButton.classList.remove("hidden");
        form.classList.remove("hidden");
    } else {
        alert(`Invalid pizza amount!`);
    }
}

function postOrder() {
    const form = document.querySelector('form');
    if (!form.checkValidity()) {
        form.reportValidity();
    } else if (myOrder.pizzas.length > 0) {
        myOrder.customer.name = customerName.value;
        myOrder.customer.email = customerEmail.value;
        myOrder.customer.phone = customerPhone.value;
        myOrder.customer.address.postcode = customerPostCode.value;
        myOrder.customer.address.city = customerCity.value;
        myOrder.customer.address.street = customerStreetAddress.value;
        myOrder.customer.address.doorbell = customerDoorBell.value;
        myOrder.customer.comments = customerComments.value;
        //console.log(myOrder);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(myOrder),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/order', requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result == 'done') {
                    myOrder = JSON.parse(JSON.stringify(orderSchema));
                    totalCost.classList.add("hidden");
                    orderButton.classList.add("hidden");
                    form.classList.add("hidden");
                    cart.innerHTML = `Thank you for your order, we will ship it immediately :)`;
                    console.log("Server result = " + result);
                }
            })
            .catch(error => console.log('error', error));
    } else {
        alert(`There are no pizzas in your Mario cart!`)
    }
}


function updateCart() {
    cart.innerHTML = ``;
    let cost = 0;
    for (let pizza of myOrder.pizzas) {
        let pizzaSubTotal = (pizzaList[+pizza.id - 1].price * Number(pizza.amount)).toFixed(2);
        cart.innerHTML += `<span>${pizzaList[+pizza.id - 1].name}:</span><span>${pizza.amount} pcs: </span><span>${pizzaSubTotal}</span><span class="bins" trashid="${pizza.id}">🗑️</span>`
        cost += +pizzaSubTotal;
    }
    const bins = document.getElementsByClassName('bins');
    for (let bin of bins) {
        bin.addEventListener('click', (event) => {
            const trashID = event.target.getAttribute('trashid');
            myOrder.pizzas = myOrder.pizzas.filter(pizza => pizza.id != trashID);
            updateCart();
        })
    }
    cost = cost.toFixed(2);
    totalCost.innerHTML = `<span>Total Price:</span> <span>${cost} $</span>`;
}