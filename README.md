# CHFD Exercises

## Client

 - [x] Prepare Connection Profile

 - [x] Prepare Connection Options

 - [x] Instantiate FabricCAService
 
    - [x] Register New User
    
    - [x] Enroll New User
    
    - [x] Import New User To Wallet

 - [x] Instantiate Gateway
 
     - [x] Get Network     
     
     - [x] Get Contract

 - [x] Register Channel Event

 - [x] Query Contract
    
    - [x] Query Directly
    
    - [x] Query With Transaction
    
    - [x] Query Without Access Control    
    
    - [x] Query With Simple Query
    
    - [x] Query With Complex Query
    
    - [x] Query Private Data

 - [x] Invoke Contract
        
    - [x] Invoke Directly
    
    - [x] Invoke With Transaction    
    
    - [x] Invoke With Access Control
    
    - [x] Invoke Put Private Data

 - [x] Query Transactions In Block
 
## Chaincodes

 - [x] Define Contract With ChaincodeInterface
    
    - [x] Validate & Sanitize Inputs & Arguments
 
 - [x] Define Contract With Contract Class
 
 - [x] Define Transaction Functions
 
 - [x] State Interaction
 
    - [x] GetState
    
    - [x] PutState
    
    - [ ] DeleteState
 
 - [x] Handle Query Return Iterator
    
 - [ ] Query State With Composite Key
 
    - [ ] getHistoryForKey
    
    - [x] getStateByPartialCompositeKey
    
    - [x] getStateByPartialCompositeKeyWithPagination
    
    - [ ] getStateByRange
    
    - [ ] getStateByRangeWithPagination
 
 - [ ] Query State With CouchDB Complex Query
    
    - [x] getStateByQuery
    
    - [x] getStateByQueryWithPagination
 
 - [x] Use Private Data
    
    - [x] getPrivateData
    
    - [ ] getPrivateDataByPartialCompositeKey
    
    - [ ] getPrivateDataByRange
    
    - [x] putPrivateData
    
    - [ ] deletePrivateData

 - [x] Use ClientIdentity.assertAttributeValue To Implement Access Control

## cli

 - [x] Install Chaincode
 
    - [x] With Private Data
 
 - [x] Instantiate Chaincode
 
 - [x] Upgrade Chaincode
 
 - [x] Query Chaincode
 
 - [x] Invoke Chaincode