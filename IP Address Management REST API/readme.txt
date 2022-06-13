


                 ~How to get started~

Running "IP Address Management REST API" on a dev server:
    1. Open a terminal inside the folder "IP Address Management REST API"
    2. Inside the terminal type: node .
       Note: by default the server will live on port 8020, This may have to be changed on line 19 in index.js if this ports in use.
    3. In the terminal, you should see "It's alive on http://localhost:8020"


                   ~HTTP Requests~

API End points:
    GET:
        ~ http://localhost:8020/iplist
        Returns all IP addresses in the system with their current status.

    POST:
        ~ http://localhost:8020/add
        Uses JSON sent via the body of the POST request.
        EX:
        {
            "cidrblock" : "10.0.0.1/24"
        }

        ~ http://localhost:8020/iplist/acquire
        Sets the status of a certain IP of a specific block to “acquired”
        EX:
        {
            "cidrblock" : "10.0.0.1/24",
		    "ip": "10.0.0.0"
        }

        ~ http://localhost:8020/iplist/release
        Sets the status of a certain IP to “available”
        EX:
        {
            "cidrblock" : "10.0.0.1/24",
		    "ip": "10.0.0.0"
        }
