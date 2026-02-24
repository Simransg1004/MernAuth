import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"

// @desc       Register a new User
// @route      POST api/users
// @access     Public
const registerUser = asyncHandler( async (req, res) => {

    const { name, email, password } = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please add all the fields")
    }
    
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email, 
        password
    })

    if(user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error("Invaid user data")
    }

})

// @desc       Auth User/Set token
// @route      POST api/users/auth
// @access     Public
const authUser = asyncHandler( async (req, res) => {

    const { email, password } =  req.body
    if(!email || !password) {
        res.status(400)
        throw new Error("Please enter all the fields")
    }

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id)
        res.status(201).json({
            name: user.name,
            email: user.email,
            password: user.password
        })
    }else {
        res.status(401)
        throw new Error("Invalid email or password")
    }

})

// @desc       Logout User
// @route      POST api/users/logout
// @access     Private
const logoutUser = asyncHandler( async (req, res) => {

    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({message: "User logged out"})
})

// @desc       Get User Profile
// @route      GET api/users/profile
// @access     Private
const getUserProfile = asyncHandler( async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json(user)
})

// @desc       Update User Profile
// @route      PUT api/users/profile
// @access     Private
const updateUserProfile = asyncHandler( async (req, res) => {

    const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: req.body },
            { new: true, runValidators: true } // Options: return new doc, run schema validators
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

         const user = await updatedUser.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });


})

export { 
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}