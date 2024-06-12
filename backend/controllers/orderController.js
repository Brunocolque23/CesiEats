import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing User Order for Frontend
const placeOrder = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        console.log(req.body.userId);
        console.log(req.body.amount);
        console.log(req.body.amount);
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
              currency: "eur",
              product_data: {
                name: item.name
              },
              unit_amount: item.price*100
            },
            quantity: item.quantity
          }))

        line_items.push({
            price_data:{
                currency:"eur",
                product_data:{
                    name:"Delivery Charge"
                },
                unit_amount: 5*100
            },
            quantity:1
        })
        
          const session = await stripe.checkout.sessions.create({
            success_url: `http://localhost:5173/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `http://localhost:5173/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
          });
      
          res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const restaurantName = req.query.restaurantname;
        let orders;

        if (restaurantName) {
            orders = await orderModel.find({ 'items.restaurant': restaurantName });
        } else {
            orders = await orderModel.find({});
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const listOrders2 = async (req, res) => {
    try {
        const restaurantName = req.query.restaurantname;
        let orders;

        if (restaurantName) {
            orders = await orderModel.find({ status: "Waiting Accept", 'items.restaurant': restaurantName });
        } else {
            orders = await orderModel.find({ status: "Waiting Accept" });
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}


const listOrders3 = async (req, res) => {
    try {
        const orders = await orderModel.find({ $or: [{ status: "Waiting for Livreur" }, { status: "Food Processing2" }, { status: "On our way" }] });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}


// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const {orderId , success} = req.body;
    try {
        if (success==="true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
				
														
															  
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }
  

}

const listOrderStates = async (req, res) => {
    try {
        const orderStates = await orderModel.distinct("address.state");
        res.json({ success: true, data: orderStates });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const receiveOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
      // Actualiza el estado del pedido
      await orderModel.findByIdAndUpdate(orderId, { status: 'In process to the client destination' });
      res.json({ success: true, message: 'Order received successfully' });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Error receiving order' });
    }
  };

export { placeOrder, listOrders, listOrders2, listOrders3, userOrders, updateStatus ,verifyOrder, listOrderStates, receiveOrder }