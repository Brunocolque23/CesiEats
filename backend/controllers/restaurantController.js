import restaurantModel from "../models/restaurantModel.js";
import fs from 'fs'

// all restaurant list
const listrestaurant = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({})
        res.json({ success: true, data: restaurants })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const updaterestaurant = async (req, res) => {
    const { id, name, localisation, phone, email, password } = req.body;

    try {
        const restaurant = await restaurantModel.findById(id);

        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }

        restaurant.name = name || restaurant.name;
        restaurant.localisation = localisation || restaurant.localisation;
        restaurant.phone = phone || restaurant.phone;
        restaurant.email = email || restaurant.email;
        restaurant.password = password || restaurant.password;

        await restaurant.save();
        res.json({ success: true, message: "Restaurant Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
// add food
const addrestaurant = async (req, res) => {

    const {name, localisation, phone,email,password} = req.body;

    const restaurant = new restaurantModel({
        name: req.body.name,
        localisation: req.body.localisation,
        phone: req.body.phone,
        email:req.body.email,
        password: req.body.password,
    })
    try {
        await restaurant.save();
        res.json({ success: true, message: "restaurant Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete restaurant
const removerestaurant = async (req, res) => {
    try {

        await restaurantModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "restaurant Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

export { listrestaurant, addrestaurant, removerestaurant,updaterestaurant }