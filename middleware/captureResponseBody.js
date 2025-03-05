const captureResponseBody = (req, res, next) => {
    let chunks = [];

    const originalWrite = res.write;
    const originalEnd = res.end;

    res.write = function (chunk, ...args) {
        chunks.push(Buffer.from(chunk));
        originalWrite.apply(res, [chunk, ...args]);
    };

    res.end = function (chunk, ...args) {
        if (chunk) chunks.push(Buffer.from(chunk));
        const body = Buffer.concat(chunks).toString();

        console.log(`[Response Body] ${req.method} ${req.originalUrl}`, tryParseJSON(body) ?? body);

        originalEnd.apply(res, [chunk, ...args]);
    };

    next();
};

function tryParseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
}

module.exports = captureResponseBody;