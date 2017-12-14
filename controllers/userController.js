var User = require('../models/user.js');
var async = require('async');
var moment = require('moment');
var crypto = require('crypto');
var csv = require('express-csv');
var fs = require('fs');


module.exports = {

    createUser: function (req, res, next) {


        /*Verify if user already exist but was deleted*/
        User.findOne({email: req.body.email, active: false}, function (err, user) {
            if (err) {
                console.log('Error verificando si el usuario existe');
            }
            if (user) {
                user.active = true;
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                //mailer.welcome(user);
                return res.status(200).json({
                    error: false,
                    users: user,
                    message: "La cuenta ha sido reactivada"
                });
            }
            else {

                if (req.files) {

                    var fileName = req.files.image.name;
                    var filePath = './uploads/' + fileName;
                    file.mv(filePath, function (err) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send(err);
                        }
                    });

                    var upload = true;
                    var folder = 'profile_pictures/';
                    fileName = fileName.replace(/[^a-zA-Z0-9.]/g, "");
                    //upload = s3deploy.uploadFiles(filePath, fileName, req.body.document, file.data, folder);

                    if (!upload)
                        return res.status(404).json({message: 'Error uploading file!'});

                    // url stored in db
                    // var imagenUrl = AWS_PREFIX + folder + req.body.document + '/' + fileName;
                    //local file deleted
                    //fs.unlinkSync(filePath);
                }
                else {
                    //var imagenUrl = AWS_PREFIX + 'foto.png';
                }


                var pswd = req.body.document;
                var pswd_conf = req.body.document;

                if (pswd == pswd_conf) {

                    var user = new User({

                        name: req.body.name,
                        profile_picture: filePath,
                        email: req.body.email,
                        password: req.body.document,
                        location: req.body.location,
                        doc: {
                            typedoc: req.body.doctype,
                            number: req.body.document
                        },
                        role: req.body.role

                    });

                    user.save(function (err, u) {
                        if (!err) {
                            //req.user = user;
                            //mailer.welcome(user);
                            return res.status(200).json({error: false, user: u, message: "El usuario ha sido creado"});
                        } else {
                            console.log('ERROR: ' + err);
                            return res.status(409).json({message: 'Error, no se pudo guardar el usuario'});
                        }
                    });
                } else {
                    return res.status(400).json({message: 'Las contraseñas no coinciden'});
                }

            }
        });


    },


};


