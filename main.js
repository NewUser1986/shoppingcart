"use strict";

let carts = document.querySelectorAll(".add-cart");
const wallet = 700;

let products = [
  {
    name: "TShirt1",
    tag: "tshirt1",
    price: 20,
    inCart: 0,
  },
  {
    name: "TShirt2",
    tag: "tshirt2",
    price: 30,
    inCart: 0,
  },
  {
    name: "TShirt3",
    tag: "tshirt3",
    price: 30,
    inCart: 0,
  },
  {
    name: "TShirt4",
    tag: "tshirt4",
    price: 50,
    inCart: 0,
  },
  {
    name: "TShirt5",
    tag: "tshirt5",
    price: 60,
    inCart: 0,
  },
  {
    name: "TShirt6",
    tag: "tshirt6",
    price: 50,
    inCart: 0,
  },
  {
    name: "TShirt7",
    tag: "tshirt7",
    price: 40,
    inCart: 0,
  },
  {
    name: "TShirt8",
    tag: "tshirt8",
    price: 30,
    inCart: 0,
  },
  {
    name: "TShirt9",
    tag: "tshirt9",
    price: 20,
    inCart: 0,
  },
  {
    name: "TShirt10",
    tag: "tshirt10",
    price: 50,
    inCart: 0,
  },
];

for (let i = 0; i < carts.length; i++) {
  carts[i].addEventListener("click", () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
  });
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  }
}

function cartNumbers(product, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (action == "decrease") {
    localStorage.setItem("cartNumbers", productNumbers - 1);
    document.querySelector(".cart span").textContent = productNumbers - 1;
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart span").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart span").textContent = 1;
  }

  setItems(product);
}

function setItems(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      cartItems = { ...cartItems, [product.tag]: product };
    }
    cartItems[product.tag].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product, action) {
  //console.log("Product prise is", product.price);
  let cartCost = localStorage.getItem("totalCost");

  if (action == "decrease") {
    cartCost = parseInt(cartCost);

    localStorage.setItem("totalCost", cartCost - product.price);
  } else if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products-cart");

  let cartCost = localStorage.getItem("totalCost");
  if (cartItems && productContainer) {
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `<div class="product"><ion-icon class="trash" name="trash-outline"></ion-icon>
      <img src="./images/${item.tag}.jpg">
      <span>${item.name}</span>   
      </div> 
      <div class="price-cart">$${item.price},00</div> 
      <div class="quantity"><ion-icon class="decrease" name="caret-back-circle-outline"></ion-icon><span>${
        item.inCart
      }</span>
      <ion-icon class="increase" name="caret-forward-circle-outline"></ion-icon>
      </div>
      <div class="total"> $${item.inCart * item.price},00</div>`;
    });

    productContainer.innerHTML += ` <div class="basketTotalContainer">
    <h4 class="basketTotalTittle"> Basket Total </h4>
    <h4 class="basketTotal"> $${cartCost},00 </h4>
    </div>`;

    productContainer.innerHTML += ` <div class="walletTotalContainer">
      <h4 class="walletTotalTittle"> Wallet remain money<br>(<ion-icon name="wallet-outline"></ion-icon>
$${wallet}) </h4>
      <h4 class="walletTotal"> $${wallet - cartCost},00 </h4>
    </div>`;

    if (wallet - cartCost <= 0) {
      alert("You dont' have money in wallet!");
    }
  }
  dltButtons();
  menageQuantity();
}

function dltButtons() {
  let trashBtn = document.querySelectorAll(".product ion-icon");
  let productName;
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let cartCost = localStorage.getItem("totalCost");

  for (let i = 0; i < trashBtn.length; i++) {
    trashBtn[i].addEventListener("click", () => {
      productName = trashBtn[i].parentElement.textContent
        .trim()
        .toLowerCase()
        .replace(/ /g, "");

      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[productName].inCart
      );
      localStorage.setItem(
        "totalCost",
        cartCost - cartItems[productName].price * cartItems[productName].inCart
      );

      delete cartItems[productName];
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      displayCart();
      onLoadCartNumbers();
      formatCurrency();
    });
  }
}

function menageQuantity() {
  let decreaseBtns = document.querySelectorAll(".decrease");
  let increaseBtns = document.querySelectorAll(".increase");

  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let currentQuantity = 0;
  let currentProduct = "";

  for (let i = 0; i < decreaseBtns.length; i++) {
    decreaseBtns[i].addEventListener("click", () => {
      currentQuantity =
        decreaseBtns[i].parentElement.querySelector("span").textContent;
      currentProduct = decreaseBtns[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector("span")
        .textContent.toLowerCase()
        .trim();

      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbers(cartItems[currentProduct], "decrease");
        totalCost(cartItems[currentProduct], "decrease");
        localStorage.setItem("productsInCart", JSON.stringify(cartItems));
        displayCart();
      }
    });
  }

  for (let i = 0; i < increaseBtns.length; i++) {
    increaseBtns[i].addEventListener("click", () => {
      currentProduct = increaseBtns[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector("span")
        .textContent.toLowerCase()
        .trim();

      cartItems[currentProduct].inCart += 1;
      cartNumbers(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      displayCart();
    });
  }
}

onLoadCartNumbers();
displayCart();
