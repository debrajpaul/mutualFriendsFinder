export default {
    type: "object",
    properties: {
        friendOne: {
            type: "string",
            minLength: 3,
            maxLength: 20
        },
        friendTwo: {
            type: "string",
            minLength: 3,
            maxLength: 20
        }
    },
    required: ["friendOne", "friendTwo"]
};
