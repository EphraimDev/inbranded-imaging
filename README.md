# inbranded-imaging

#### To set up, run `npm install`

#### run `copy .env.example .env`

#### run `npm start`

## Endpoints
### POST `localhost:3000/api/upload`
##### request body
*image `file`*  
##### request query
*crop `cover, contain, fill, inside or outside` `optional`*  
*rotate `integer` `optional`*  
*resize `boolean` `optional`*  
*width `integer` `optional`*  
*height `integer` `optional`*  



### *POST* `localhost:3000/api/export`
##### request body
*type `string` `jpg, jpeg, png or pdf`*  
*file `string` `file id`*  

