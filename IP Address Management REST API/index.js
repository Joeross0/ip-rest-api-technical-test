/*
Project:    IP Address Management REST API
Developer:  Joseph Ross 
Date:       6/10/2022
Purpose:    Create a simple IP Address Management REST API. this API can add IP Addresses by CIDR block and then either acquire or release IP addresses individually. 
            Each IP address will have a status associated with it that is either “available” or “acquired”.
*/

//TODO: use https://www.npmjs.com/package/cidr-js

var fs = require("fs");
const express = require('express');
const { body, validationResult } = require('express-validator');
const { json } = require("express/lib/response");
const IPCIDR = require("ip-cidr");
const e = require("express");
const BigInteger = require("jsbn").BigInteger;

const app = require('express')();
const PORT = 8020;


// ~adding expressing to Node.js project~
app.use( express.json() )

// ~Initilize database~
function InitServer(){
    fs.readFile("iplist.json", 'utf8', (err, data) => {
        if (err) {
            //Attempting to create empty json file if none exists or can be reached in expected directory.
            fs.writeFile("iplist.json", JSON.stringify(jsonData), (err) => {
                // Error checking
                if (err) throw err;
                console.log("New data added");
            });
          throw err;
        }
    })
    console.log(`It's alive on http://localhost:${PORT}`)
}
// ~List IP Addresses~
app.get('/iplist', (req, res) => {
    //Read File
    fs.readFile("iplist.json", 'utf8', (err, data) => {
        //Error Check
        if (err) {
          throw err;
        }

        //Parse from Json
        let jsonData = JSON.parse(data);
        
        //Parse 
        res.end( JSON.stringify(jsonData) );
    })
})

//Check if block exists
function BlockExists(jsonData, selectedCidrblock){
    let blockExists = false;
    Object.keys(jsonData).forEach(key => {
        if(key == selectedCidrblock)
        {
            //console.log(selectedCidrblock + " exists!");
            blockExists = true;
        }
    });
    return blockExists
}

//Save Data
function SaveData(jsonData){
    fs.writeFile("iplist.json", JSON.stringify(jsonData), (err) => {
        // Error checking
        if (err) throw err;
    });
}


// ~Create IP addresses~
app.post('/iplist/add', (req, res) =>{
    
    const cidrblock = req.body.cidrblock;

    //Validate
    if(IPCIDR.isValidAddress(cidrblock)){
        //Read Json File
        fs.readFile("iplist.json", 'utf8', (err, data) => {

            //Error Check
            if (err) {
            throw err;
            }

            //Parse from Json
            var jsonData = JSON.parse(data);
            
            //Duplicate Check
            let blockExists = !(BlockExists(jsonData, cidrblock));

            if(blockExists){
                //Create New json object for CIDR IP
                const cidr = new IPCIDR(cidrblock); 
                let ipObjectList = cidr.toArray({ type: "addressObject" });
                let ipList = [];
                ipObjectList.forEach(obj => {
                    ipList.push(obj.address);
                }) 

                
                //Write json
                let cidrBlockObject = []
                
                let itterations = 0;
                ipList.forEach(ip =>{
                    itterations++;
                    let ipGroup = {
                        "ip" : ip,
                        "status" : "available"
                    };
                    cidrBlockObject.push(ipGroup);
                })

                //Append Data to Json Object
                jsonData[cidrblock] = cidrBlockObject;
                
                //Write back to file
                SaveData(jsonData);
                console.log("New data added: " + cidrblock);

                //Parse and send back
                res.end( JSON.stringify(jsonData) );
            }
            else{
                res.send(cidrblock + " is already in the database")
            }
        })
    }
    else
    {
        res.send( "Invalid Input: " + cidrblock );
    }
})

function GetIPID(jsonData, selectedIP, selectedCidrblock){
    let ipID = 0;
    for (let i = 0; i < jsonData[selectedCidrblock].length; i++) {
        if(selectedIP == jsonData[selectedCidrblock][i].ip){
            break;
        }
        ipID++;
    }
    return ipID
}


// ~Aquire an IP~
app.post('/iplist/acquire', (req, res) =>{

    const selectedCidrblock = req.body.cidrblock;
    const selectedIP = req.body.ip;
    
    //Validate
    if(IPCIDR.isValidAddress(selectedCidrblock) && IPCIDR.isValidAddress(selectedIP)){
        //Read Json File
        fs.readFile("iplist.json", 'utf8', (err, data) => {
            //Error Check
            if (err) {
            throw err;
            }

            //Parse from Json
            var jsonData = JSON.parse(data);
            
            //Find the location of the ip in the CIDR block ip list
            let ipID = GetIPID(jsonData, selectedIP, selectedCidrblock)

            //Check if Block Exists
            let blockExists = BlockExists(jsonData, selectedCidrblock);
            
            if(blockExists){
                //Already Aquired Check
                if(jsonData[selectedCidrblock][ipID].status == "acquired"){
                    res.send(selectedCidrblock + " at " + selectedIP + " is already aquired!")
                }
                else{
                    //Append Data to Json Object
                    jsonData[selectedCidrblock][ipID].status = "acquired";
                    
                    //Write back to file
                    SaveData(jsonData);
                    console.log(selectedCidrblock + " at " + selectedIP + " is now aquired!");
                    
                    //Parse and send back
                    res.end( JSON.stringify(jsonData) );
                }
            }
            else{

                res.send(selectedCidrblock + " at " + selectedIP + " does not exist!")
            }
        })
    }
    else{
        res.send( "Invalid Input: " + selectedCidrblock + " or " + selectedIP);
    }

    
})

// ~Release an IP~
app.post('/iplist/release', (req, res) =>{
    
    const selectedCidrblock = req.body.cidrblock;
    const selectedIP = req.body.ip;

    //Validate Input
    if(IPCIDR.isValidAddress(selectedCidrblock) && IPCIDR.isValidAddress(selectedIP))
    {
        //Read Json File
        fs.readFile("iplist.json", 'utf8', (err, data) => {
            //Error Check
            if (err) {
            throw err;
            }

            //Parse from Json
            var jsonData = JSON.parse(data);
            
            //Find the location of the ip in the CIDR block ip list
            let ipID = GetIPID(jsonData, selectedIP, selectedCidrblock)

            //Check if Block Exists
            let blockExists = BlockExists(jsonData, selectedCidrblock);
            
            if(blockExists){
                //Already Aquired Check
                if(jsonData[selectedCidrblock][ipID].status == "available"){
                    res.send(selectedCidrblock + " at " + selectedIP + " is already available!")
                }
                else{
                    //Append Data to Json Object
                    jsonData[selectedCidrblock][ipID].status = "available";
                    
                    //Write back to file
                    SaveData(jsonData);
                    console.log(selectedCidrblock + " at " + selectedIP + " is now available!")
                    
                    //Parse and send back
                    res.end( JSON.stringify(jsonData) );
                }
            }
            else{
                res.send(selectedCidrblock + " at " + selectedIP + " does not exist!")
            }
            
            
            
        })
    }
    else{
        res.send( "Invalid Input: " + selectedCidrblock + " or " + selectedIP);
    }

    
})

// ~Starting Server~
var server = app.listen(
    PORT,
    () => InitServer()
    
)

