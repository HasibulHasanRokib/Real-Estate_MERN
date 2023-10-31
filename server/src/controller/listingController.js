const listingModel = require("../model/listingModel");

const createListing = async (req, res, next) => {
    try {

        const newListing = await listingModel.create(req.body)
        res.status(201).json({ success: true, newListing })

    } catch (error) {
        console.log(error.message)
    }
}

const getListing = async (req, res, next) => {

    try {
        if (req.params.id === req.userId) {
            try {
                const listing = await listingModel.find({ userRef: req.params.id })
                res.status(200).json({ success: true, listing })
            } catch (error) {
                next(error)
            }
        } else {
            return res.status(400).json({ success: false, message: "You can only view your own listing" })
        }


    } catch (error) {
        console.log(error.message)
    }

}

const deleteListing = async (req, res, next) => {

    const listing = await listingModel.findById(req.params.id)

    if (!listing) {
        return res.status(400).json({ success: false, message: "Listing not found." })
    }

    if (req.userId !== listing.userRef) {
        return res.status(400).json({ success: false, message: "Con't delete listing." })
    }

    try {

        await listingModel.findByIdAndDelete(req.params.id)
        res.status(202).json({ success: true, message: "Your listing delete successful." })

    } catch (error) {
        next(error.message)
    }

}

const getUserListing = async (req, res) => {
    try {
        const getListing = await listingModel.findById(req.params.id)
        res.status(201).json({ success: true, getListing })
    } catch (error) {
        console.log(error.message)
    }

}

const updateListing = async (req, res, next) => {
    try {
        const listing = await listingModel.findById(req.params.id)

        if (!listing) {
            return res.status(400).json({ success: false, message: "Invalid listing id." })
        }
        if (req.userId !== listing.userRef) {
            return res.status(400).json({ success: false, message: "Update Failed." })
        }

        const updatedListing = await listingModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(202).json({ success: true, message: "Listing update successful.", updatedListing })

    } catch (error) {
        console.log(error.message)
    }
}

const getListings = async (req, res, next) => {
    
    try {

        const searchTerm = req.query.searchTerm || "";

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 9;

        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [true, false] }
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [true, false] }
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [true, false] }
        }

        let type = req.query.type;

        if (type === undefined || type === "all") {
            type = { $in: ["sell", "rent"] }
        }


        const searchRegExp = new RegExp('.*' + searchTerm + '.*','i')

        const filter = {
                name: { $regex: searchRegExp },
                type,
                offer,
                furnished,
                parking             
        }

        const listings = await listingModel.find(filter).limit(limit).skip((page - 1) * limit)

        const count = await listingModel.find(filter).countDocuments()

        if (!listings) {
            return res.status(400).json({ success: false, message: "No items found." })
        }

        res.status(200).json({
            success: true,
            message: "Listing were return.",
            listings,
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        })

    } catch (error) {
        console.log(error.message)
    }
}


module.exports = { getListings, createListing, getListing, deleteListing, getUserListing, updateListing }; 