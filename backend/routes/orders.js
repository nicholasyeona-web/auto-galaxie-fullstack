
const express = require("express");                          // 网站服务器的工具箱
const Order = require("../models/Order");                    // "订单本"：用来在 MongoDB 里读写订单
const asyncHandler = require("../utils/asyncHandler");       // 安全网：某处出错时，不会让整个服务器崩溃
const requireAdmin = require("../utils/requireAdmin");       // 守门员：只让管理员（admin）通过

// Router 就像菜单里的一个小章节：把相关的网址放在一起。
// index.js 会把这一组挂在 "/api/orders" 下面，
// 所以下面写的每个路径，实际上都是 "/api/orders" + 这里写的路径。
const router = express.Router();


router.get("/mine/:owner", asyncHandler(async (req, res) => {
   
    const orders = await Order.find({ owner: req.params.owner }).sort({ createdAt: -1 });

    // 把结果以 JSON（纯数据）的形式送回浏览器。
    res.json(orders);
}));


router.get("/", requireAdmin, asyncHandler(async (req, res) => {
    // checks admin permission
    const orders = await Order.find().sort({ createdAt: -1 });//places the newest orders first
    //retrieves all order records
    res.json(orders);
    //returns the records to the dashboard
}));
//-> Admin.jsx

// 把这一组完成的网址交给 index.js，让它接上去使用。
module.exports = router;
//-> Admin.jsx