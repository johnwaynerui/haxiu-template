module.exports = {
    "prompts": {
        "host": {
            "type": "string",
            "required": false,
            "message": "where is your project gonna deploy?"
        },
        "resourcePath": {
            "type": "string",
            "required": false,
            "message": "path to deploy resource"
        },
        "templatePath": {
            "type": "string",
            "required": false,
            "message": "path to deploy template"
        },
        // "tplPort": {
        //     "type": "string",
        //     "required": false,
        //     "message": "port to receive tpl"
        // },
        // "resourcePort": {
        //     "type": "string",
        //     "required": false,
        //     "message": "port to receive resource"
        // },
        "port": {
            "type": "string",
            "required": false,
            "message": "port to deploy"
        },
        "site": {
            "type": "string",
            "required": false,
            "message": "site to access your project(e.g: http://www.hao123.com)"
        }
    }
};