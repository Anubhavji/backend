import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    //validation
    // check if user already exists - username/email
    //check avatar or images
    //upload to cloudinary - avatar
    // create user object
    //remove password and refresh token field from response
    // check for user creation
    //return res


    const { fullname, email, username, password } = req.body
    console.log("email : ", email);

    // check all field are empty or not
    if (fullname === "") {
        throw new apiError(400, "FULLNAME is required")
    }
    if (email === "") {
        throw new apiError(400, "EMAIL is required")
    }
    if (username === "") {
        throw new apiError(400, "USERNAME is required")
    }
    if (password === "") {
        throw new apiError(400, "PASSWORD is required")
    }


    // if([fullname,email,password.username].some((field)=>field?.trim()==="")){
    //     throw new apiError(400, `${field}is required`)
    // }

    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })
    console.log(existedUser);
    // check for user is  allready exist or not
    if (existedUser) {
        throw new apiError(409, "user is already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log(avatarLocalPath);
    console.log(coverImageLocalPath);
    // check for avater is exist
    if (!avatarLocalPath) {
        throw new apiError(400, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) { throw new apiError(400, "avatar is required") }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    // check for user is created or not
    if (!createdUser) {
        throw new apiError(500, "Something went wrong ,while user registration")
    }
    return res.status(201).json(
        new apiResponce(200, createdUser, "User registered successfully")
    )

})

export { registerUser }