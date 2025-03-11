const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv')
const {closeDB, connectDB} = require('./db/mongo')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const loggerMiddleware = require('./middleware/captureResponseBody')
const cors = require('cors')

dotenv.config();

const indexRouter = require('./routes/index');
const recipeRouter = require('./routes/recipes');

const app = express();
const port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
logger.token("req-body", req => JSON.stringify(req.body))
app.use(logger(':method :url :status :response-time ms - req_payload :req-body'));
app.use(loggerMiddleware)
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router setup
app.use('/', indexRouter);
app.use('/recipes', recipeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(port, async () => {
    console.log(`Server listening on port ${port}`)
    await connectDB().catch(error => {
        console.log(error.message)
        process.exit(0)
    });
})

process.on("SIGINT", async () => {
    await closeDB();
    server.close(() => {
        console.log('Server closed')
        process.exit(0)
    })
})

module.exports = app;
