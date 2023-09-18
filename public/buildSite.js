function createElementWithAttribute(name, attribute, attributeValue) {
    let element = document.createElement(name);
    element.setAttribute(attribute, attributeValue);
    return element;
}

function buildMenubar() {
    const menubar = createElementWithAttribute('nav', 'class', 'menubar');
    menubar.innerHTML = `<span><a href="#pizzaflex">Pizza Menu</a></span>
<span><a href="/api/allergens" target="_blank">Allergen list</a></span>
<span><a href="#footer">About us</a></span>`;
    root.appendChild(menubar);
}

function buildHeader() {
    const header = createElementWithAttribute('div', 'class', 'header');
    header.innerHTML = ` <div class="imagebar">
    <div class="marioimage">
        <img src="https://pbs.twimg.com/media/FIezhiCWQAMASou.png" alt="Image of Mario with a pan">
    </div>
    <div class="sitetitle">
        <h1>Goomba's Pizza</h1>
    </div>
    <div class="goombaimage">
        <img src="https://cdn.discordapp.com/attachments/1020230538411388949/1050038916008382565/goomba.png"
            alt="Image of Mario with a pan">
    </div>
</div>`
    root.appendChild(header);
}

function buildContent() {
    const content = createElementWithAttribute('div', 'id', 'content');
    content.setAttribute('class', 'content');
    const pizzaflex = addPizzaData();
    const orderform = addOrderForm();
    content.appendChild(pizzaflex);
    content.appendChild(orderform);
    root.appendChild(content);
}

function addOrderForm() {
    const orderform = createElementWithAttribute('div', 'id', 'orderform');
    const cart = createElementWithAttribute('div', 'id', 'cart');
    const totalCost = createElementWithAttribute('div', 'id', 'totalCost');
    totalCost.innerHTML = `<p>Total Price: 0,- $</p>`;
    cart.innerText = `Add some pizzas for your order`;
    const form = document.createElement('form');
    form.innerHTML = `<label for="customerName">Name* </label>
    <input type="text" id="customerName" name="customerName" required>

    <label for="customerEmail">E-mail address* </label>
    <input type="email" id="customerEmail" name="customerEmail" required>

    <label for="customerPhone">Phone number* </label>
    <input type="text" id="customerPhone" name="customerPhone" required>

    <label for="customerPostCode">Postcode* </label>
    <input type="text" id="customerPostCode" name="customerPostCode" required>

    <label for="customerCity">City name* </label>
    <input type="text" id="customerCity" name="customerCity" required>

    <label for="customerStreetAddress">Address* </label>
    <input type="text" id="customerStreetAddress" name="customerStreetAddress" required>

    <label for="customerDoorBell">Floor/Doorbell: </label>
    <input type="text" id="customerDoorBell" name="customerDoorBell">

    <label for="customerComments">Comment: </label>
    <input type="text" id="customerComments" name="customerComments">`
    const orderButton = createElementWithAttribute('button', 'id', 'orderButton');
    orderButton.innerText = 'Create Order';

    form.setAttribute('class', 'hidden');
    orderButton.setAttribute('class', 'hidden');
    totalCost.setAttribute('class', 'hidden');

    orderform.appendChild(cart);
    orderform.appendChild(totalCost);
    orderform.appendChild(form);
    orderform.appendChild(orderButton);

    return orderform;
}

function addPizzaData() {
    const pizzaflex = createElementWithAttribute('div', 'id', 'pizzaflex');
    pizzaflex.setAttribute('class', 'pizzaflex');

    for (let pizza of pizzaList) {
        const pizzaElement = createElementWithAttribute('div', 'class', 'pizza');
        let allergenOfThisPizza = [...pizza.allergens].map(x => allergenList[+x - 1].name.EN).join(', ');
        pizzaElement.innerHTML = `
        <span class="allergens"><span data-title="Allergens: ${allergenOfThisPizza}"><img src="https://freesvg.org/img/Info-Button.png" alt="Allergen info"></span>
        </span>
        <div class="pizzaTextContainer">        
        <span class="pizzaname">${pizza.name}</span><br>
        <span class="ingredients">Ingredients: ${pizza.ingredients.join(', ')}</span><br>        
    </div>
    <div class="pizzaimage">
        <img src="../pizzas/pizza${pizza.id}.png" alt="Image of a pizza">
    </div>
    <div>
        <span class="pizzaprice">Price: ${pizza.price} $</span><br>
        <span>Quantity:</span>
        <input id="pizza${pizza.id}number" type="number" class="quantity" name="quantity" min="1" placeholder="0" required>
        <span><button type="button" pizzaid="${pizza.id}" class="addToCartButton">Add to Cart</button></span>
        </div>`
        pizzaflex.appendChild(pizzaElement);
    }
    return pizzaflex;
}

function buildFooter() {
    const footer = createElementWithAttribute('div', 'id', 'footer');
    footer.setAttribute('class', 'footer');
    footer.innerHTML = `        <div class="contactUs">Contact Us
    <div class="fontSize">
        📞 <a href="tel:+36-1-234-5678">+36-1-234-5678</a>
    </div>
    <div class="fontSize">
        ✉️ <a href="mailto:goombapizza@contact.us">goombapizza@contact.us</a>        
    </div>
</div>
<div class="openingHours">Opening Hours
    <div class="fontSize">🗓 Mon - Thu: 11:30 AM - 09:00 PM</div>
    <div class="fontSize">🗓 Fri - Sat: 11:00 AM - 11:30 PM</div>
    <div class="fontSize">🗓 Sun: 11:30 AM - 11:00 PM</div>
</div>
<div class="restaurantAddress">Restaurant Address
    <div class="fontSize">1843 7th St NW Washington, DC 20001</div>
    <img src="https://www.flipa.net/wp-content/uploads/super-mario-bros-bar.jpg">
</div>`
    root.appendChild(footer);
}