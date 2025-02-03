import express from 'express'
//THIS IS JUST AN EXTERNAL ROUTE I USED TO TEST HOW TO SET UP ROUTES FROM OTHER FILES..
const router = express.Router()

const users=[{
    name:"Abel",
    age:30
}
,{
    name:"Mahi",
    age:21
}]

router.get('/',(req,res)=>{
   res.send(users)
})

export default router