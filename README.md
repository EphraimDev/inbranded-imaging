# inbranded-imaging

#### To set up, run `npm install`

#### run `copy .env.example .env`

## Endpoints
### POST `localhost:3000/upload`
##### request body
*image `file`*  
##### request query
*crop `cover, contain, fill, inside or outside` `optional`*  
*rotate `integer` `optional`*  
*resize `boolean` `optional`*  
*width `integer` `optional`*  
*height `integer` `optional`*  



### *POST* `localhost:3000/export`
##### request body
*type `string` `jpg, jpeg, png or pdf`*  
*file `string` `file id`*  

