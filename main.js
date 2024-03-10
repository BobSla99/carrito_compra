const db = {
  methods: {
    find: (id) => {
      return db.items.find((item) => item.id == id);
    },
    remove: (items) => {
      items.forEach((item) => {
        const product = db.methods.find(item.id);
        product.qty = product.qty - item.qty;
      });
    },
  },
  items: [
    {
      id: 0,
      title: "Funko Pop",
      price: 250,
      qty: 5,
    },
    {
      id: 1,
      title: "Harry Potter",
      price: 345,
      qty: 50,
    },
    {
      id: 2,
      title: "Phillips Hue",
      price: 1200,
      qty: 80,
    },
    {
      id: 3,
      title: "Ipod",
      price: 6000,
      qty: 6,
    },
  ],
};

const shoppingCart = {
  items: [],
  methods: {
    add: (id, qty) => {
      const cartItem = shoppingCart.methods.get(id);

      if (cartItem) {
        if (shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
          cartItem.qty += qty;
        } else {
          alert("No hay inventario suficiente");
        }
      } else {
        shoppingCart.items.push({ id, qty });
      }
    },
    remove: (id, qty) => {
      const cartItem = shoppingCart.methods.get(id);
      if (cartItem.qty - qty > 0) {
        cartItem.qty -= qty;
      } else {
        shoppingCart.items = shoppingCart.items.filter(
          (item) => item.id !== item.id
        );
      }
    },
    count: () => {
      return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
    },
    get: (id) => {
      const index = shoppingCart.items.findIndex((item) => item.id == id);
      return index >= 0 ? shoppingCart.items[index] : null;
    },
    getTotal: () => {
      const total = shoppingCart.items.reduce((acc, item) => {
        const found = db.methods.find(item.id);
        return acc + found.price * item.qty;
      }, 0);
      return total;
    },
    hasInventory: (id, qty) => {
      return db.items.find((item) => item.id === id).qty - qty >= 0;
    },
    purchase: () => {
      db.methods.remove(shoppingCart.items);
      shoppingCart.items = [];
    },
  },
};

renderStore();
function renderStore() {
  const html = db.items.map((item) => {
    return `        <div class="item">
          <div class="title">${item.title}</div>
          <div class="price">${numberToCurrency(item.price)}</div>
          <div class="qty">${item.qty} ${item.qty > 1 ? "units" : "unit"}</div>
          <div class="action">
            <button class="add" data-id=${item.id}>Add to cart</button>
          </div>
        </div>`;
  });
  document.querySelector("#store-container").innerHTML = html.join("");

  document.querySelectorAll(".item .action .add").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      const item = db.methods.find(id);

      if (item && item.qty - 1 > 0) {
        shoppingCart.methods.add(id, 1);
        renderShoppingCart();
      } else {
        console.log("Ya no hay inventario");
      }
    });
  });
}

function renderShoppingCart() {
  // shoppingCart.items.
  const htmle = shoppingCart.items.map((item) => {
    const dbItem = db.methods.find(item.id);
    console.log(shoppingCart.items, dbItem);
    return `<div class="item">
                  <div class="title">${dbItem.title}</div>
                  <div class="price">${numberToCurrency(dbItem.price)}</div>
                  <div class="qty">${item.qty} unit</div>
                  <div class="subtotal">Subtotal:${numberToCurrency(
                    item.qty * dbItem.price
                  )}</div>

                  <div class="action">
                       <button class="addOne" data-id=${item.id}>+</button>
                  </div>
                  <div class="action">
                       <button class="removeOne" data-id=${item.id}>-</button>
                  </div>
            </div>`;
  });
  const closeButton = `
            <div class="cart-header">
                <button class="bClose">Close</div>

            </div>
  `;
  const purchaseButton =
    shoppingCart.items.length > 0
      ? `
            <div class="cart-actions">
                  <button class="bPurchase">Purchase</button>
             </div>        
  `
      : ``;

  const total = shoppingCart.methods.getTotal();
  const totalContainer = `
            <div class="total">Total: ${numberToCurrency(total)}</div>
  
  `;

  const shoppingContainer = document.querySelector("#shopping-cart-container");
  shoppingContainer.innerHTML =
    closeButton + htmle.join("") + totalContainer + purchaseButton;
  shoppingContainer.classList.add("show");
  shoppingContainer.classList.remove("hide");

  document.querySelectorAll(".addOne").forEach((but) => {
    but.addEventListener("click", (e) => {
      let id = but.getAttribute("data-id");
      id = parseInt(id);
      if (shoppingCart.methods.hasInventory(id, 1)) {
        shoppingCart.methods.add(id, 1);
        renderShoppingCart();
      }
    });
  });

  document.querySelectorAll(".removeOne").forEach((but) => {
    but.addEventListener("click", (e) => {
      const id = parseInt(but.getAttribute("data-id"));
      shoppingCart.methods.remove(id, 1);
      renderShoppingCart();
    });
  });

  const bPurchase = document.querySelector(".bPurchase");
  if (bPurchase) {
    bPurchase.addEventListener("click", (e) => {
      shoppingCart.methods.purchase();
      renderShoppingCart();
      renderStore();
    });
  }

  document.querySelector(".bClose").addEventListener("click", (e) => {
    const shoppingCartContainer = document.querySelector(
      "#shopping-cart-container"
    );
    console.log(shoppingCartContainer);
    shoppingCartContainer.classList.remove("show");
    shoppingCartContainer.classList.add("hide");
  });
}

function numberToCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 4,
    style: "currency",
    currency: "USD",
  }).format(n);
}
