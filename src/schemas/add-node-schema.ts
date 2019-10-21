export default {
    type: "object",
    properties: {
        parentNode: {
            type: "string",
            minLength: 3,
            maxLength: 20
        },
        childNode: {
            type: "string",
            minLength: 3,
            maxLength: 20
        }
    },
    required: ["parentNode", "childNode"]
};
