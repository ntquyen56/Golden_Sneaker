import { shose as shoses } from "./data.js"

window.addEventListener('load', function () {

	let cart = [];
	const containerShoses = document.querySelector('.shop-items');
	const containerCart = document.querySelector('.card-items');


	const findOneShoseInData = function (id) {
		let data = '';
		for (let i = 0; i < shoses.length; i++) {
			if (shoses[i].id == id) {
				data = shoses[i];
				break;
			}
		}

		return data;
	}

	const calculateSumCart = () => {
		const cart = JSON.parse(localStorage.getItem('cart')) || [];
		let sum = 0;
		if (cart.length > 0) {
			cart.forEach(item => {
				sum += +item.price * item.number;
			})
		}
		const domSumCart = document.querySelector('.card-title-amount');
		domSumCart.textContent = '$ ' + parseFloat(sum).toFixed(2);
	}

	const renderItemCart = (item) => {
		let ItemCart = `
		<div class="cart-item ">
				<div class="cart-item-left ">
					<div class="cart-item-image" style="background-color: ${item.color};">
						<div class="cart-item-image-block"><img
								src="${item.image}">
						</div>
					</div>
				</div>
				<div class="cart-item-right  ">
					<div class="cart-item-name">${item.name}</div>
					<div class="cart-item-price">$${item.price}</div>
					<div class="cart-item-actions">
						<div class="cart-item-count">
							<div data-id="${item.id}" class="cart-item-count-button decre">-</div>
							<div class="cart-item-count-number">${item.number}</div>
							<div data-id="${item.id}" class="cart-item-count-button incre">+</div>
						</div>
						<div class="cart-item-remove">
							
							<img
								data-id="${item.id}"
								src="./app/assets/trash.png"
								class="cart-item-remove-icon"></div>
					</div>
				</div>
		</div>
		`;

		containerCart.insertAdjacentHTML('beforeend', ItemCart);

	}

	containerShoses.addEventListener('click', function (e) {
		let id = 0;
		if (e.target.matches('.shop-item-button')) {
			id = e.target.dataset.id;
			e.target.classList.add('inactive')
			e.target.innerHTML = '';
			e.target.innerHTML = `
				<div class="shop-item-button-cover"><div class="shop-item-button-cover-check-icon"></div></div>
			
			`

		} else {
			if (e.target.matches('.shop-item-button p')) {
				id = e.target.parentElement.dataset.id;
				let that = e.target.parentElement;
				that.classList.add('inactive')
				that.innerHTML = '';
				that.innerHTML = `
				<div class="shop-item-button-cover"><div class="shop-item-button-cover-check-icon"></div></div>
			
			`
			}
		}


		if (id > 0) {
			let cart = JSON.parse(localStorage.getItem('cart')) || [];
			let item = findOneShoseInData(parseInt(id));
			item.number = 1;
			cart.push(item);
			let cart_empty = document.querySelector('.cart-empty');
			if(cart_empty ){
				cart_empty.remove();
			}
			localStorage.setItem('cart', JSON.stringify(cart));
			renderItemCart(findOneShoseInData(parseInt(id)));

			calculateSumCart()
			console.log(cart.length)
			containerCart.querySelectorAll('.cart-item')[cart.length -1].classList.add('cart-list-enter-active')
			setTimeout(()=>{

				containerCart.querySelectorAll('.cart-item').forEach(item=>item.classList.remove('cart-list-enter-active'))
			},1000)
			
		}
	})

	const renderCartLoadPage = () => {
		let data = JSON.parse(localStorage.getItem('cart')) || [];
		if (data.length > 0) {
			data.forEach(item => {
				renderItemCart(item);
			})
			calculateSumCart()
		}else{
			containerCart.innerHTML = '<div class="cart-empty"><p class="cart-empty-text">Your cart is empty.</p></div>';
		}

	}

	const renderItemShoseLoadPage = (item, clicked = false) => {
		console.log(clicked);
		let ItemShoses = `
		<div class="shop-item">
			<div class="shop-item-image" style="background-color: ${item.color}">
				<img
					src="${item.image}"
					alt="">
			</div>
			<div class="shop-item-name">
				${item.name}
			</div>
			<div class="shop-item-description">
				${item.description}
			</div>
			<div class="shop-item-bottom">
				<div class="shop-item-price">
					$ ${item.price}
				</div>
				${clicked ? `<div data-id="${item.id}" class="shop-item-button inactive">
				<div class="shop-item-button-cover"><div class="shop-item-button-cover-check-icon"></div></div>
			</div>`: `<div data-id="${item.id}" class="shop-item-button ">
				<p >ADD TO CART</p>
			</div>`

			}
				
			</div>
		</div>
		
		`;

		containerShoses.insertAdjacentHTML('beforeend', ItemShoses);

	}
	const handleRenderShoseLoadPage = () => {
		let cart = JSON.parse(localStorage.getItem('cart')) || [];
		if (cart.length > 0) {
			for (let i = 0; i < shoses.length; i++) {
				let check = 0;
				for (let j = 0; j < cart?.length; j++) {
					if (shoses[i].id == cart[j].id) {
						check = 1;
						break;
					}
				}

				if (check == 1) {
					renderItemShoseLoadPage(shoses[i], true)
				} else {
					console.log('00000')
					renderItemShoseLoadPage(shoses[i])

				}
			}
		} else {

			shoses.forEach(item => {
				renderItemShoseLoadPage(item, false)

			})
		}
	}
	handleRenderShoseLoadPage()
	renderCartLoadPage();

	containerCart.addEventListener('click', function (e) {
		let cart = JSON.parse(localStorage.getItem('cart'));
		let cartNew = [];
		if (e.target.matches('.decre')) {
			let id = e.target.dataset.id;
			cart.forEach((item, index) => {
				if (item.id == +id) {
					if (item.number == 1) {
						e.target.parentElement.parentElement.parentElement.parentElement.remove();
					} else {

						e.target.nextElementSibling.textContent = +e.target.nextElementSibling.textContent - 1;
						item.number = +item.number - 1;

						cartNew.push(item);
					}
				} else {
					cartNew.push(item);

				}
			})

			localStorage.setItem('cart', JSON.stringify(cartNew));
			calculateSumCart()
			containerShoses.innerHTML = '';
			handleRenderShoseLoadPage()
			containerCart.innerHTML = '';
			renderCartLoadPage();

		}

		if (e.target.matches('.incre')) {

			let id = e.target.dataset.id;
			let cartNew = [];

			cart.forEach((item, index) => {
				if (item.id == +id) {
					item.number = +item.number + 1;
					e.target.previousElementSibling.textContent = +e.target.previousElementSibling.textContent + 1;
					cartNew.push(item)

				} else {
					cartNew.push(item)
				}
			})


			localStorage.setItem('cart', JSON.stringify(cartNew));
			calculateSumCart();
			containerCart.innerHTML = '';
			renderCartLoadPage();

		}

		if (e.target.matches('.cart-item-remove-icon')) {
			let id = e.target.dataset.id;
			cart.forEach((item, index) => {
				if (item.id == +id) {	
					console.log(e.target.parentElement.parentElement.parentElement.parentElement)
					e.target.parentElement.parentElement.parentElement.parentElement.classList.add('cart-list-leave-active');
					setTimeout(()=>{

						e.target.parentElement.parentElement.parentElement.parentElement.remove();
					},1000)
				} else {
					cartNew.push(item);

				}
			})

			localStorage.setItem('cart', JSON.stringify(cartNew));
			calculateSumCart()
			containerShoses.innerHTML = '';
			handleRenderShoseLoadPage();
			containerCart.innerHTML = '';
			renderCartLoadPage();
		}
	})
})