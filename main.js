const db = {
  methods: {
    find: (id) => {
      return db.items.find((item) => item.id === parseInt(id));
    },
    remove: (items) => {
      items.forEach((item) => {
        const product = db.items.find(item.id);
        product.qty = product.qty - item.qty;
      });
      console.log(db);
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
      const index = shoppingCart.items.findIndex((item) => item.id === id);
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
  console.log(db.items);
  const html = db.items.map((item) => {
    return `        <div class="item">
          <div class="title">${item.title}</div>
          <div class="price">${numberToCurrency(item.price)}</div>
          <div class="qty">${item.qty}</div>
          <div class="action">
            <button class="add" data-id=${item.id}>Add to cart</button>
          </div>
        </div>`;
  });
  document.querySelector("#store-container").innerHTML = html.join("");

  document.querySelectorAll(".item .action .add").forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log(button);

      const id = e.target.getAttribute("data-id");
      const item = db.methods.find(id);

      console.log(item);

      if (item && item.qty - 1 > 0) {
        shoppingCart.methods.add(id, 1);
        renderShoppingCart();
      } else {
        console.log("Ya no hay inventario");
      }
    });
  });
}

function renderShoppingCart() {}

function numberToCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(n);
}
