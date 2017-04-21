/**
 * Created by Waruna on 4/20/2017.
 */

// Defining our token parts




var secret = "My very confidential secret!!!";

function base64url(source) {
    // Encode in classical base64
    encodedSource = CryptoJS.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}

function getJsonWebToken(config) {
    var header = {
        "alg": "HS256",
        "typ": "JWT"
    };
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);

    /*------------------------*/

    var data = {
        session_id: config.session_id,
        iss: config.name,
        iat: Date(),
        company: config.company,
        tenant: config.tenant,
        contact: config.address,
        channel: 'webchat',
        jti: config.name,
        attributes: ["60"],
        priority: "0",
        name: config.name
    };

    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);

    /*---------------------*/
    var signature = encodedHeader + "." + encodedData;
    signature = CryptoJS.HmacSHA256(signature, secret);
    signature = base64url(signature);

    return encodedHeader+"."+encodedData+"."+signature;
}
