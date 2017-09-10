var Flickr = require('flickr-sdk');
var Twitter = require('twitter');
var request = require('request').defaults({ encoding: null });

var flickr = new Flickr(process.env.Flickr_API);

var client = new Twitter({
  consumer_key: process.env.Twitter_Consumer_Key,
  consumer_secret: process.env.Twitter_Consumer_Secret,
  access_token_key: process.env.Twitter_Access_Token_Key,
  access_token_secret: process.env.Twitter_Access_Token_Secret
});

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomImage(photos, pages, imagesPerPage) {
   var randomPage = getRandomInt(1, pages);
   if (randomPage === pages) {
      var randomImage = getRandomInt(1, photos % imagesPerPage);
   } else {
      var randomImage = getRandomInt(1, 500);
   }

   var randomObj = {page:randomPage, image:randomImage};
   return randomObj;
}

function findLarge(size) { 
    return size.label === 'Large';
}

exports.myHandler = function(event, context, callback) {
var user = flickr.people.findByUsername({
   username: process.env.Flickr_Username
}).then(function (res) {
   var userid = res.body.user.id;
   var user = flickr.people.getInfo({
      user_id: userid
   }).then(function (res) {
      var numPhotos = res.body.person.photos.count._content;
      var numPages = Math.ceil(numPhotos / 500);
      var randomObj = getRandomImage(numPhotos, numPages, 500);

      console.log('number of photos: ' + numPhotos);
      console.log('number of pages: ' + numPages);
      var photos = flickr.people.getPhotos({
         user_id: userid,
         per_page: 500,
         page: randomObj.page
      }).then(function (res) {
         var imageURL = 'https://www.flickr.com/photos/rosecityriveters/' + res.body.photos.photo[randomObj.image].id;
         var imageSizes = flickr.photos.getSizes({
             photo_id: res.body.photos.photo[randomObj.image].id
         }).then(function (res) {
             var largeImage = res.body.sizes.size.find(findLarge);
             request(largeImage.source, function(err, response, buffer) {
                client.post('media/upload', {media: buffer}, function(error, media, response) {
                if (!error) {

                   // If successful, a media object will be returned.
                   console.log(media);

                   // Lets tweet it
                   var status = {
                      status: ' ',
                      media_ids: media.media_id_string // Pass the media id string
                   }

                   client.post('statuses/update', status, function(error, tweet, response) {
                   if (!error) {
                      console.log(tweet);
                   }
                   });

                } else {
                    console.log(error);
                }
                });
             });
         }).catch(function (err) {
             console.error('err', err);
         });
      }).catch(function (err) {
         console.error('err', err);
      });
   }).catch(function (err) {
      console.error('bonk', err);
   });     
}).catch(function (err) {
  console.error('bonk', err);
});
}