const express=require("express");
const { createListing,getListings, getListing,deleteListing,getUserListing,updateListing } = require("../controller/listingController");
const isLoggedIn = require("../middleware/isLoggedIn");
const listingRouter=express.Router();

listingRouter.post("/create-listing",isLoggedIn,createListing)
listingRouter.get("/show-listing/:id",isLoggedIn,getListing)
listingRouter.delete("/listing-delete/:id",isLoggedIn,deleteListing)
listingRouter.post("/listing-update/:id",isLoggedIn,updateListing)
listingRouter.get("/get/:id",getUserListing)
listingRouter.get("/get-listing",getListings)

module.exports=listingRouter;