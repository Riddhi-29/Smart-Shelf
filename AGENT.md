we have problem statement as below:
smart-shelf
kirana store inventory assistant

the real-world problem
small grocery (kirana) shop owners manually track hundreds of items with expiry dates, often missing near-expiry stock until it is too late. this leads to direct financial loss and avoidable waste every week.

provided mvp features (mandatory)
— a dashboard to add inventory items with name, quantity, and expiry date
— a low stock and near-expiry alert panel that highlights items needing attention.
— a backend database to save and persist all inventory data between sessions

ai integration hook
add an ai invoice parser: the shopkeeper pastes the raw text of a supplier invoice (messy, unformatted) and the system automatically reads it, extracts item names and quantities, and adds them to the inventory — no manual typing needed.

the innovation challenge
build a flash sale suggester: as an item approaches its expiry date, the ai automatically recommends a discount percentage to help the shopkeeper clear stock before it goes to waste.

we have to create a system as below:
follwing is my approch towarards this problem:

first module(shopkeeper) will give the input as a text, image (if the image is given by the shopkeeper then it will converted to the text first (exact text) full the accurancy)(what we can use to convert imge to text also tell me that cutstom model or any free api???)

once we get that text we have to use somethign nlp technique for the parsing,


and again we will have some raw data ( that will contain the all the relevent information related to this like monts data that will contain like jan feb march and number and all (for the implementation the semantic search*) even the shoopkeeer user enter any mistake in the data then it also correct it using the semantic search)


then we'll have an agent that will call the tools like the database(we'll use the postgrese here) to store the data. (that we will get from the sementic search)

we will store the data in the postgrese accordint to the schema.

and all the data will be displayed to the admin, he will get an alerts accordingly 
even if any item is going to near-expiry.


now you have to implement this entire system along the full description of the implementation in the readme.md file.



tech stack will be: react.js for the frontend and 
for the backend we will use the fastapi
and all as llm  we are gonna use the groq that we i've get from (https://console.groq.com/keys)

- note that you can make the innovation if necesarry)
and you dont install anything mention complete steps to install and start the project.
