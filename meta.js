module.exports = {
    "prompts": {
        "host": {
            "type": "string",
            "required": false,
            "message": "where is your project gonna deploy?"
        },
        "tplPort": {
            "type": "string",
            "required": false,
            "message": "port to receive tpl"
        },
        "resourcePort": {
            "type": "string",
            "required": false,
            "message": "port to receive resource"
        },
        "site": {
            "type": "string",
            "required": false,
            "message": "site to access your project(e.g: http://www.hao123.com)"
        }
    }
};