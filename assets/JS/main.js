async function getProducts(){
    try{
        const data= await fetch
        ("https://ecommercebackend.fundamentos-29.repl.co/"
        );
    
        const res = await data.json();
        window.localStorage.setItem("products", JSON.stringify(res))
        return res;

    } catch(error){
    console.log(error);

    }

}

function printProducts(db){
    
    const productsHTML = document.querySelector(".products");

    let html = '';

    for (const product of db.products) {
        const buttonAdd = product.quantity
                            ? `<i class='bx bx-plus' id='${product.id}'></i>` 
                            : "<span class='Sin-articulos'>Sin articulos</span>";
        
        html += `
        <div class="product">
            <div class="product__img">
                <img src="${product.image}"alt="imagen"/> 
                </div>

            <div class="product__info">
                <h4>${product.name} | <span><b>Stock</b>:${product.quantity}</span></h4>
                    <h5>
                    $${product.price} 
                    ${buttonAdd}  
                    </h5>
                </div>
            </div>
            `;
    }

        productsHTML.innerHTML= html;

}

function handleShowCard(){
    const iconCardHTML = document.querySelector(".bx-cart");
    const cardHTML = document.querySelector(".card");

    iconCardHTML.addEventListener("click", function() {
    cardHTML.classList.toggle("card__show");
});

}

function addToCardFromProducts(db){
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            const productFind = db.products.find(
                (product) => product.id === id
            );

            if (db.card[productFind.id]){
                if (productFind.quantity === db.card[productFind.id].amount)
                    return alert("No hay existencias");       
                db.card[productFind.id].amount++;
            }else{
                db.card[productFind.id] = {...productFind, amount: 1};
            }

            window.localStorage.setItem("card", JSON.stringify(db.card));
            printProductsInCard(db);
            printTotal(db);
            handlePrintAmountProducts(db);
        }
    });
}

function printProductsInCard(db){

    const cardProducts = document.querySelector(".card__products");

    let html = "";

    for (const product in db.card) {
    
    const { quantity, price, name, image, id, amount } =  db.card [product];
    console.log({ quantity, price, name, image, id, amount });

        html += `
            <div class="card__product">
                    <div class="card__product--img">
                    <img src="${image}" alt="imagen" />
                </div>
            <div class="card__product--body">
                    <h4>${name} | ${price}</h4>
                    <p>Stock:${quantity}</p>

                <div class="card__product--body-op" id= "${id}">
                    <i class='bx bx-minus'></i>
                    <span>${amount} unit</span>
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash'></i>
                </div>  
            </div>
        </div> 
    `;

    }
    cardProducts.innerHTML = html;
}


function handleProductsInCard(db){
    const cardProducts = document.querySelector(".card__products");

    cardProducts.addEventListener("click", function(e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.parentElement.id);

        const productFind = db.products.find(
            (product) => product.id === id
        ); 

        if (productFind.quantity === db.card[productFind.id].amount)
        return alert("Agotado");

        db.card[id].amount++;

    }
        if (e.target.classList.contains("bx-minus")) {
            const id = Number(e.target.parentElement.id);
            if (db.card[id].amount === 1){
                const response = confirm("¿Deseas eliminar producto?"
                );
                if(!response) return; 
                delete db.card[id];
            } else{
                db.card[id].amount--;
            }            
        }

        if (e.target.classList.contains("bx-trash")) {
            const id = Number(e.target.parentElement.id); 
            const response = confirm(
                "¿Deseas eliminar producto?"
            );
            if(!response) return;            
            delete db.card[id];
        }
                    
        window.localStorage.setItem("card" , JSON.stringify(db.card));
        printProductsInCard(db);
        printTotal(db);
        handlePrintAmountProducts(db);

    
    });

}

function printTotal(db){
    
    const infoTotal = document.querySelector(".info__total");
    const infoAmount = document.querySelector(".info__amount");


    let totalProduct = 0;
    let amountProduct = 0;

    for (const product in db.card) {
        const {amount, price} = db.card[product];
        totalProduct += price * amount;
        amountProduct += db.card[product].amount;
    }
        
        infoTotal.textContent = "$" + totalProduct + ".00";
        infoAmount.textContent = amountProduct + " units";
    
}

function handleTotal(db){

    const btnBuy = document.querySelector(".btn__buy");

    btnBuy.addEventListener("click", function () {
    if (!Object.values(db.card).length) 
    return alert("Debes tener un articulo en el carrito");
        
    const response = confirm("¿Seguro quieres comprar?");
        if(!response) return;
        
        const currentProducts =[];

        for (const product of db.products) {
            const productCard = db.card[product.id];

            if (product.id === productCard?.id) {
                currentProducts.push({
                    ...product, 
                    quantity: product.quantity - productCard.amount,
            });
        } else {
            currentProducts.push(product);
        }
    }
    db.products = currentProducts;
    db.card = {}

    window.localStorage.setItem('products', JSON.stringify(db.products));
    window.localStorage.setItem("card", JSON.stringify(db.card));


    printTotal(db);
    printProductsInCard(db);
    printProducts(db);
    handlePrintAmountProducts(db);
    });
}

function handlePrintAmountProducts(db){ 
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;

    for (const product in db.card) {
        amount += db.card[product].amount;        
    }

    amountProducts.textContent = amount;
}

async function main() {
    const db = {
        products:
            JSON.parse(window.localStorage.getItem("products")) ||
            (await getProducts()),
            card:JSON.parse(window.localStorage.getItem("card")) || {},
    };

    printProducts(db);
    handleShowCard();
    addToCardFromProducts(db);
    printProductsInCard(db);
    handleProductsInCard(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db);


}


main();