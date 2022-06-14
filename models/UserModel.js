const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        text: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        text: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        text: true
    },
    password: {
        type: String
    },
    phone: {
        type: Number,
        trim: true
    },
    userId: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date
    },
    createdBy: {
        type: String,
        trim: true
    },
    modifiedOn: {
        type: Date
    },
    modifiedBy: {
        type: String,
        trim: true
    },
    passwordLastSet: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    roles: {
        primaryRole: {
            role: {
                type: String,
                trim: true
            }
        },
        extraRoles: [{
            role: {
                type: String,
                trim: true
            }
        }]
    },
    customSettings: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    return bcrypt.genSalt(saltRounds, function (error, salt) {
        if (error) {
            return next(error);
        }

        return bcrypt.hash(this.password, salt, function (error, hash) {
            if (error) {
                return next(error);
            }
            this.password = hash;
            return next();
        });
    });
});


UserSchema.methods.comparePassword = function (userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err, false);
        }
        return cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);