let fs = require('fs');
var router = require('express').Router();
let moment = require('moment');
let _ = require('lodash');

var path = require('path');
let dbFile = path.join(__dirname, 'db.json');

//Get Wishlist
router.get('/retrieveWishlist', function(req, res) {
    fs.readFile(dbFile, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        let wishList = JSON.parse(data)

        wishList = _.filter(wishList, (item) => {
            return item.active;
        })

        res.json(wishList)
    });
});
//Add Item
router.post('/addWishItem', function(req, res) {
    fs.readFile(dbFile, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let wishList = JSON.parse(data);
        let newItem = {
            user_id: Number(req.body.user_id),
            id: Number(moment().format("x")),
            active: true,
            name: req.body.item.suggestion,
            image: req.body.item.image,
            url: req.body.item.url,
            rating: req.body.item.rating,
            reviews: req.body.item.reviews || 0,
            subTitle: req.body.item.subTitle,
            isPreorder: req.body.item.isPreorder,
            salePrice: req.body.item.salePrice,
            standardPrice: req.body.item.standardPrice,
        };
        wishList.push(newItem);
        fs.writeFile(dbFile, JSON.stringify(wishList, null, 4), function(err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            wishList = _.filter(wishList, (item) => {
                return item.active;
            })

            res.json(wishList)
        });
    });
});
//Delete Item
router.post('/removeWishItem', function(req, res) {
    fs.readFile(dbFile, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let wishList = JSON.parse(data);

        let indexToDelete = _.findIndex(wishList, function(wishItem) { 
            return wishItem.id === Number(req.body.id); 
        });
        console.log("wishList[indexToDelete]: ", wishList[indexToDelete])
        if (indexToDelete > -1) {
            wishList[indexToDelete].active = false;
        }

        console.log("wishList[indexToDelete]: ", wishList[indexToDelete])

        fs.writeFile(dbFile, JSON.stringify(wishList, null, 4), function(err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            wishList = _.filter(wishList, (item) => {
                return item.active;
            })

            res.json(wishList)
        });
    });
});

module.exports = router;