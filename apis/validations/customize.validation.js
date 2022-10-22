const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid id format')
    }
    return value
}

const email = (value, helpers) => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
    {
        return helpers.message('Invalid email')
    }
    return value
}

const password = (value, helpers) => {
    if (value.length < 6) {
        return helpers.message('password must be at least 6 characters')
    }
    if (!value.match(/\d/) || !value.match(/[A-Z]/)) {
        return helpers.message('password must contain at least 1 uppercase letter and 1 number')
    }
    return value
}

module.exports = {
    objectId,
    email,
    password,
}
