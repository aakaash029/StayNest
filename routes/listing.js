const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  uploadImage,
} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { cloudinary } = require("../cloudConfig.js");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    uploadImage,
    validateListing,
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);
//trending

router.get("/trending", wrapAsync(listingController.trendingListings));

router.get(
  "/category/:category",
  wrapAsync(listingController.categoryListings)
);

router.get("/search", wrapAsync(listingController.searchListings));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    uploadImage,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
  .get(wrapAsync(listingController.showListing));

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
