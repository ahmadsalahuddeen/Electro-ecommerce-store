const { render } = require('ejs');
const Order = require('../models/order');

const chnageOrderStatus = async(orderId, status)=>{
await Order.findByIdAndUpdate(orderId, {
    $set: {
orderStat: status
    }
})
}

const dashboard =  async(req, res)   =>{
const orders = await Order.find({})
let today = new Date()
let todaySarting = new Date(today.setUTCHours(0,0,0,0,))
let todayEnding = new Date(today.setUTCHours(23,59, 59, 999))

let todaysales = await Order.countDocuments({
  createdAt: {$gt: todaySarting, $lt: todayEnding},
  orderStat: {$eq: "Delivered"}
})
let totalSales = await Order.countDocuments({
    orderStat:{$eq: "Delivered"}
})

console.log(totalSales);


}



module.exports ={
    dashboard,
    chnageOrderStatus
}