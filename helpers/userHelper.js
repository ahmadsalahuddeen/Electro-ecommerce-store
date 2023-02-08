const { render } = require("ejs");
const Order = require("../models/order");

const chnageOrderStatus = async (orderId, status) => {
  await Order.findByIdAndUpdate(orderId, {
    $set: {
      orderStat: status,
    },
  });
};

const dashboard = async (req, res) => {
  const orders = await Order.find({});
  let today = new Date();
  let todaySarting = new Date(today.setUTCHours(0, 0, 0, 0));
  let todayEnding = new Date(today.setUTCHours(23, 59, 59, 999));

  let todaySales = await Order.countDocuments({
    createdAt: { $gt: todaySarting, $lt: todayEnding },
    orderStat: { $eq: "Delivered" },
  });
  let totalSales = await Order.countDocuments({
    orderStat: { $eq: "Delivered" },
  });

  let todayRevenue = await Order.aggregate([
    {
      $match: {
        $and: [
          { createdAt: { $gt: todaySarting, $lt: todayEnding } },
          { orderStat: "Delivered" },
        ],
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        todayTotalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);
  let todayTotalRevenue = 0
  if (todayRevenue[0] == undefined || todayRevenue.length <= 0) {
    todayTotalRevenue = 0;
  } else {
    todayTotalRevenue = todayRevenue[0].todayTotalRevenue
  }
let totalRevenueEq = await Order.aggregate([
  {
    $match: {
     
        orderStat: "Delivered"
       
      
    }
  },
  {
    $group: {
      _id: null,
      total: {$sum: "$totalPrice"}
    }
  }
])
  
let totalRevenue = 0
  if (totalRevenueEq[0] == undefined || totalRevenueEq.length <= 0) {
    totalRevenue = 0;
  } else {
    totalRevenue = totalRevenueEq[0].total
  }

  //start of the month 
  let startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0,0,0,0)


  //end of the month
  let endOfMonth = new Date()
  endOfMonth.setMonth(endOfMonth.getMonth() +1);
  endOfMonth.setDate(0) ;
  endOfMonth.setHours(23, 59,59,999)  ;

let startOfYear = new Date()
startOfYear.setMonth(0)
startOfYear.setDate(1)


  let endOfYear =  new Date()
  endOfYear.setDate(31)
  endOfYear.setMonth(11);
  endOfYear.setHours(23,59,59,999) 


let yearlySales = await Order.aggregate([
  {$match:{
    $and:[
      {
        orderStat: "Delivered"
      },
      {
        createdAt:  {$gt: startOfYear, $lt: endOfYear}
      }
    ]
  }},
  {$group: {
    _id: {year: {$year: '$createdAt'}, month: {$month: '$createdAt'}},
    total: {$sum: 1}
  }},

  {
    $sort:{"_id.month": 1}
  }
])
let monthlyRevenue = await Order.aggregate([
  {$match:{
    $and:[
      {
        orderStat: "Delivered"
      },
      {
        createdAt:  {$gt: startOfYear, $lt: endOfYear}
      }
    ]
  }},
  {$group: {
    _id: {year: {$year: '$createdAt'}, month: {$month: '$createdAt'}},
    total: {$sum: "$totalPrice"}
  }},

  {
    $sort:{"_id.month": 1}
  }
])
let monthlySales = await Order.aggregate([
  {$match:{
    $and:[
      {
        orderStat: "Delivered"
      },
      {
        createdAt:  {$gt: startOfMonth, $lt: endOfMonth}
      }
    ]
  }},
  {$group: {
    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    count: { $sum: 1 }
  }},
  
  {
    $sort:{_id: 1}
  }
])


console.log("monthlyyyyyyyyyyyyyyyy", monthlySales);
res.render('adminhome', {
  admin: true,
  todaySales,
  monthlyRevenue,
  totalSales,
  todayTotalRevenue,
  totalRevenue,
  monthlySales,
  yearlySales

})


}


const dailyReport = async(req, res )=>{
  let salesReport = await Order.aggregate([
    {
      $match:{ orderStat: 'Delivered'}
  },
  {
    $group: {
      _id: {
        year: {$year: '$createdAt'},
        month: {$month: '$createdAt'},
        day: {$dayOfMonth: '$createdAt'}
      },

      totalPrice : {$sum: '$totalPrice'} ,
      items: {$sum: {$size: '$items'}},
      count: {$sum: 1}
    }
  },
  {$sort: {createdAt: -1}}
  ])
  res.render('dailyReport', {salesReport})
}
const weeklyReport = async(req, res )=>{
  let startOfYear = new Date()
startOfYear.setMonth(0)
startOfYear.setDate(1)


  let endOfYear =  new Date()
  endOfYear.setDate(31)
  endOfYear.setMonth(11);
  endOfYear.setHours(23,59,59,999) 
  
  let salesReport = await Order.aggregate([
    {
      $match:{

        $and:[
          {orderStat: "Delivered"},
          {createdAt: {$gt: startOfYear, $lt: endOfYear}}
        ]
    }
  },
  {
    $group: {
      _id: {$week: '$createdAt'},

      totalPrice : {$sum: '$totalPrice'} ,
      items: {$sum: {$size: '$items'}},
      count: {$sum: 1}
    }
  },
  {$sort: {createdAt: -1}}
  ])
  res.render('weeklyReport', {salesReport})
}
const yearlyReport = async(req, res )=>{
  let salesReport = await Order.aggregate([
    {
      $match:{

       orderStat: 'Delivered'
    }
  },
  {
    $group: {
      _id: {$year: '$createdAt'},

      totalPrice : {$sum: '$totalPrice'} ,
      items: {$sum: {$size: '$items'}},
      count: {$sum: 1}
    }
  },
  {$sort: {createdAt: -1}}
  ])

  res.render('yearlyReport', {salesReport})
}






module.exports = {

  yearlyReport,
  weeklyReport, 
  dailyReport,
  dashboard,
  chnageOrderStatus,
};
