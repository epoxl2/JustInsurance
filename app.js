var express = require('express');
var mongoose= require('mongoose');
var ejs = require('ejs')
var flash = require('connect-flash')
var passport = require('passport');

var models = require('./server/business/crud/model/model')(mongoose);

var api = require('./server/appapi')(express, ejs, flash,passport, models);
var web = require('./client/appweb')(express, ejs, flash,passport, models);





