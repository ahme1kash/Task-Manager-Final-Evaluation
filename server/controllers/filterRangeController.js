const mongoose = require("mongoose");
const taskModel = require("../models/taskModel");
// All Queries for as per MONGO server Time which trails by GMT- 5:30
const filterController = async (req, res) => {
    try {
        const user_id = req.body.id;
        let filtered_tasks;
        let filter_period = req.query.filter;
        console.log(filter_period);
        // Below will filter for last 24 hours with respect to mongodb server time which generally trails by five hours thirty minutes (GMT: -05:30)with respect to IST.
        if (filter_period === "today") {
            let today_start = new Date()
            today_start.setHours(0, 0, 0, 0);
            let today_end = new Date()
            today_end.setHours(23, 59, 59, 999);

            // Can't query with only matching <createdAt: new Date()> because the new Date() contains milliseconds as per the query time by user which does not match with the createdAt time for today's task also because the milliseconds does not match in the document of mongo-collection, Therefore querying with hour range.
            filtered_tasks = await taskModel.find({
                user_id: user_id,
                createdAt: { $gt: today_start, $lte: today_end },
            });
            const filtered_count_today = await taskModel.countDocuments({
                user_id: user_id,
                createdAt: { $gt: today_start, $lte: today_end },
            })
            return res.status(200).send({
                success: true,
                message: "Filtered Tasks for today retrieved successfully",
                filtered_tasks,
                filtered_count_today
            });
        } else if (filter_period === "week") {
            let seven_days_back_date = new Date();
            seven_days_back_date.setDate(seven_days_back_date.getDate() - 7);
            filtered_tasks = await taskModel.find({
                user_id: user_id,
                createdAt: { $gt: seven_days_back_date, $lte: new Date() },
            });
            const filtered_count_week = await taskModel.countDocuments({
                user_id: user_id,
                createdAt: { $gt: seven_days_back_date, $lte: new Date() },
            })
            return res.status(200).send({
                success: true,
                message: "Filtered Tasks for a week retrieved successfully",
                filtered_tasks,
                filtered_count_week
            });
        } else if (filter_period === "month") {
            let thirty_days_back_date = new Date();
            thirty_days_back_date.setDate(thirty_days_back_date.getDate() - 30);
            filtered_tasks = await taskModel.find({
                user_id: user_id,
                createdAt: { $gt: thirty_days_back_date, $lte: new Date() },
            });
            const filtered_count_month = await taskModel.countDocuments({
                user_id: user_id,
                createdAt: { $gt: thirty_days_back_date, $lte: new Date() },
            })
            return res.status(200).send({
                success: true,
                message: "Filtered Tasks for a month retrieved successfully",
                filtered_tasks,
                filtered_count_month
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
};
module.exports = { filterController };
