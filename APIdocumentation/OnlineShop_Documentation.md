BASE URL: http://localhost:3000

ENDPOINTS

Hämta menyn
GET /onlineshop/menu

Denna endpoint hämtar alla items som finns i menyn (som är i lager dvs in_stock = 1)

Svar:

200 OK - Returnerar en lista med items i menyn.
404 Not Found - Om inga items finns i menyn.

Exempel på 200 SVAR
"result": [
{
"title": "Kaffe",
"desc": "Ett uppfriskande och varmt kaffe som passar perfekt på morgonen.",
"price": 25
}
]

Lägga till i menyn
POST /onlineshop/menu

Body JSON obligatoriska fält
title, (string)
desc, (string)
price, (number)
in_stock, (boolean 1 OR 0)
is_cold, (boolean 1 OR 0)
category_id (number)

SVAR :

201 Created
400 Bad request:
All fields are required:

- Title & Description must be strings.
- Price & Category ID must be numbers.
- in_stock & is_cold must be either 0 or 1.`

För att ändra en eller flera saker i menyn men inte hela.
PATCH /menu/:id

Parameter:

ID obligatoriskt

BoDy JSON minst en av dessa är obligatoriska
title, (string)
desc, (string)
price, (number)
in_stock, (boolean 1 OR 0)
is_cold, (boolean 1 OR 0)
category_id (number)

SVAR
200 Ok -Item with ID succesfully updated.
400 Ogiltigt ID. Måste vara ett heltal.

För att ändra en hel item i menyn
PUT /onlineshop/menu/:id

Parameter:

ID obligatoriskt

BoDy JSON alla fält är obligatoriska
title, (string)
desc, (string)
price, (number)
in_stock, (boolean 1 OR 0)
is_cold, (boolean 1 OR 0)
category_id (number)

SVAR
200 OK - Ìtem with ID sucessfully updated
400 Bad Request - Ogiltigt ID. Måste vara ett heltal.
404 Not Found - Couldn't update item with ID

För att ta bort en item från menyn
DELETE /menu/:id

Parameter:

ID obligatoriskt

SVAR
204 No Content - Item i menyn har tagits bort.
400 Bad Request - Ogiltigt ID. Måste vara ett heltal.

Hämta alla kategorier eller alla items från en specifik kategori
GET /onlineshop/categories
Query parameter: kategori (valfri)
Exempel:
GET http://localhost:3000/onlineshop/categories?q=Kaffedrycker

SVAR med query
200 OK - hämtar en lista med alla items med valda kategorin
400 Bad Request - om ingen kategori matchar

SVAR utan query
200 OK - Hämtar alla olika kategorier.
404 Not Found - om ingen kategori finns.

För att lägga till en kategori
POST /onlineshop/categories

Body JSON Obligatoriska fält:
name (string)

SVAR:
201 Created - `name got succesffully added with ID -
400 Bad Request - Category name is required and cannot be empty or contain only spaces.

För att ändra en kategori
PATCH /onlineshop/categories/:id

Parameter:

ID obligatoriskt

Body JSON Obligatoriska fält:
name (string)

SVAR:
200 OK - Category with ID succesfully updated`
400 Bad Request - Ogiltigt ID. Måste vara ett heltal.
400 Bad Reqiest - Category name is required and cannot be empty or contain only spaces.

För att ta bort en kategori
DELETE /onlineshop/categories/:id

Parameter:

ID obligatoriskt
204 No Content - Kategori har tagits bort.
400 Bad Request - Ogiltigt ID. Måste vara ett heltal.
404 Not Found - No category with ID

För att hämta kalla drycker
GET /onlineshop/cold

SVAR:
200 OK - Hämtar alla kalla drycker från menyn
404 Not Found - No Cold drinks available.

För att hämta varma drycker
GET /onlineshop/hot

SVAR:
200 OK - Hämtar alla varma drycker från menyn
404 Not Found - No Hot drinks available.

För att titta i varukorgen.
POST /onlineshop/cart

Body JSON obligatorisk
user_id (string)

SVAR:
200 OK - Hämtar alla items i varukorgen
400 Bad Request - Valid user_id is required and must be a string.
404 - Not Found- No active orderes for ID.

För att lägga till i varukoren.
POST /onlineshop/cart/add

Body JSON obligatoriska fält

user_id (string)
items (array)
item_id (number)
quantity (number)

Exempel
{
"user_id": "8hPyKan5aXt2a5aGofoQb",
"items":
[
{"item_id":1,
"quantity": 2
}
]
}

SVAR:
201 Created - Order succesffully created, Order ID
400 Bad Request - Valid user_id is required and must be a string.
400 Bad Request - Missin item or items as an array

För att ändra i varukorgen

PATCH /onlineshop/cart/:orderId/:itemId

Parameter Obligatoriska fält:

orderId
itemId

Body JSON obligatoris fält
quantity (number)

SVAR OM quantity = 0
204 No Content - Item har blivit bortagen från varukorgen

SVAR:
200 OK - Updated Item ID, Quantity
400 Bad Request - Missing order id or item id
404 Not Found - Couldn't update quantity for item with ID

Ta bort en item från varukorgen

DELETE /onlineshop/cart/:itemId

SVAR:
204 No Content - bortagen från varukorgen
400 Bad Request - `Missing item id
404 Not Found - Couldnt Delete item from order with item ID

Slutföra köp
POST /onlineshop/checkout

Body JSON
user_id (obligatorisk, string)
userCoupon (valfri, rabattkupong - string)

SVAR:
200 OK - exempel utan kupong
{
"resultCheckout": [
{
"id": 1,
"title": "Espresso",
"quantity": 1,
"price": 30
}
],
"Totalcost": 30,
"Discount": "No Coupon used"
}
400 Bad Request - Valid user_id is required and must be a string
404 Not Found - No orders found for this user

Hämta information om leveransen.
POST /onlineshop/delivery

Body JSON obligatoriskt fält
user_id (string)

SVAR:
200 OK - Exempel på svar
{
"result": [
{
"title": "Espresso",
"quantity": 1,
"delivery": "2025-04-11 10:04:46",
"order_status": "Shipped"
}
]
}
400 Bad Request - Valid user_id is required and must be a string
404 Not Found - No orders with user ID, please visit Checkout
