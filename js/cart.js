
        const emptyCartSection = document.getElementById('emptyCart');
        const cartBody = document.getElementById('cartBody');
        const fullCartContent = document.getElementById('fullCartContent');
        const cartSummarySection = document.getElementById('cartSummary');
        const mainhead = document.getElementById('cardHead');
        const cartContainer = document.getElementById("cart-items");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            emptyCartSection.style.display = 'block';

            mainhead.style.display = 'none';


            fullCartContent.style.display = 'none';


            cartSummarySection.style.display = 'none';

        } else {

            emptyCartSection.style.display = 'none';


            fullCartContent.style.display = 'block';


            mainhead.style.display = 'block';

            cartSummarySection.style.display = 'block';
           
             
           
            cartContainer.innerHTML = cart.map(item => `
   
                            <tr class="cart-product-row" data-id="1" id="cartrow">
                                <td width="16.66%"><img src="${item.image}" alt="${item.title}" class="product-image"></td>
                                <td width="16.66%" class="product-name">${item.title}</td>
                                 <td width="16.66%" class="sub-total">${item.selectVal}</td>
                                <td width="16.66%"><input type="number" value="${item.qty}" min="1" class="quantity-input" max="5" id="inprice" readonly></td>
                               <td width="16.66%" class="product-price">${item.price}</td>
                                <td width="16.66%" id= "clear-cart"><img src="images/close.png" class="removebtn"></td>
                            </tr> 
  `).join("");
        }
         

        let cartrow = document.getElementsByClassName("removebtn");

        for (let index = 0; index < cart.length; index++) {
            cartrow[index].addEventListener("click", () => {
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                location.reload();
            });
        }
  