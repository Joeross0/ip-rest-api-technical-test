# IP Address Management REST API Requirements
 
Create a simple IP Address Management REST API using any technology on top of any data store. It will include the ability to add IP Addresses by CIDR block and then either acquire or release IP addresses individually. Each IP address will have a status associated with it that is either “available” or “acquired”. 
 
The REST API must support four endpoint:
  * **Create IP addresses** - take in a CIDR block (e.g. 10.0.0.1/24) and add all IP addresses within that block to the data store with status “available”
  * **List IP addresses** - return all IP addresses in the system with their current status
  * **Acquire an IP** - set the status of a certain IP to “acquired”
  * **Release an IP** - set the status of a certain IP to “available”

Please include brief instructions about how to get your REST API project running on a development machine.

Please also include example HTTP requests that could be ran against your API. Postman Collection, Swagger documentation or similar are acceptable.
