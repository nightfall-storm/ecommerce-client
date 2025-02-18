Here's a markdown representation of your database structure based on your models:
Database Structure
Client
ID (int, Primary Key)
Nom (string, Required)
Prenom (string, Required)
Email (string, Required, EmailAddress)
MotDePasse (string, Required)
Adresse (string)
Telephone (string)
Has many Orders
Product
ID (int, Primary Key)
Nom (string, Required)
Description (string)
Prix (decimal(18,2), Required)
Stock (int, Required)
ImageURL (string)
CategorieID (int)
Has many OrderDetails
Order
ID (int, Primary Key)
ClientID (int, Required, Foreign Key)
DateCommande (DateTime, Required)
Statut (string, Required)
Total (decimal(18,2), Required)
Belongs to Client
Has many OrderDetails
OrderDetail
ID (int, Primary Key)
CommandeID (int, Required, Foreign Key)
ProduitID (int, Required, Foreign Key)
Quantite (int, Required)
PrixUnitaire (decimal(18,2), Required)
Belongs to Order
Belongs to Product
Relationships
A Client can have multiple Orders
An Order belongs to one Client
An Order can have multiple OrderDetails
A Product can be in multiple OrderDetails
An OrderDetail belongs to one Order and one Product
All decimal values use a precision of 18 digits with 2 decimal places (decimal(18,2)).