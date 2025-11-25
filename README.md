# Typescript-Test
Learning-tests

# Express + TypeScript API

A simple Express + TypeScript API project for managing carts.

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

---

## Installation

**Clone the repository**
git clone https://github.com/AjeetR/Typescript-Test.git
cd <your-repo-folder>

npm install

## Running the Server
## Start the server with:

npm start
## The server will run on http://localhost:3000 by default.

## Authentication
## JWT sign-in is not yet implemented.

To access protected routes, use the following Bearer token:

Authorization: Bearer abc123xyz
Replace abc123xyz with a valid JWT once authentication is implemented.

API Endpoints
Cart        Routes (/cart)
Method	    Endpoint	    Description
POST	    /cart	        Create a new cart
GET	        /cart/:id	    Get cart by ID
PUT	        /cart/:id	    Update cart by ID
DELETE	    /cart/:id	    Delete cart by ID


Examples
## POST
http://localhost/cart
body : {
  "cartId": "cart-005",
  "userId": "user-202",
  "items": [
    {
      "itemId": "ci-458",
      "productId": "plan-125",
      "qty": 1,
      "unitPrice": 39.99,
      "metadata": {
        "color": "red",
        "size": "M"
      }
    }
  ]
}

## GET
http://localhost/cart/cart-002

## PUT
http://localhost/cart/cart-002
body : {
  "items": [
    {
      "itemId": "ci-456",
      "productId": "plan-123",
      "qty": 3,
      "unitPrice": 29.99,
      "metadata": {
        "giftWrap": true
      }
    },
    {
      "itemId": "ci-459",
      "productId": "plan-126",
      "qty": 1,
      "unitPrice": 49.99,
      "metadata": {}
    }
  ]
}


## DELETE
http://localhost/cart/cart-005