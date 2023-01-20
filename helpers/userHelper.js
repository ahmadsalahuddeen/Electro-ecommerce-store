const Order = require('../models/order');

const chnageOrderStatus = async(orderId, status)=>{
await Order.findByIdAndUpdate(orderId, {
    $set: {
orderStat: status
    }
})
}

module.exports ={
    chnageOrderStatus
}