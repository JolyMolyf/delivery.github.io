

'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');


const cart = [];
const getData = async function(url) {

 const response = await fetch(url);
 if (!response.ok) {
   throw new Error(`оiибки по адресу ${url},
    статeс ошибкa ${response.status}!`);
 }

return await response.json()

};



const toggleModal = function() {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = function() {
  modalAuth.classList.toggle('is-open');
};

function authorized() {
function logOut() {
  login = null;
  localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
  userName.style.display = '';
  buttonOut.style.display = '';
   cartButton.style.display = '';
  checkAuth();
}

  console.log ('Авторизован');
userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
 cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut)
}

function notAuthorized() {
  console.log ('Не авторизован');

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
localStorage.setItem('gloDelivery', login);

   toggleModalAuth();
   loginForm.reset();
   checkAuth();
    
  
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth); 
  logInForm.addEventListener('submit', logIn);
  
}

function checkAuth() {
  if (login) {
  authorized();
} else {
  notAuthorized();
}

}

function createCardRestaurant({image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery }) {



const card = `
	<a  class="card card-restaurant" data-products="${products}">
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery}</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>
`;

cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood(goods) {


const{ description, id, image, name, price } = goods;

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
            <img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
const target = event.target;

const restaurant = target.closest('.card-restaurant');
if (restaurant) {

//   console.log(restaurant.dataset.products);

cardsMenu.textContent = '';
containerPromo.classList.add('hide');
restaurants.classList.add('hide');
menu.classList.remove('hide');
getData(`./db/${restaurant.dataset.products}`).then(function(data){
  data.forEach(createCardGood);
});




  

}

function addToCart(event) {
const target = event.target;
console.log(target);

}

}

function init() {
  getData('./db/partners.json').then(function(data){
  data.forEach(createCardRestaurant)
});

cartButton.addEventListener("click", toggleModal);

cardsMenu.addEventListener("click", addToCart);

close.addEventListener("click", toggleModal);


cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function() {
  containerPromo.classList.remove('hide')
restaurants.classList.remove('hide')
menu.classList.add('hide')
})


checkAuth();
}

init();
